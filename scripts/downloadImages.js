const https = require('https');
const fs = require('fs');
const path = require('path');

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const filePath = path.join('public', 'images', 'productImage', filename);
      const fileStream = fs.createWriteStream(filePath);

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filePath, () => reject(err));
      });
    }).on('error', reject);
  });
};

const images = [
  {
    url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    filename: 'terracottaPlanterSet1.jpg'
  }
];

Promise.all(images.map(img => downloadImage(img.url, img.filename)))
  .then(() => console.log('Images downloaded successfully'))
  .catch(err => console.error('Error downloading images:', err));
