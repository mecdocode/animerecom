import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, RefreshCw, Filter, SortAsc, Star, Calendar, Play } from 'lucide-react';
import AnimeCard from '../components/AnimeCard';
import { getQuizRecommendations, getSeedRecommendations } from '../services/recommendationApi';
import { fetchAnimeByTitles } from '../services/anilistApi';
import { useToast } from '../contexts/ToastContext';

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState('score');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedAnime, setSelectedAnime] = useState(null);

  const { type, data } = location.state || {};

  // Redirect if no data
  useEffect(() => {
    if (!type || !data) {
      toast.error('No recommendation data found. Please start over.');
      navigate('/');
    }
  }, [type, data, navigate, toast]);

  // Get AI recommendations
  const { data: aiRecommendations, isLoading: isLoadingAI, error: aiError } = useQuery({
    queryKey: ['ai-recommendations', type, data],
    queryFn: async () => {
      if (type === 'quiz') {
        return await getQuizRecommendations(data);
      } else if (type === 'seeds') {
        return await getSeedRecommendations(data);
      }
      throw new Error('Invalid recommendation type');
    },
    enabled: !!type && !!data,
    staleTime: 10 * 60 * 1000, // 10 minutes
    onError: (error) => {
      toast.error('Failed to get AI recommendations. Showing fallback results.');
    }
  });

  // Fetch anime details from AniList
  const { data: animeDetails, isLoading: isLoadingDetails, error: detailsError } = useQuery({
    queryKey: ['anime-details', aiRecommendations?.titles],
    queryFn: () => fetchAnimeByTitles(aiRecommendations.titles),
    enabled: !!aiRecommendations?.titles,
    staleTime: 30 * 60 * 1000, // 30 minutes
    onError: (error) => {
      toast.error('Failed to fetch anime details from AniList.');
    }
  });

  const handleAnimeSelect = (anime) => {
    setSelectedAnime(anime);
    navigate(`/anime/${anime.id}`);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleTweakPreferences = () => {
    if (type === 'quiz') {
      navigate('/quiz');
    } else {
      navigate('/search');
    }
  };

  // Filter and sort anime
  const processedAnime = React.useMemo(() => {
    if (!animeDetails) return [];

    // Process all anime results without limiting to 6
    let filtered = animeDetails
      .filter(item => item.anime) // Only include successfully matched anime
      .map(item => ({ ...item.anime, confidence: item.confidence }))
      .filter((anime, index, array) => 
        array.findIndex(a => a.id === anime.id) === index
      ); // Remove duplicates by ID

    // Apply filters
    if (filterBy !== 'all') {
      filtered = filtered.filter(anime => {
        switch (filterBy) {
          case 'high-score':
            return anime.meanScore >= 80;
          case 'recent':
            return anime.startDate?.year >= 2020;
          case 'classic':
            return anime.startDate?.year <= 2010;
          case 'movie':
            return anime.format === 'MOVIE';
          case 'tv':
            return anime.format === 'TV';
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.meanScore || 0) - (a.meanScore || 0);
        case 'year':
          return (b.startDate?.year || 0) - (a.startDate?.year || 0);
        case 'popularity':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'confidence':
          const confidenceOrder = { high: 3, medium: 2, low: 1 };
          return (confidenceOrder[b.confidence] || 0) - (confidenceOrder[a.confidence] || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [animeDetails, sortBy, filterBy]);

  const isLoading = isLoadingAI || isLoadingDetails;
  const hasError = aiError || detailsError;

  if (!type || !data) {
    return null;
  }

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
            <Sparkles className="text-crimson-600" size={20} />
            <span className="font-medium text-ink-900">
              {type === 'quiz' ? 'Quiz Results' : 'Seed-Based Recommendations'}
            </span>
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl text-ink-900 mb-2">
            Your Personalized Recommendations
          </h1>
          
          {type === 'seeds' && data?.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span className="text-ink-700">Based on:</span>
              {data.map((anime, index) => (
                <span key={anime.id} className="bg-cobalt-600/10 text-cobalt-600 px-2 py-1 rounded text-sm">
                  {anime.title?.english || anime.title?.romaji}
                </span>
              ))}
            </div>
          )}
          
          <p className="text-ink-700 max-w-2xl mx-auto">
            Discover your next favorite anime with AI-powered recommendations tailored just for you.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8"
        >
          <div className="flex items-center space-x-4">
            {/* Sort */}
            <div className="flex items-center space-x-2">
              <SortAsc size={18} className="text-ink-700" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-paper-100 border border-ink-900/20 rounded-lg px-3 py-2 text-sm focus:border-cobalt-600 focus:ring-1 focus:ring-cobalt-600"
              >
                <option value="score">Highest Rated</option>
                <option value="year">Newest First</option>
                <option value="popularity">Most Popular</option>
                <option value="confidence">Best Match</option>
              </select>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-ink-700" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="bg-paper-100 border border-ink-900/20 rounded-lg px-3 py-2 text-sm focus:border-cobalt-600 focus:ring-1 focus:ring-cobalt-600"
              >
                <option value="all">All Anime</option>
                <option value="high-score">High Rated (8.0+)</option>
                <option value="recent">Recent (2020+)</option>
                <option value="classic">Classic (Pre-2010)</option>
                <option value="tv">TV Series</option>
                <option value="movie">Movies</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleTweakPreferences}
              className="btn-secondary text-sm"
            >
              Tweak Preferences
            </button>
            <button
              onClick={handleRetry}
              className="btn-primary text-sm inline-flex items-center space-x-2"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-paper-100 px-4 py-2 rounded-full">
                <Sparkles className="text-cobalt-600 animate-spin" size={20} />
                <span className="text-ink-900">
                  {isLoadingAI ? 'Getting AI recommendations...' : 'Fetching anime details...'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="aspect-[2/3] skeleton rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && !isLoading && (
          <div className="text-center py-16">
            <div className="speech-bubble inline-block max-w-md">
              <p className="text-error mb-4">
                Oops! Something went wrong while getting your recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button onClick={handleRetry} className="btn-primary text-sm">
                  Try Again
                </button>
                <button onClick={handleTweakPreferences} className="btn-secondary text-sm">
                  Start Over
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {!isLoading && !hasError && processedAnime.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Stats */}
            <div className="text-center mb-8">
              <p className="text-ink-700">
                Found <span className="font-semibold text-ink-900">{processedAnime.length}</span> recommendations
                {aiRecommendations?.source === 'fallback' && (
                  <span className="text-warn ml-2">(Using fallback recommendations)</span>
                )}
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {processedAnime.map((anime, index) => (
                <div key={anime.id} className="relative">
                  <AnimeCard
                    anime={anime}
                    onSelect={handleAnimeSelect}
                    showActions={true}
                    index={index}
                    clickable={true}
                  />
                  
                  {/* Confidence Badge */}
                  {anime.confidence && anime.confidence !== 'high' && (
                    <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium ${
                      anime.confidence === 'medium' 
                        ? 'bg-warn/20 text-warn' 
                        : 'bg-error/20 text-error'
                    }`}>
                      {anime.confidence === 'medium' ? 'Similar' : 'Loose Match'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !hasError && processedAnime.length === 0 && (
          <div className="text-center py-16">
            <div className="speech-bubble inline-block max-w-md">
              <p className="text-ink-700 mb-4">
                No anime found matching your current filters.
              </p>
              <button
                onClick={() => setFilterBy('all')}
                className="btn-secondary text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
