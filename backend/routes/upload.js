const express = require('express')
const multer = require('multer')
const axios = require('axios')
const FormData = require('form-data')
const path = require('path')
const fs = require('fs')

const router = express.Router()

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000'

// Multer configuration — store to disk temporarily
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  const allowedExts = ['.pdf', '.docx']
  const ext = path.extname(file.originalname).toLowerCase()

  if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Only PDF and DOCX files are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})

// POST /api/upload
router.post('/', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  const filePath = req.file.path
  const originalName = req.file.originalname

  console.log(`📄 Received: ${originalName} (${req.file.size} bytes)`)

  try {
    // Forward to ML service
    const formData = new FormData()
    formData.append('file', fs.createReadStream(filePath), {
      filename: originalName,
      contentType: req.file.mimetype,
    })

    const mlResponse = await axios.post(`${ML_SERVICE_URL}/parse`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 60000,
    })

    // Clean up temp file
    fs.unlink(filePath, (err) => {
      if (err) console.warn('Warning: Could not delete temp file:', filePath)
    })

    console.log(`✅ Parsed successfully: ${originalName}`)
    return res.json(mlResponse.data)

  } catch (error) {
    // Clean up temp file
    try { fs.unlinkSync(filePath) } catch {}

    console.error('ML service error:', error.message)

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'ML parsing service is not running. Please start the Python service on port 8000.',
        hint: 'Run: cd ml-service && python app.py',
      })
    }

    return res.status(500).json({
      error: error.response?.data?.error || error.message || 'Failed to parse resume',
    })
  }
})

// Multer error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' })
    }
    return res.status(400).json({ error: err.message })
  }
  if (err) {
    return res.status(400).json({ error: err.message })
  }
  next()
})

module.exports = router
