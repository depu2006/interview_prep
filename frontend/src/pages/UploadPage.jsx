import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import axios from 'axios'
import './UploadPage.css'

const UploadPage = ({ onParseComplete }) => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')

  const onDrop = useCallback((acceptedFiles) => {
    setError(null)
    if (acceptedFiles.length > 0) {
      const f = acceptedFiles[0]
      const ext = f.name.split('.').pop().toLowerCase()
      if (!['pdf', 'docx'].includes(ext)) {
        setError('Only PDF and DOCX files are supported.')
        return
      }
      setFile(f)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleParse = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setProgress(0)

    try {
      const steps = [
        { label: 'Uploading resume...', pct: 20 },
        { label: 'Extracting text content...', pct: 45 },
        { label: 'Running NLP analysis...', pct: 70 },
        { label: 'Identifying skills...', pct: 88 },
        { label: 'Structuring data...', pct: 100 },
      ]

      // Animate progress while uploading
      let stepIdx = 0
      const tick = () => {
        if (stepIdx < steps.length) {
          setProgressLabel(steps[stepIdx].label)
          setProgress(steps[stepIdx].pct)
          stepIdx++
        }
      }
      tick()
      const timer = setInterval(tick, 800)

      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('https://interview-prep-vepv.onrender.com/api/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      })

      clearInterval(timer)
      setProgress(100)
      setProgressLabel('Complete!')

      setTimeout(() => {
        onParseComplete(response.data)
      }, 500)
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Failed to parse resume. Please try again.'
      )
      setLoading(false)
      setProgress(0)
      setProgressLabel('')
    }
  }

  const handleRemove = () => {
    setFile(null)
    setError(null)
    setProgress(0)
    setProgressLabel('')
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  }

  return (
    <motion.div 
      className="upload-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div className="upload-hero" variants={itemVariants}>
        <div className="hero-chip">
          <span className="chip-dot" />
          AI-Powered Explainability
        </div>
        <h1 className="hero-title">
          Understand Your <span className="gradient-text">Rejection</span>
        </h1>
        <p className="hero-subtitle">
          Upload your resume to get AI-driven insights on your application,
          understand key decision factors, and discover how to improve your chances.
        </p>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value">7+</span>
            <span className="stat-label">Data Fields</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">50+</span>
            <span className="stat-label">Skills Detected</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">NLP</span>
            <span className="stat-label">Powered Parser</span>
          </div>
        </div>
      </motion.div>

      {/* Upload Card */}
      <motion.div className="upload-card-wrapper" variants={itemVariants}>
        <div className={`upload-card glass-card ${file ? 'has-file' : ''}`}>

          {!file ? (
            /* Dropzone */
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
              id="resume-dropzone"
            >
              <input {...getInputProps()} id="resume-file-input" />

              <div className="dropzone-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M17 8L12 3L7 8" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3V15" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="grad1" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#8b5cf6"/>
                      <stop offset="1" stopColor="#d946ef"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="dropzone-text">
                <p className="dropzone-primary">
                  {isDragActive ? 'Drop your resume here!' : 'Drag & drop your resume'}
                </p>
                <p className="dropzone-secondary">
                  or <span className="browse-link">browse files</span>
                </p>
                <p className="dropzone-hint">Supports PDF and DOCX · Max 10MB</p>
              </div>

              <div className="format-badges">
                <span className="format-badge pdf">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  </svg>
                  PDF
                </span>
                <span className="format-badge docx">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  </svg>
                  DOCX
                </span>
              </div>
            </div>
          ) : (
            /* File Preview */
            <div className="file-preview">
              <div className="file-info">
                <div className="file-icon">
                  {file.name.endsWith('.pdf') ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#ef4444" strokeWidth="2"/>
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#3b82f6" strokeWidth="2"/>
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                <div className="file-details">
                  <p className="file-name">{file.name}</p>
                  <p className="file-meta">
                    {formatSize(file.size)} · {file.name.split('.').pop().toUpperCase()}
                  </p>
                </div>
                <div className="file-status-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="2"/>
                    <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {loading && (
                <div className="progress-section">
                  <div className="progress-header">
                    <span className="progress-label">{progressLabel}</span>
                    <span className="progress-pct">{progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div 
                      className="progress-fill" 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}

              <div className="file-actions">
                <button
                  className="btn-secondary"
                  onClick={handleRemove}
                  disabled={loading}
                  id="remove-file-btn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Remove
                </button>
                <button
                  className="btn-primary"
                  onClick={handleParse}
                  disabled={loading}
                  id="parse-resume-btn"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      Parsing...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Parse Resume
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <motion.div 
            className="error-message" 
            id="upload-error"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </motion.div>
        )}

        {/* Feature pills */}
        <motion.div className="features-row" variants={itemVariants}>
          {[
            { icon: '🔍', label: 'NLP Skill Extraction' },
            { icon: '📊', label: 'Structured Parsing' },
            { icon: '🎯', label: 'Education Detection' },
            { icon: '🔒', label: 'Private & Secure' },
          ].map((f) => (
            <motion.div 
              className="feature-pill" 
              key={f.label}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default UploadPage
