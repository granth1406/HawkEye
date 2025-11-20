import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar({ user = null, onLogout = null }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)
  const menuRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const profileButtonRef = useRef(null)

  // Get user from localStorage if not passed as prop
  useEffect(() => {
    const storedUser = localStorage.getItem('hawkeye_user')
    setCurrentUser(user || storedUser)
  }, [user])

  // Close menu when clicking outside or on Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowProfileMenu(false)
        setShowMobileMenu(false)
      }
    }

    if (showProfileMenu || showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [showProfileMenu, showMobileMenu])

  const isActive = (path) => {
    return location.pathname === path ? 'text-cyan-400 font-semibold' : 'text-gray-300 hover:text-cyan-400'
  }

  const handleLogout = () => {
    setShowProfileMenu(false)
    setShowMobileMenu(false)
    localStorage.removeItem('hawkeye_token')
    localStorage.removeItem('hawkeye_user')
    setCurrentUser(null)
    navigate('/')
    if (onLogout) {
      onLogout()
    }
  }

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  const handleNavigate = (path) => {
    navigate(path)
    setShowProfileMenu(false)
    setShowMobileMenu(false)
  }

  return (
    <nav className="fixed w-full bg-gray-900/95 backdrop-blur-md z-50 border-b border-gray-800" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Text */}
          <button 
            onClick={() => handleNavigate('/')}
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent hidden sm:inline focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
            aria-label="HawkEye Home"
          >
            HawkEye
          </button>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            <button 
              onClick={() => handleNavigate('/')} 
              className={`transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 px-2 py-1 rounded ${isActive('/')}`}
              role="menuitem"
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigate('/features')} 
              className={`transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 px-2 py-1 rounded ${isActive('/features')}`}
              role="menuitem"
              aria-current={location.pathname === '/features' ? 'page' : undefined}
            >
              Features
            </button>
            <button 
              onClick={() => handleNavigate('/pricing')} 
              className={`transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 px-2 py-1 rounded ${isActive('/pricing')}`}
              role="menuitem"
              aria-current={location.pathname === '/pricing' ? 'page' : undefined}
            >
              Pricing
            </button>
            <button 
              onClick={() => handleNavigate('/about')} 
              className={`transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 px-2 py-1 rounded ${isActive('/about')}`}
              role="menuitem"
              aria-current={location.pathname === '/about' ? 'page' : undefined}
            >
              About
            </button>
            <button 
              onClick={() => handleNavigate('/blog')} 
              className={`transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 px-2 py-1 rounded ${isActive('/blog')}`}
              role="menuitem"
              aria-current={location.pathname === '/blog' ? 'page' : undefined}
            >
              Blog
            </button>
          </div>

          {/* Right Side - Profile Icon or Login Button + Hamburger */}
          <div className="flex items-center gap-4 relative">
            {/* Profile Icon */}
            <div ref={menuRef}>
              {currentUser ? (
                <>
                  <button
                    ref={profileButtonRef}
                    onClick={handleProfileClick}
                    className="relative w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center text-white font-bold text-lg flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    aria-label={`Profile menu for ${currentUser}`}
                    aria-expanded={showProfileMenu}
                    aria-haspopup="menu"
                  >
                    {currentUser.charAt(0).toUpperCase()}
                  </button>
                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div 
                      className="absolute right-0 mt-2 top-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-48 py-2 z-50"
                      role="menu"
                      aria-labelledby="profile-button"
                    >
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-gray-300 text-sm">Signed in as</p>
                        <p className="text-cyan-400 font-semibold text-sm truncate">{currentUser}</p>
                      </div>
                      <button
                        onClick={() => handleNavigate('/dashboard')}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700/50 transition-colors text-sm focus:outline-none focus:bg-gray-700/50"
                        role="menuitem"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors text-sm border-t border-gray-700 focus:outline-none focus:bg-red-500/10"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all font-semibold text-sm flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label="Login to account"
                >
                  Login
                </button>
              )}
            </div>

            {/* Hamburger Menu Button - Mobile */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden flex-shrink-0 p-2 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label="Toggle mobile menu"
              aria-expanded={showMobileMenu}
              aria-haspopup="menu"
            >
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div ref={mobileMenuRef} className="md:hidden border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm max-h-96 overflow-y-auto" role="menu">
            <div className="py-2 space-y-1">
              <button 
                onClick={() => handleNavigate('/')} 
                className={`block w-full text-left py-2 px-4 rounded transition-colors text-sm focus:outline-none focus:bg-gray-700/50 ${isActive('/')}`}
                role="menuitem"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigate('/features')} 
                className={`block w-full text-left py-2 px-4 rounded transition-colors text-sm focus:outline-none focus:bg-gray-700/50 ${isActive('/features')}`}
                role="menuitem"
              >
                Features
              </button>
              <button 
                onClick={() => handleNavigate('/pricing')} 
                className={`block w-full text-left py-2 px-4 rounded transition-colors text-sm focus:outline-none focus:bg-gray-700/50 ${isActive('/pricing')}`}
                role="menuitem"
              >
                Pricing
              </button>
              <button 
                onClick={() => handleNavigate('/about')} 
                className={`block w-full text-left py-2 px-4 rounded transition-colors text-sm focus:outline-none focus:bg-gray-700/50 ${isActive('/about')}`}
                role="menuitem"
              >
                About
              </button>
              <button 
                onClick={() => handleNavigate('/blog')} 
                className={`block w-full text-left py-2 px-4 rounded transition-colors text-sm focus:outline-none focus:bg-gray-700/50 ${isActive('/blog')}`}
                role="menuitem"
              >
                Blog
              </button>
              {currentUser && (
                <>
                  <div className="border-t border-gray-700 my-2"></div>
                  <button
                    onClick={() => handleNavigate('/dashboard')}
                    className="w-full text-left py-2 px-4 text-cyan-400 hover:bg-gray-700 transition-colors text-sm focus:outline-none focus:bg-gray-700"
                    role="menuitem"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 px-4 text-red-400 hover:bg-red-500/10 transition-colors text-sm focus:outline-none focus:bg-red-500/10"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
