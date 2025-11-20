// utils/hashFile.js
const crypto = require('crypto');
const fs = require('fs');

function computeFileHash(path, algo = 'sha256') {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algo);
    const rs = fs.createReadStream(path);
    rs.on('data', chunk => hash.update(chunk));
    rs.on('end', () => resolve(hash.digest('hex')));
    rs.on('error', reject);
  });
}

module.exports = computeFileHash;
