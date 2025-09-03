const ANILIST_API_URL = 'https://graphql.anilist.co';

// Enhanced caching and rate limiting
const requestCache = new Map();
const requestQueue = [];
let isProcessing = false;
const RATE_LIMIT_DELAY = 25; // Further reduced to 25ms for faster processing
const MAX_CACHE_SIZE = 1000;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// GraphQL queries
const TRENDING_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
        id
        title {
          english
          romaji
        }
        description
        coverImage {
          large
          medium
        }
        meanScore
        genres
        format
        episodes
        startDate {
          year
        }
        status
        popularity
      }
    }
  }
`;

const SEARCH_QUERY = `
  query ($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, search: $search, isAdult: false, sort: POPULARITY_DESC) {
        id
        title {
          english
          romaji
        }
        description
        coverImage {
          large
          medium
        }
        meanScore
        genres
        format
        episodes
        startDate {
          year
        }
        status
        popularity
      }
    }
  }
`;

const ANIME_DETAILS_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        english
        romaji
        native
      }
      description
      coverImage {
        large
        medium
      }
      bannerImage
      meanScore
      genres
      format
      episodes
      duration
      status
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      season
      studios {
        nodes {
          name
        }
      }
      characters(page: 1, perPage: 6, sort: ROLE) {
        nodes {
          name {
            full
          }
          image {
            medium
          }
        }
      }
      relations {
        nodes {
          id
          title {
            english
            romaji
          }
          coverImage {
            medium
          }
          format
        }
      }
      externalLinks {
        url
        site
      }
      trailer {
        id
        site
      }
      popularity
      favourites
    }
  }
`;

// Rate-limited request function
const makeRequest = async (query, variables = {}) => {
  const cacheKey = JSON.stringify({ query, variables });
  
  // Check cache first with LRU eviction
  if (requestCache.has(cacheKey)) {
    const cached = requestCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      // Move to end (LRU)
      requestCache.delete(cacheKey);
      requestCache.set(cacheKey, cached);
      return cached.data;
    }
    requestCache.delete(cacheKey);
  }
  
  // Implement cache size limit (LRU eviction)
  if (requestCache.size >= MAX_CACHE_SIZE) {
    const firstKey = requestCache.keys().next().value;
    requestCache.delete(firstKey);
  }

  return new Promise((resolve, reject) => {
    requestQueue.push({ query, variables, resolve, reject, cacheKey });
    processQueue();
  });
};

const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return;
  
  isProcessing = true;
  
  while (requestQueue.length > 0) {
    const { query, variables, resolve, reject, cacheKey } = requestQueue.shift();
    
    try {
      const response = await fetch(ANILIST_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query, variables })
      });

      if (!response.ok) {
        // Handle 500 errors with retry logic
        if (response.status === 500) {
          console.warn(`AniList API 500 error, retrying in 2 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Retry the request once
          const retryResponse = await fetch(ANILIST_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ query, variables })
          });
          
          if (!retryResponse.ok) {
            throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
          }
          
          const retryData = await retryResponse.json();
          if (retryData.errors) {
            throw new Error(`GraphQL Error: ${retryData.errors.map(e => e.message).join(', ')}`);
          }
          
          resolve(retryData.data);
          continue;
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(`GraphQL Error: ${data.errors.map(e => e.message).join(', ')}`);
      }
      
      // Cache successful responses
      const cacheData = { data: data.data, timestamp: Date.now() };
      requestCache.set(cacheKey, cacheData);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
    
    // Rate limiting: wait between requests
    if (requestQueue.length > 0) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
    }
  }
  
  isProcessing = false;
};

// API functions
export const fetchTrendingAnime = async (page = 1, perPage = 20) => {
  try {
    const data = await makeRequest(TRENDING_QUERY, { page, perPage });
    return data.Page.media;
  } catch (error) {
    console.error('Error fetching trending anime:', error);
    throw new Error('Failed to fetch trending anime');
  }
};

export const searchAnime = async (searchTerm, page = 1, perPage = 10) => {
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }

  try {
    const data = await makeRequest(SEARCH_QUERY, { 
      search: searchTerm, 
      page, 
      perPage 
    });
    return data.Page.media;
  } catch (error) {
    console.error('Error searching anime:', error);
    throw new Error('Failed to search anime');
  }
};

export const fetchAnimeDetails = async (id) => {
  try {
    const data = await makeRequest(ANIME_DETAILS_QUERY, { id: parseInt(id) });
    return data.Media;
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw new Error('Failed to fetch anime details');
  }
};

// Optimized batch search with concurrent processing
export const fetchAnimeByTitles = async (titles) => {
  if (!titles || titles.length === 0) {
    return [];
  }

  console.log('Fetching anime for titles:', titles);
  
  // Process in batches of 5 for optimal performance
  const BATCH_SIZE = 5;
  const batches = [];
  for (let i = 0; i < titles.length; i += BATCH_SIZE) {
    batches.push(titles.slice(i, i + BATCH_SIZE));
  }
  
  const allResults = [];
  
  for (const batch of batches) {
    const batchResults = await Promise.allSettled(
      batch.map(async (title) => {
        try {
          const searchResults = await searchAnime(title, 1, 3); // Reduced perPage for faster response
          if (searchResults && searchResults.length > 0) {
            // Find best match by title similarity
            const bestMatch = searchResults.find(anime => 
              (anime.title?.english && anime.title.english.toLowerCase().includes(title.toLowerCase())) ||
              (anime.title?.romaji && anime.title.romaji.toLowerCase().includes(title.toLowerCase()))
            ) || searchResults[0];
            
            return {
              anime: bestMatch,
              confidence: bestMatch === searchResults[0] ? 'high' : 'medium',
              searchTitle: title
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching anime for title "${title}":`, error);
          return null;
        }
      })
    );
    
    const processedBatch = batchResults
      .map(result => result.status === 'fulfilled' && result.value ? result.value : null)
      .filter(Boolean);
    
    allResults.push(...processedBatch);
  }

  console.log(`Successfully fetched ${allResults.length} out of ${titles.length} anime`);
  return allResults;
};

// Clear cache (useful for testing or manual refresh)
export const clearCache = () => {
  requestCache.clear();
};
