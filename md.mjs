import path from 'path'
import csv from 'csv-parse'
import fs from 'fs'

const mdPath = new URL('metadata.csv', import.meta.url)

export default {
  readRows: function(onRow, onEnd) {
    fs.createReadStream(mdPath)
      .pipe(csv())
      .on('data', (row) => {
        cb(row)
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });
  }
}
