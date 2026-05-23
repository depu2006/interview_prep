require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const uploadRouter = require('./routes/upload')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}))
app.use(express.json())

// Routes
app.use('/api/upload', uploadRouter)

// New Evaluation Endpoint
app.post('/api/evaluate', async (req, res) => {
  const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
  try {
    const axios = require('axios');
    const response = await axios.post(`${ML_SERVICE_URL}/evaluate`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Evaluation proxy error:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error || 'Evaluation service error' 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Why Did You Reject Me? — Backend',
    timestamp: new Date().toISOString(),
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`\n🚀 Backend running at http://localhost:${PORT}`)
  console.log(`   ML Service expected at http://localhost:8000`)
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`)
})
