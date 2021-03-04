const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');

const mdPath = path.join(__dirname, 'metadata.csv')

export default {
  readRows: function(onRow, onEnd) {
    fs.createReadStream('mdPath')
      .pipe(csv())
      .on('data', (row) => {
        cb(row)
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });
  }
}
