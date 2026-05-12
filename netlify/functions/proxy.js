export const handler = async (event) => {
  const path = event.path.replace('/.netlify/functions/proxy/', '/api/');
  const targetUrl = `https://e621.net/${path}${event.queryStringParameters ? '?' + new URLSearchParams(event.queryStringParameters) : ''}`;
  
  try {
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: {
        'User-Agent': 'Material e621/1.0 (by elo-bo-lang)',
        'Accept': 'application/json',
      },
    });
    const data = await response.text();
    
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: data,
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
