// Simple recommendation service - rebuilt from scratch
const API_URL = '/api/recommendations';

// Cache for recommendations
const cache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Generate recommendations based on seed anime
export const getSeedRecommendations = async (seedAnime) => {
  const seedTitles = seedAnime.map(anime => 
    anime.title?.english || anime.title?.romaji || anime.title
  ).filter(Boolean);
  
  const prompt = `Recommend anime similar to: ${seedTitles.join(', ')}`;
  return await getRecommendations(prompt, 'seed');
};

// Generate recommendations based on quiz answers
export const getQuizRecommendations = async (quizAnswers) => {
  const { vibe, pace, era, violence, focus } = quizAnswers;
  const prompt = `Recommend anime with: Genre=${vibe}, Pace=${pace}, Era=${era}, Violence=${violence}, Focus=${focus}`;
  return await getRecommendations(prompt, 'quiz');
};

// Core recommendation function
const getRecommendations = async (prompt, source) => {
  const cacheKey = `${source}_${prompt}`;
  
  // Check cache
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    cache.delete(cacheKey);
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    const result = {
      titles: data.titles || [],
      source: data.source || source,
      timestamp: Date.now()
    };

    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;

  } catch (error) {
    console.error('Recommendation API error:', error);
    
    // Return fallback recommendations
    return {
      titles: getFallbackTitles(source),
      source: 'fallback',
      error: error.message,
      timestamp: Date.now()
    };
  }
};

// Fallback recommendations
const getFallbackTitles = (source) => {
  const fallbacks = {
    quiz: [
      'Attack on Titan', 'Demon Slayer', 'My Hero Academia', 'Death Note',
      'One Punch Man', 'Mob Psycho 100', 'Jujutsu Kaisen', 'Hunter x Hunter'
    ],
    seed: [
      'Fullmetal Alchemist Brotherhood', 'Cowboy Bebop', 'One Piece', 'Naruto',
      'Dragon Ball Z', 'Spirited Away', 'Your Name', 'Princess Mononoke'
    ]
  };
  
  return fallbacks[source] || fallbacks.quiz;
};

// Clear cache
export const clearRecommendationCache = () => {
  cache.clear();
};
