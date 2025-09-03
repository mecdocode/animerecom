import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Play, Search, HelpCircle, TrendingUp, Sparkles } from 'lucide-react';
import { fetchTrendingAnime } from '../services/anilistApi';
import AnimeCard from '../components/AnimeCard';
import { useToast } from '../contexts/ToastContext';

const Landing = () => {
  const { toast } = useToast();
  const [selectedAnime, setSelectedAnime] = useState(null);

  const { data: trendingAnime, isLoading, error } = useQuery({
    queryKey: ['trending-anime'],
    queryFn: () => fetchTrendingAnime(1, 20),
    staleTime: 10 * 60 * 1000, // 10 minutes
    onError: (error) => {
      toast.error('Failed to load trending anime. Please try again later.');
    }
  });

  const handleAnimeSelect = (anime) => {
    setSelectedAnime(anime);
    // Could open modal or navigate to details page
    toast.info(`Selected: ${anime.title?.english || anime.title?.romaji}`);
  };

  const letterVariants = {
    hidden: { y: 8, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.025,
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  };

  const title = "Discover Your Next Favorite Anime";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-paper-50 to-paper-100">
        <div className="absolute inset-0 halftone-bg opacity-30" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Panel - Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-center lg:text-left"
            >
              {/* Animated Title */}
              <h1 className="font-display text-4xl md:text-6xl text-ink-900 mb-6 leading-tight">
                {title.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-xl text-ink-700 mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Get personalized anime recommendations powered by AI. Whether you're a beginner or a seasoned otaku, find your perfect match!
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/quiz" className="btn-primary inline-flex items-center justify-center space-x-2">
                  <HelpCircle size={20} />
                  <span>Take the Quiz</span>
                  <Sparkles size={16} />
                </Link>
                
                <Link to="/search" className="btn-secondary inline-flex items-center justify-center space-x-2">
                  <Search size={20} />
                  <span>Pick Your Favorites</span>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="mt-12 grid grid-cols-3 gap-6 text-center lg:text-left"
              >
                <div>
                  <div className="font-display text-2xl text-crimson-600">10K+</div>
                  <div className="text-sm text-ink-700">Anime Database</div>
                </div>
                <div>
                  <div className="font-display text-2xl text-cobalt-600">AI-Powered</div>
                  <div className="text-sm text-ink-700">Recommendations</div>
                </div>
                <div>
                  <div className="font-display text-2xl text-ink-900">Real-time</div>
                  <div className="text-sm text-ink-700">Search</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Panel - Preview Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-crimson-600/20 to-cobalt-600/20 rounded-2xl blur-xl" />
              <div className="relative bg-paper-100 rounded-2xl p-6 ink-border panel-shadow">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="text-crimson-600" size={20} />
                  <h3 className="font-display text-xl text-ink-900">Trending Now</h3>
                </div>
                
                {isLoading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="aspect-[2/3] skeleton rounded-lg" />
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <div className="speech-bubble inline-block">
                      <p className="text-sm text-error">Failed to load trending anime</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {trendingAnime?.slice(0, 4).map((anime, index) => (
                      <div key={anime.id} className="transform scale-75 origin-top-left">
                        <AnimeCard
                          anime={anime}
                          onSelect={handleAnimeSelect}
                          showActions={false}
                          index={index}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 bg-paper-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl text-ink-900 mb-4">
              What's Trending
            </h2>
            <p className="text-lg text-ink-700 max-w-2xl mx-auto">
              Discover the most popular anime right now, updated in real-time from the community.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="aspect-[2/3] skeleton rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="speech-bubble inline-block">
                <p className="text-error mb-4">Failed to load trending anime</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-secondary text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {trendingAnime?.map((anime, index) => (
                <AnimeCard
                  key={anime.id}
                  anime={anime}
                  onSelect={handleAnimeSelect}
                  showActions={true}
                  index={index}
                  clickable={true}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-paper-100 halftone-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl text-ink-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-ink-700 max-w-2xl mx-auto">
              Get personalized recommendations in just a few simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Quiz Path */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-paper-50 rounded-2xl p-8 ink-border panel-shadow"
            >
              <div className="w-12 h-12 bg-crimson-600 rounded-full flex items-center justify-center mb-4">
                <HelpCircle className="text-paper-50" size={24} />
              </div>
              <h3 className="font-display text-2xl text-ink-900 mb-4">Beginner Quiz</h3>
              <p className="text-ink-700 mb-6">
                New to anime? Take our 5-question quiz to discover your preferences and get tailored recommendations.
              </p>
              <ul className="space-y-2 text-sm text-ink-700 mb-6">
                <li>• Choose your preferred genres and vibes</li>
                <li>• Set your content comfort level</li>
                <li>• Get 15-20 personalized recommendations</li>
              </ul>
              <Link to="/quiz" className="btn-primary w-full justify-center">
                Start Quiz
              </Link>
            </motion.div>

            {/* Search Path */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-paper-50 rounded-2xl p-8 ink-border panel-shadow"
            >
              <div className="w-12 h-12 bg-cobalt-600 rounded-full flex items-center justify-center mb-4">
                <Search className="text-paper-50" size={24} />
              </div>
              <h3 className="font-display text-2xl text-ink-900 mb-4">Pick Favorites</h3>
              <p className="text-ink-700 mb-6">
                Already know what you like? Search and select 1-3 anime you enjoyed to get similar recommendations.
              </p>
              <ul className="space-y-2 text-sm text-ink-700 mb-6">
                <li>• Real-time search across 10K+ anime</li>
                <li>• Select your favorite titles as seeds</li>
                <li>• Get AI-powered similar recommendations</li>
              </ul>
              <Link to="/search" className="btn-secondary w-full justify-center">
                Search Anime
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
