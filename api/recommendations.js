// Vercel Serverless Function - Secure proxy for OpenRouter AI API
export default async function handler(req, res) {
  // CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const openRouterApiKey = process.env.OPENROUTER_API_KEY;

  if (!openRouterApiKey) {
    res.status(500).json({ error: 'API key not configured' });
    return;
  }

  try {
    // Parse request body
    let requestBody = req.body;
    if (typeof requestBody === 'string') {
      requestBody = JSON.parse(requestBody);
    }

    // Proxy request to OpenRouter API
    const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://anime-rec-app.vercel.app',
        'X-Title': 'AnimeRec App'
      },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      res.status(apiResponse.status).json({ error: `OpenRouter API error: ${errorText}` });
      return;
    }

    const data = await apiResponse.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
