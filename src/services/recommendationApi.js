// API integration for AI-powered recommendations via a serverless proxy
const RECOMMENDATIONS_API_URL = '/api/recommendations';

// Model configuration
const OPENROUTER_MODEL = process.env.REACT_APP_OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free';

// Enhanced caching for recommendations
const recommendationCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 500;

// Request queue for OpenRouter API to prevent rate limiting
const requestQueue = [];
let isProcessingRecommendations = false;
const OPENROUTER_DELAY = 50; // 50ms between requests - faster processing

// Optimized system prompt for faster processing
const SYSTEM_PROMPT = `Recommend 10-12 anime titles based on user preferences. Return ONLY a comma-separated list of English titles.

Format: Title1, Title2, Title3, etc.`;

// Generate recommendations based on quiz answers
export const getQuizRecommendations = async (quizAnswers) => {
  const cacheKey = `quiz_${JSON.stringify(quizAnswers)}`;
  
  // Check cache first with LRU eviction
  if (recommendationCache.has(cacheKey)) {
    const cached = recommendationCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      // Move to end (LRU)
      recommendationCache.delete(cacheKey);
      recommendationCache.set(cacheKey, cached);
      return cached.data;
    }
    recommendationCache.delete(cacheKey);
  }
  
  // Implement cache size limit (LRU eviction)
  if (recommendationCache.size >= MAX_CACHE_SIZE) {
    const firstKey = recommendationCache.keys().next().value;
    recommendationCache.delete(firstKey);
  }

  try {
    const userMessage = formatQuizAnswersForPrompt(quizAnswers);
    const titles = await callOpenRouter(userMessage);
    
    const result = {
      titles,
      source: 'quiz',
      timestamp: Date.now()
    };
    
    // Cache the result
    recommendationCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
  } catch (error) {
    console.error('Error getting quiz recommendations:', error);
    // Return fallback recommendations
    return {
      titles: getFallbackRecommendations('beginner'),
      source: 'fallback',
      error: error.message
    };
  }
};

// Generate recommendations based on seed anime
export const getSeedRecommendations = async (seedAnime) => {
  const seedTitles = seedAnime.map(anime => 
    anime.title?.english || anime.title?.romaji
  ).filter(Boolean);
  
  const cacheKey = `seeds_${seedTitles.sort().join(',')}`;
  
  // Check cache first with LRU eviction
  if (recommendationCache.has(cacheKey)) {
    const cached = recommendationCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      // Move to end (LRU)
      recommendationCache.delete(cacheKey);
      recommendationCache.set(cacheKey, cached);
      return cached.data;
    }
    recommendationCache.delete(cacheKey);
  }
  
  // Implement cache size limit (LRU eviction)
  if (recommendationCache.size >= MAX_CACHE_SIZE) {
    const firstKey = recommendationCache.keys().next().value;
    recommendationCache.delete(firstKey);
  }

  try {
    const userMessage = formatSeedAnimeForPrompt(seedTitles);
    const titles = await callOpenRouter(userMessage);
    
    const result = {
      titles,
      source: 'seeds',
      seedTitles,
      timestamp: Date.now()
    };
    
    // Cache the result
    recommendationCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
  } catch (error) {
    console.error('Error getting seed recommendations:', error);
    // Return fallback recommendations
    return {
      titles: getFallbackRecommendations('popular'),
      source: 'fallback',
      seedTitles,
      error: error.message
    };
  }
};

// Queued OpenRouter API calls with rate limiting
const callOpenRouter = async (userMessage, retries = 3) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ userMessage, retries, resolve, reject });
    processRecommendationQueue();
  });
};

const processRecommendationQueue = async () => {
  if (isProcessingRecommendations || requestQueue.length === 0) return;
  
  isProcessingRecommendations = true;
  
  while (requestQueue.length > 0) {
    const { userMessage, retries, resolve, reject } = requestQueue.shift();
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Add timeout for faster failure
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await fetch(RECOMMENDATIONS_API_URL, {
          signal: controller.signal,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userMessage }
            ],
            temperature: 0.3,
            max_tokens: 150 // Optimized for title lists only
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        clearTimeout(timeoutId);
        const data = await response.json();
        
        // Handle different response formats
        let content = '';
        if (data.choices && data.choices[0]?.message?.content && data.choices[0].message.content.trim()) {
          content = data.choices[0].message.content.trim();
        } else if (data.choices && data.choices[0]?.message?.reasoning) {
          content = data.choices[0].message.reasoning.trim();
        } else if (data.choices && data.choices[0]?.message?.reasoning_details && data.choices[0].message.reasoning_details[0]?.text) {
          content = data.choices[0].message.reasoning_details[0].text.trim();
        } else if (data.choices && data.choices[0]?.text) {
          content = data.choices[0].text.trim();
        } else if (data.content) {
          content = data.content.trim();
        } else if (data.text) {
          content = data.text.trim();
        } else if (data.response) {
          content = data.response.trim();
        } else {
          console.error('Unknown OpenRouter response format:', data);
          throw new Error(`Invalid response format from OpenRouter. Response keys: ${Object.keys(data).join(', ')}`);
        }

        if (!content) {
          throw new Error('Empty content in OpenRouter response');
        }
        
        const result = parseRecommendationResponse(content);
        resolve(result);
        break;
        
      } catch (error) {
        console.error(`OpenRouter attempt ${attempt} failed:`, error);
        
        if (attempt === retries) {
          reject(error);
          break;
        }
        
        // Faster retry with reduced backoff
        const delay = Math.min(500 * Math.pow(1.5, attempt - 1), 1500) + Math.random() * 200;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // Rate limiting between requests
    if (requestQueue.length > 0) {
      await new Promise(resolve => setTimeout(resolve, OPENROUTER_DELAY));
    }
  }
  
  isProcessingRecommendations = false;
};

// Optimized quiz prompt for faster processing
const formatQuizAnswersForPrompt = (answers) => {
  const {
    vibe = 'Mixed',
    pace = 'Medium',
    era = 'Any',
    violence = 'Medium',
    focus = 'Balanced'
  } = answers;

  return `Genre: ${vibe}, Pace: ${pace}, Era: ${era}, Violence: ${violence}, Focus: ${focus}`;
};

// Optimized seed prompt for faster processing
const formatSeedAnimeForPrompt = (seedTitles) => {
  return `Similar to: ${seedTitles.join(', ')}`;
};

// Optimized parsing for faster response
const parseRecommendationResponse = (content) => {
  console.log('Parsing AI response:', content.substring(0, 200));
  
  // Simple comma-separated parsing for faster processing
  let titles = content
    .split(/[,\n]/) // Split by comma or newline
    .map(title => title.trim())
    .filter(title => title.length > 2 && title.length < 50)
    .filter(title => !title.toLowerCase().includes('here') && 
                     !title.toLowerCase().includes('based') &&
                     !title.toLowerCase().includes('recommend'))
    .slice(0, 12); // Limit to 12 titles
  
  // If parsing fails, use fallback titles
  if (titles.length < 5) {
    titles = [
      'Attack on Titan', 'Demon Slayer', 'My Hero Academia', 'Jujutsu Kaisen',
      'One Punch Man', 'Death Note', 'Fullmetal Alchemist Brotherhood',
      'Hunter x Hunter', 'Mob Psycho 100', 'Dr. Stone', 'Tokyo Ghoul', 'Haikyuu'
    ];
  }
  
  console.log('Parsed titles:', titles);
  return titles;
};

// Fallback recommendations for when AI fails
const getFallbackRecommendations = (type) => {
  const fallbacks = {
    beginner: [
      'Attack on Titan', 'Demon Slayer', 'My Hero Academia', 'Death Note',
      'One Punch Man', 'Mob Psycho 100', 'Jujutsu Kaisen', 'Spirited Away',
      'Your Name', 'Weathering with You', 'A Silent Voice', 'Princess Mononoke',
      'Fullmetal Alchemist Brotherhood', 'Hunter x Hunter', 'Naruto',
      'Dragon Ball Z', 'One Piece', 'Cowboy Bebop', 'Akira', 'Ghost in the Shell'
    ],
    popular: [
      'Attack on Titan', 'Demon Slayer', 'Jujutsu Kaisen', 'My Hero Academia',
      'One Piece', 'Naruto', 'Dragon Ball Super', 'Hunter x Hunter',
      'Fullmetal Alchemist Brotherhood', 'Death Note', 'One Punch Man',
      'Mob Psycho 100', 'Tokyo Ghoul', 'Bleach', 'Fairy Tail',
      'Black Clover', 'Dr. Stone', 'Promised Neverland', 'Haikyuu', 'Chainsaw Man'
    ]
  };
  
  return fallbacks[type] || fallbacks.popular;
};

// Clear recommendation cache
export const clearRecommendationCache = () => {
  recommendationCache.clear();
};
