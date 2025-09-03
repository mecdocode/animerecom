import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Star, Calendar, Play, Users, ExternalLink, Heart, Share2 } from 'lucide-react';
import { fetchAnimeDetails } from '../services/anilistApi';
import { useToast } from '../contexts/ToastContext';

const AnimeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: anime, isLoading, error } = useQuery({
    queryKey: ['anime-details', id],
    queryFn: () => fetchAnimeDetails(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
    onError: (error) => {
      toast.error('Failed to load anime details.');
    }
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: anime.title?.english || anime.title?.romaji,
          text: `Check out this anime: ${anime.title?.english || anime.title?.romaji}`,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    const { year, month, day } = date;
    if (year && month && day) {
      return new Date(year, month - 1, day).toLocaleDateString();
    }
    if (year && month) {
      return `${new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    }
    return year || 'Unknown';
  };

  const formatScore = (score) => {
    return score ? (score / 10).toFixed(1) : 'N/A';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="skeleton h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="skeleton aspect-[2/3] rounded-xl" />
            <div className="lg:col-span-2 space-y-4">
              <div className="skeleton h-12 w-3/4" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-5/6" />
              <div className="skeleton h-4 w-4/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-paper-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={handleBack} className="btn-secondary mb-6">
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <div className="text-center py-16">
            <div className="speech-bubble inline-block">
              <p className="text-error">Failed to load anime details.</p>
              <button onClick={() => window.location.reload()} className="btn-primary mt-4">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'characters', label: 'Characters' },
    { id: 'related', label: 'Related' },
    { id: 'watch', label: 'Where to Watch' }
  ];

  return (
    <div className="min-h-screen bg-paper-50">
      {/* Hero Section */}
      <div className="relative">
        {anime.bannerImage && (
          <div className="absolute inset-0 h-96">
            <img
              src={anime.bannerImage}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-paper-50 via-paper-50/60 to-transparent" />
          </div>
        )}
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={handleBack}
            className="btn-secondary mb-6 inline-flex items-center space-x-2"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cover Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <img
                src={anime.coverImage?.large || anime.coverImage?.medium}
                alt={anime.title?.english || anime.title?.romaji}
                className="w-full aspect-[2/3] object-cover rounded-xl ink-border panel-shadow"
              />
              
              {/* Score Badge */}
              {anime.meanScore && (
                <div className="absolute top-4 right-4 bg-ink-900/80 backdrop-blur-sm text-paper-50 px-3 py-2 rounded-lg flex items-center space-x-2">
                  <Star size={16} className="text-warn fill-current" />
                  <span className="font-semibold">{formatScore(anime.meanScore)}</span>
                </div>
              )}
            </motion.div>

            {/* Main Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl text-ink-900 mb-2">
                    {anime.title?.english || anime.title?.romaji}
                  </h1>
                  {anime.title?.english && anime.title?.romaji && anime.title.english !== anime.title.romaji && (
                    <p className="text-lg text-ink-700 mb-2">{anime.title.romaji}</p>
                  )}
                  {anime.title?.native && (
                    <p className="text-ink-700 mb-4">{anime.title.native}</p>
                  )}
                </div>
                
                <button
                  onClick={handleShare}
                  className="p-2 hover:bg-paper-100 rounded-lg transition-colors"
                >
                  <Share2 size={20} className="text-ink-700" />
                </button>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="text-sm text-ink-700">Format</div>
                  <div className="font-medium text-ink-900">{anime.format || 'Unknown'}</div>
                </div>
                <div>
                  <div className="text-sm text-ink-700">Episodes</div>
                  <div className="font-medium text-ink-900">{anime.episodes || 'Unknown'}</div>
                </div>
                <div>
                  <div className="text-sm text-ink-700">Status</div>
                  <div className="font-medium text-ink-900">{anime.status || 'Unknown'}</div>
                </div>
                <div>
                  <div className="text-sm text-ink-700">Year</div>
                  <div className="font-medium text-ink-900">{anime.startDate?.year || 'Unknown'}</div>
                </div>
              </div>

              {/* Genres */}
              {anime.genres && anime.genres.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-cobalt-600/10 text-cobalt-600 rounded-full text-sm font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {anime.description && (
                <div className="mb-6">
                  <p className="text-ink-700 leading-relaxed">
                    {anime.description.replace(/<[^>]*>/g, '')}
                  </p>
                </div>
              )}

              {/* Studios */}
              {anime.studios?.nodes && anime.studios.nodes.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm text-ink-700 mb-2">Studio</div>
                  <div className="flex flex-wrap gap-2">
                    {anime.studios.nodes.map((studio, index) => (
                      <span key={index} className="font-medium text-ink-900">
                        {studio.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-ink-900/10 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-crimson-600 text-crimson-600'
                    : 'border-transparent text-ink-700 hover:text-ink-900 hover:border-ink-900/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-xl text-ink-900 mb-4">Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-ink-700">Start Date</span>
                    <span className="text-ink-900">{formatDate(anime.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-700">End Date</span>
                    <span className="text-ink-900">{formatDate(anime.endDate)}</span>
                  </div>
                  {anime.duration && (
                    <div className="flex justify-between">
                      <span className="text-ink-700">Episode Duration</span>
                      <span className="text-ink-900">{anime.duration} min</span>
                    </div>
                  )}
                  {anime.season && (
                    <div className="flex justify-between">
                      <span className="text-ink-700">Season</span>
                      <span className="text-ink-900">{anime.season}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-display text-xl text-ink-900 mb-4">Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-ink-700">Popularity</span>
                    <span className="text-ink-900">#{anime.popularity || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-700">Favorites</span>
                    <span className="text-ink-900">{anime.favourites?.toLocaleString() || 'N/A'}</span>
                  </div>
                  {anime.meanScore && (
                    <div className="flex justify-between">
                      <span className="text-ink-700">Average Score</span>
                      <span className="text-ink-900">{formatScore(anime.meanScore)}/10</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'characters' && (
            <div>
              <h3 className="font-display text-xl text-ink-900 mb-4">Main Characters</h3>
              {anime.characters?.nodes && anime.characters.nodes.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {anime.characters.nodes.map((character, index) => (
                    <div key={index} className="text-center">
                      <img
                        src={character.image?.medium}
                        alt={character.name?.full}
                        className="w-full aspect-[3/4] object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm font-medium text-ink-900 truncate">
                        {character.name?.full}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-ink-700">No character information available.</p>
              )}
            </div>
          )}

          {activeTab === 'related' && (
            <div>
              <h3 className="font-display text-xl text-ink-900 mb-4">Related Anime</h3>
              {anime.relations?.nodes && anime.relations.nodes.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {anime.relations.nodes.slice(0, 10).map((related) => (
                    <div key={related.id} className="cursor-pointer hover:opacity-80 transition-opacity">
                      <img
                        src={related.coverImage?.medium}
                        alt={related.title?.english || related.title?.romaji}
                        className="w-full aspect-[2/3] object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm font-medium text-ink-900 truncate">
                        {related.title?.english || related.title?.romaji}
                      </p>
                      <p className="text-xs text-ink-700">{related.format}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-ink-700">No related anime found.</p>
              )}
            </div>
          )}

          {activeTab === 'watch' && (
            <div>
              <h3 className="font-display text-xl text-ink-900 mb-4">Where to Watch</h3>
              {anime.externalLinks && anime.externalLinks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {anime.externalLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-paper-100 rounded-lg hover:bg-paper-200 transition-colors"
                    >
                      <span className="font-medium text-ink-900">{link.site}</span>
                      <ExternalLink size={18} className="text-ink-700" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-ink-700">No streaming links available.</p>
              )}
              
              {anime.trailer && (
                <div className="mt-6">
                  <h4 className="font-medium text-ink-900 mb-3">Trailer</h4>
                  <div className="aspect-video bg-paper-100 rounded-lg flex items-center justify-center">
                    <a
                      href={`https://www.youtube.com/watch?v=${anime.trailer.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-cobalt-600 hover:text-cobalt-700"
                    >
                      <Play size={24} />
                      <span>Watch on YouTube</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AnimeDetails;
