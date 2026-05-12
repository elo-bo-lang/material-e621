export const handler = async (event) => {
  const imgPath = event.path.replace('/img/', 'data/');
  const targetUrl = `https://static1.e621.net/${imgPath}`;
  
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
