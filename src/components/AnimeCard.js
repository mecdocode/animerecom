import React, { useState, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Plus, Check, Play, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AnimeCard({
  anime,
  onSelect,
  onAddAsSeed,
  isSelected = false,
  showActions = true,
  index = 0,
  clickable = false,
}) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback(() => setImageError(true), []);

  const formatScore = useCallback((score) => {
    return score ? (score / 10).toFixed(1) : 'N/A';
  }, []);

  const formatGenres = useCallback((genres) => {
    if (!genres || genres.length === 0) return [];
    return genres.slice(0, 3);
  }, []);

  const handleCardClick = useCallback(() => {
    if (clickable && anime.id) {
      navigate(`/anime/${anime.id}`);
    }
  }, [anime, clickable, navigate]);

  const handleSelect = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelect) {
      onSelect(anime);
    }
  }, [anime, onSelect]);

  const handleAddAsSeedClick = useCallback((e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(anime);
    }
  }, [anime, onSelect]);

  const handleDetailsClick = useCallback((e) => {
    e.stopPropagation();
    if (anime.id) {
      navigate(`/anime/${anime.id}`);
    }
  }, [anime, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.2, 
        delay: index * 0.012,
        ease: 'easeOut' 
      }}
      className={`group relative bg-paper-100 rounded-xl overflow-hidden card-hover panel-shadow ${
        isSelected ? 'ring-2 ring-crimson-600' : ''
      } ${clickable ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      {/* Cover Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 skeleton" />
        )}
        
        {imageError ? (
          <div className="absolute inset-0 bg-halftone-gray flex items-center justify-center">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-ink-900/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart size={24} className="text-ink-900/30" />
              </div>
              <p className="text-xs text-ink-700">No Image</p>
            </div>
          </div>
        ) : (
          <img
            src={anime.coverImage?.large || anime.coverImage?.medium}
            alt={anime.title?.english || anime.title?.romaji}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full object-cover transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-105`}
          />
        )}

        {/* Score Badge */}
        {anime.meanScore && (
          <div className="absolute top-2 right-2 bg-ink-900/80 backdrop-blur-sm text-paper-50 px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1">
            <Star size={12} className="text-warn fill-current" />
            <span>{formatScore(anime.meanScore)}</span>
          </div>
        )}

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute top-2 left-2 bg-crimson-600 text-paper-50 p-1 rounded-full">
            <Plus size={16} className="rotate-45" />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" ></div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-ink-900 text-sm mb-2 line-clamp-2 leading-tight">
          {anime.title?.english || anime.title?.romaji || 'Unknown Title'}
        </h3>

        {/* Synopsis */}
        {anime.description && (
          <p className="text-xs text-ink-700 text-clamp-3 mb-3 leading-relaxed">
            {anime.description.replace(/<[^>]*>/g, '')}
          </p>
        )}

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {formatGenres(anime.genres).map((genre, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-paper-200 text-ink-700 text-xs rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-ink-700 mb-3">
          <span>{anime.format || 'TV'}</span>
          {anime.episodes && <span>{anime.episodes} eps</span>}
          {anime.startDate?.year && <span>{anime.startDate.year}</span>}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={handleDetailsClick}
              className="flex-1 bg-ink-900 hover:bg-ink-800 text-paper-50 text-xs py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              <ExternalLink size={12} />
              <span>Details</span>
            </button>
            
            {onAddAsSeed && (
              <button
                onClick={handleAddAsSeedClick}
                className={`px-3 py-2 rounded-lg text-xs transition-all duration-200 ${
                  isSelected
                    ? 'bg-crimson-600 text-paper-50'
                    : 'bg-paper-200 hover:bg-cobalt-600 hover:text-paper-50 text-ink-700'
                }`}
              >
                <Plus size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Torn Paper Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-paper-200 opacity-50" 
           style={{
             clipPath: 'polygon(0 0, 100% 0, 98% 100%, 95% 80%, 90% 100%, 85% 70%, 80% 100%, 75% 60%, 70% 100%, 65% 80%, 60% 100%, 55% 70%, 50% 100%, 45% 80%, 40% 100%, 35% 60%, 30% 100%, 25% 80%, 20% 100%, 15% 70%, 10% 100%, 5% 80%, 0 100%)'
           }} 
      />
    </motion.div>
  );
}

export default memo(AnimeCard);
