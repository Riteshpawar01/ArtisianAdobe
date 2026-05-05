const https = require('https');

function getRedirectUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.headers.location);
    });
  });
}

async function run() {
  const categories = ['pottery', 'wall+art', 'wall+clock', 'mirror', 'furniture'];
  
  for (const cat of categories) {
    const ids = new Set();
    // fetch 5 random redirects per category
    for(let i=0; i<5; i++) {
        const url = await getRedirectUrl('https://images.unsplash.com/random/600x600/?' + cat);
        if (url) {
            // URL looks like https://images.unsplash.com/photo-1234567890-abcdef?crop=entropy...
            const match = url.match(/photo-([a-zA-Z0-9_-]+)\?/);
            if(match) ids.add(match[1]);
        }
    }
    console.log(`const real_${cat.replace('+', '_')} =`, JSON.stringify(Array.from(ids)));
  }
}
run();
