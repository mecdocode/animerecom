// Vercel Serverless Function to proxy requests to OpenRouter.ai
// This function will run on the backend, keeping the API key secure.

export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const openRouterApiKey = process.env.REACT_APP_OPENROUTER_API_KEY;

  if (!openRouterApiKey) {
    response.status(500).json({ error: 'API key not configured on server' });
    return;
  }

  try {
    // Forward the request body from the client to OpenRouter
    const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.body),
    });

    // If the request to OpenRouter fails, pass on the error
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      response.status(apiResponse.status).json({ error: `OpenRouter API error: ${errorText}` });
      return;
    }

    // Stream the response from OpenRouter back to the client
    response.status(200).json(await apiResponse.json());

  } catch (error) {
    console.error('Error in serverless function:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
}
