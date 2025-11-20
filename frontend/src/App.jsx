import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './components/Dashboard'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogArticle from './pages/BlogArticle'
import PasswordCheckerPage from './pages/PasswordCheckerPage'
import FileScannerPage from './pages/FileScannerPage'
import UrlScannerPage from './pages/UrlScannerPage'
import FileScanAnalysis from './pages/FileScanAnalysis'
import UrlScanAnalysis from './pages/UrlScanAnalysis'
import PasswordScanAnalysis from './pages/PasswordScanAnalysis'
import './index.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogArticle />} />
        <Route path="/password-checker" element={<PasswordCheckerPage />} />
        <Route path="/file-scanner" element={<FileScannerPage />} />
        <Route path="/url-scanner" element={<UrlScannerPage />} />
        <Route path="/file-scan-analysis" element={<FileScanAnalysis />} />
        <Route path="/url-scan-analysis" element={<UrlScanAnalysis />} />
        <Route path="/password-scan-analysis" element={<PasswordScanAnalysis />} />
      </Routes>
    </Router>
  )
}
