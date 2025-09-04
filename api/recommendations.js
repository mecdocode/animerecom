// Vercel Serverless Function to proxy requests to OpenRouter.ai
// This function will run on the backend, keeping the API key secure.

export default async function handler(req, res) {
  // Enable CORS
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

  const openRouterApiKey = process.env.REACT_APP_OPENROUTER_API_KEY;

  if (!openRouterApiKey) {
    res.status(500).json({ error: 'API key not configured on server' });
    return;
  }

  try {
    // Parse request body if it's a string
    let requestBody = req.body;
    if (typeof requestBody === 'string') {
      requestBody = JSON.parse(requestBody);
    }

    console.log('Proxying request to OpenRouter:', { model: requestBody.model });

    // Forward the request body from the client to OpenRouter
    const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://animerecom-jc14.vercel.app',
        'X-Title': 'AnimeRec App'
      },
      body: JSON.stringify(requestBody),
    });

    // If the request to OpenRouter fails, pass on the error
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('OpenRouter API error:', errorText);
      res.status(apiResponse.status).json({ error: `OpenRouter API error: ${errorText}` });
      return;
    }

    // Stream the response from OpenRouter back to the client
    const data = await apiResponse.json();
    console.log('OpenRouter response received successfully');
    res.status(200).json(data);

  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
