export const handler = async (event) => {
  // Path: /img/static1/data/xxx.jpg → https://static1.e621.net/data/xxx.jpg
  const path = event.path.replace('/img/', '');
  const targetUrl = `https://${path}`;
  
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'Material e621/1.0 (by elo-bo-lang)' },
    });
    const buffer = await response.arrayBuffer();
    
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
      body: Buffer.from(buffer).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
