// Vercel Serverless Function - AI Anime Recommendations
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://animerecom.vercel.app',
        'X-Title': 'AnimeRec'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are an anime recommendation expert. Provide exactly 10 anime titles as a simple comma-separated list. No explanations, just titles.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse titles from response
    const titles = content
      .split(',')
      .map(title => title.trim())
      .filter(title => title.length > 0 && title.length < 50)
      .slice(0, 10);

    // Fallback if parsing fails
    if (titles.length < 5) {
      return res.status(200).json({
        titles: [
          'Attack on Titan',
          'Demon Slayer',
          'My Hero Academia',
          'Jujutsu Kaisen',
          'One Piece',
          'Naruto',
          'Death Note',
          'Fullmetal Alchemist Brotherhood',
          'Hunter x Hunter',
          'One Punch Man'
        ],
        source: 'fallback'
      });
    }

    return res.status(200).json({
      titles,
      source: 'ai'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      titles: [
        'Attack on Titan',
        'Demon Slayer', 
        'My Hero Academia',
        'Jujutsu Kaisen',
        'One Piece'
      ],
      source: 'fallback'
    });
  }
}
