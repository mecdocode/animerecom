import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, Plus, Minus, Sparkles, ArrowRight } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import AnimeCard from '../components/AnimeCard';
import { searchAnime } from '../services/anilistApi';
import { useToast } from '../contexts/ToastContext';

const Search = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnime, setSelectedAnime] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['search-anime', searchQuery],
    queryFn: () => searchAnime(searchQuery),
    enabled: searchQuery.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    onError: (error) => {
      toast.error('Search failed. Please try again.');
    }
  });

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleAnimeSelect = (anime) => {
    if (selectedAnime.find(selected => selected.id === anime.id)) {
      // Remove if already selected
      setSelectedAnime(prev => prev.filter(selected => selected.id !== anime.id));
      toast.info(`Removed ${anime.title?.english || anime.title?.romaji}`);
    } else if (selectedAnime.length < 3) {
      // Add if under limit
      setSelectedAnime(prev => [...prev, anime]);
      toast.success(`Added ${anime.title?.english || anime.title?.romaji}`);
    } else {
      toast.warning('You can select up to 3 anime only!');
    }
  };

  const handleRemoveSelected = (animeId) => {
    const anime = selectedAnime.find(a => a.id === animeId);
    setSelectedAnime(prev => prev.filter(selected => selected.id !== animeId));
    toast.info(`Removed ${anime?.title?.english || anime?.title?.romaji}`);
  };

  const handleGetRecommendations = async () => {
    if (selectedAnime.length === 0) {
      toast.warning('Please select at least one anime!');
      return;
    }

    setIsSubmitting(true);
    try {
      navigate('/recommend', {
        state: {
          type: 'seeds',
          data: selectedAnime
        }
      });
    } catch (error) {
      toast.error('Failed to get recommendations. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 bg-paper-100 px-4 py-2 rounded-full mb-4">
            <SearchIcon className="text-cobalt-600" size={20} />
            <span className="font-medium text-ink-900">Search & Select</span>
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl text-ink-900 mb-2">
            Pick Your Favorites
          </h1>
          <p className="text-ink-700 max-w-2xl mx-auto">
            Search for anime you've enjoyed and select 1-3 titles to get personalized recommendations.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <SearchBar
            onSearch={handleSearch}
            onSelect={handleAnimeSelect}
            suggestions={searchResults || []}
            isLoading={isLoading}
            placeholder="Search for anime you've watched..."
          />
        </motion.div>

        {/* Selected Anime */}
        <AnimatePresence>
          {selectedAnime.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className="bg-paper-100 rounded-2xl p-6 ink-border panel-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl text-ink-900">
                    Your Selections ({selectedAnime.length}/3)
                  </h3>
                  <button
                    onClick={handleGetRecommendations}
                    disabled={isSubmitting || selectedAnime.length === 0}
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <Sparkles size={18} />
                    <span>Get Recommendations</span>
                    <ArrowRight size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedAnime.map((anime) => (
                    <motion.div
                      key={anime.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative bg-paper-50 rounded-xl p-4 border-2 border-crimson-600/20"
                    >
                      <button
                        onClick={() => handleRemoveSelected(anime.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-crimson-600 text-paper-50 rounded-full flex items-center justify-center hover:bg-crimson-700 transition-colors z-10"
                      >
                        <Minus size={14} />
                      </button>
                      
                      <div className="flex items-center space-x-3">
                        <img
                          src={anime.coverImage?.medium}
                          alt={anime.title?.english || anime.title?.romaji}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-ink-900 text-sm truncate">
                            {anime.title?.english || anime.title?.romaji}
                          </h4>
                          <p className="text-xs text-ink-700">
                            {anime.startDate?.year} • {anime.format}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        <div className="space-y-6">
          {searchQuery.length >= 2 && (
            <div className="text-center">
              <h3 className="font-display text-2xl text-ink-900 mb-2">
                Search Results for "{searchQuery}"
              </h3>
              <p className="text-ink-700">
                Click on any anime to add it to your selections
              </p>
            </div>
          )}

          {isLoading && searchQuery.length >= 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-[2/3] skeleton rounded-xl" />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-16">
              <div className="speech-bubble inline-block">
                <p className="text-error">Failed to search anime. Please try again.</p>
              </div>
            </div>
          )}

          {searchResults && searchResults.length === 0 && searchQuery.length >= 2 && !isLoading && (
            <div className="text-center py-16">
              <div className="speech-bubble inline-block">
                <p className="text-ink-700">No anime found for "{searchQuery}"</p>
                <p className="text-sm text-ink-700 mt-2">Try a different search term</p>
              </div>
            </div>
          )}

          {searchResults && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {searchResults.map((anime, index) => (
                <AnimeCard
                  key={anime.id}
                  anime={anime}
                  onAddAsSeed={handleAnimeSelect}
                  isSelected={selectedAnime.some(selected => selected.id === anime.id)}
                  showActions={true}
                  index={index}
                  clickable={true}
                />
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {searchQuery.length < 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-paper-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchIcon className="text-ink-700" size={32} />
              </div>
              <h3 className="font-display text-2xl text-ink-900 mb-2">
                Start Searching
              </h3>
              <p className="text-ink-700 mb-8 max-w-md mx-auto">
                Type at least 2 characters to search through our database of 10,000+ anime titles.
              </p>
              
              {/* Popular Suggestions */}
              <div className="max-w-2xl mx-auto">
                <h4 className="font-medium text-ink-900 mb-4">Popular Searches:</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    'Attack on Titan', 'Demon Slayer', 'My Hero Academia', 
                    'One Piece', 'Naruto', 'Death Note', 'Spirited Away', 'Your Name'
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setSearchQuery(suggestion)}
                      className="px-3 py-1 bg-paper-100 hover:bg-cobalt-600/10 text-ink-700 hover:text-cobalt-600 rounded-full text-sm transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
