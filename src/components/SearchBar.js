import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, Clock } from 'lucide-react';

const SearchBar = ({ 
  onSearch, 
  onSelect, 
  suggestions = [], 
  isLoading = false, 
  placeholder = "Search anime...",
  showHistory = true 
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Load search history from localStorage
  useEffect(() => {
    if (showHistory) {
      const savedHistory = localStorage.getItem('anime-search-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    }
  }, [showHistory]);

  // Handle search with debouncing
  useEffect(() => {
    if (query.length >= 2) {
      const timeoutId = setTimeout(() => {
        onSearch?.(query);
      }, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [query, onSearch]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length >= 2 || (value.length === 0 && history.length > 0));
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    setIsOpen(query.length >= 2 || (query.length === 0 && history.length > 0));
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSelect = (item) => {
    const searchTerm = typeof item === 'string' ? item : item.title?.english || item.title?.romaji;
    setQuery(searchTerm);
    setIsOpen(false);
    setSelectedIndex(-1);
    
    // Add to history
    if (showHistory && searchTerm) {
      const newHistory = [searchTerm, ...history.filter(h => h !== searchTerm)].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem('anime-search-history', JSON.stringify(newHistory));
    }
    
    onSelect?.(item);
  };

  const handleKeyDown = (e) => {
    const items = query.length >= 2 ? suggestions : history;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev <= 0 ? items.length - 1 : prev - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && items[selectedIndex]) {
        handleSelect(items[selectedIndex]);
      } else if (query.length >= 2) {
        onSearch?.(query);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('anime-search-history');
  };

  const displayItems = query.length >= 2 ? suggestions : history;
  const showDropdown = isOpen && (displayItems.length > 0 || isLoading);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-ink-700" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-paper-100 border-2 border-ink-900/20 rounded-xl focus:border-cobalt-600 focus:ring-2 focus:ring-cobalt-600/20 transition-all duration-200 text-ink-900 placeholder-ink-700/60"
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-ink-900 text-ink-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.9, y: -10 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.9, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 bg-paper-100 border-2 border-ink-900/20 rounded-xl shadow-panel max-h-80 overflow-y-auto z-50"
          >
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-cobalt-600" />
                <span className="ml-2 text-sm text-ink-700">Searching...</span>
              </div>
            )}

            {/* No Results */}
            {!isLoading && query.length >= 2 && suggestions.length === 0 && (
              <div className="p-4 text-center">
                <div className="speech-bubble inline-block">
                  <p className="text-sm text-ink-700">No anime found for "{query}"</p>
                </div>
              </div>
            )}

            {/* History Header */}
            {query.length < 2 && history.length > 0 && (
              <div className="flex items-center justify-between px-4 py-2 border-b border-ink-900/10">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-ink-700" />
                  <span className="text-sm font-medium text-ink-700">Recent Searches</span>
                </div>
                <button
                  onClick={clearHistory}
                  className="text-xs text-ink-700 hover:text-ink-900 transition-colors"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Items */}
            {displayItems.map((item, index) => {
              const isString = typeof item === 'string';
              const title = isString ? item : (item.title?.english || item.title?.romaji);
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={isString ? item : item.id}
                  onClick={() => handleSelect(item)}
                  className={`w-full px-4 py-3 text-left hover:bg-paper-200 transition-colors border-b border-ink-900/5 last:border-b-0 ${
                    isSelected ? 'bg-cobalt-600/10' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {!isString && item.coverImage && (
                      <img
                        src={item.coverImage.medium}
                        alt={title}
                        className="w-8 h-12 object-cover rounded"
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900 truncate">
                        {title}
                      </p>
                      
                      {!isString && item.startDate?.year && (
                        <p className="text-xs text-ink-700">
                          {item.startDate.year} • {item.format}
                        </p>
                      )}
                    </div>
                    
                    {isString && (
                      <Clock className="h-4 w-4 text-ink-700/50" />
                    )}
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
