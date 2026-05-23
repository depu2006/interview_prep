import React from 'react'
import './Navbar.css'

const Navbar = ({ onLogoClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="navbar-logo" onClick={onLogoClick} id="nav-logo-btn">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="logo-text">
            ClearHire <span className="gradient-text">AI</span>
          </span>
        </button>

        <div className="navbar-center">
          <div className="module-badge">
            <span className="module-dot" />
            Module 1 — Resume Parser
          </div>
        </div>

        <div className="navbar-right">
          <span className="nav-version">v1.0</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
