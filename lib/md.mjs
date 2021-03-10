import path from 'path'
import csv from 'csv-parse'
import fs from 'fs'

const mdPath = new URL('../metadata.csv', import.meta.url)

export default {
  readRows: function(onRow, onEnd) {
    let headers = null
    fs.createReadStream(mdPath)
      .pipe(csv())
      .on('data', (row) => {
        if ( headers == null ) {
          headers = row.map(h => h.toLowerCase())
        } else {
          let r = {}
          for(let i = 0; i < row.length; i++) {
            r[headers[i]] = row[i]
          }
          onRow(r)
        }
      })
      .on('end', () => {
        onEnd()
      });
  }
}
