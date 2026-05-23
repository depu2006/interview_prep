import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LandingPage from './pages/LandingPage'
import UploadPage from './pages/UploadPage'
import ResultsPage from './pages/ResultsPage'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [parsedData, setParsedData] = useState(null)
  const [currentPage, setCurrentPage] = useState('landing') // 'landing' | 'upload' | 'results'

  const handleStart = () => {
    setCurrentPage('upload')
  }

  const handleParseComplete = (data) => {
    setParsedData(data)
    setCurrentPage('results')
  }

  const handleReset = () => {
    setParsedData(null)
    setCurrentPage('upload')
  }

  return (
    <div className={`app-wrapper ${currentPage !== 'landing' ? 'with-nav' : ''}`}>
      <AnimatePresence>
        {currentPage !== 'landing' && (
          <motion.div
            key="navbar-container"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'relative', zIndex: 100 }}
          >
            <Navbar onLogoClick={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <main className="app-main">
        <AnimatePresence mode="wait">
          {currentPage === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <LandingPage onStart={handleStart} />
            </motion.div>
          )}
          {currentPage === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <UploadPage onParseComplete={handleParseComplete} />
            </motion.div>
          )}
          {currentPage === 'results' && parsedData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <ResultsPage data={parsedData} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
