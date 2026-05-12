javascript
     export default async function handler(req, res) {
       const targetUrl = req.url.replace('/api/', 'https://e621.net/');
       try {
         const response = await fetch(targetUrl, {
           method: req.method,
           headers: {
             'User-Agent': 'Material e621/1.0 (by elo-bo-lang)',
             'Accept': 'application/json',
           },
         });
         const data = await response.text();
         res.setHeader('Access-Control-Allow-Origin', '');
         res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
         res.status(response.status).send(data);
       } catch (err) {
         res.status(502).json({ error: 'Proxy failed', message: err.message });
       }
     }
