import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, HelpCircle, Menu, X } from 'lucide-react';

const AppShell = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/quiz', label: 'Quiz', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-200 ${
          isScrolled 
            ? 'bg-paper-50/90 border-ink-900/20 shadow-panel' 
            : 'bg-paper-50/70 border-ink-900/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-ink-900 rounded-lg flex items-center justify-center">
                <span className="text-paper-50 font-display text-lg">A</span>
              </div>
              <span className="font-display text-2xl text-ink-900">AnimeRec</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === path
                      ? 'bg-ink-900 text-paper-50'
                      : 'text-ink-900 hover:bg-paper-100'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-paper-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden py-4 border-t border-ink-900/10"
            >
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    location.pathname === path
                      ? 'bg-ink-900 text-paper-50'
                      : 'text-ink-900 hover:bg-paper-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </motion.nav>
          )}
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-paper-100 border-t border-ink-900/10 halftone-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-ink-900 rounded flex items-center justify-center">
                  <span className="text-paper-50 font-display text-sm">A</span>
                </div>
                <span className="font-display text-xl text-ink-900">AnimeRec</span>
              </div>
              <p className="text-ink-700 text-sm">
                Discover your next favorite anime with AI-powered recommendations.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-ink-900 mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-ink-700 hover:text-ink-900 transition-colors">Home</Link></li>
                <li><Link to="/quiz" className="text-ink-700 hover:text-ink-900 transition-colors">Take Quiz</Link></li>
                <li><Link to="/search" className="text-ink-700 hover:text-ink-900 transition-colors">Search Anime</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-ink-900 mb-3">About</h3>
              <p className="text-ink-700 text-sm">
                Powered by AniList API and OpenRouter AI for the best anime recommendations.
              </p>
            </div>
          </div>
          
          <div className="border-t border-ink-900/10 mt-8 pt-6 text-center">
            <p className="text-ink-700 text-sm">
              © 2024 AnimeRec. Built with ❤️ for anime fans.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppShell;
