const https = require('https');
function getIds(query) {
  return new Promise((resolve) => {
    https.get('https://unsplash.com/s/photos/' + query, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Extract photo IDs from Unsplash SSR HTML
        const regex = /"id":"([a-zA-Z0-9_-]{8,15})"/g;
        let match;
        const ids = new Set();
        while ((match = regex.exec(data)) !== null) {
          ids.add(match[1]);
        }
        resolve(Array.from(ids).slice(0, 15));
      });
    });
  });
}
async function run() {
  const categories = ['pottery', 'wall-art', 'wall-clock', 'mirror', 'table'];
  for (const cat of categories) {
    const ids = await getIds(cat);
    console.log(`const real_${cat} =`, JSON.stringify(ids));
  }
}
run();
