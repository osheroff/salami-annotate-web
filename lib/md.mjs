import path from 'path'
import csv from 'csv-parse'
import csvStringify from 'csv-stringify/lib/sync.js'
import fs from 'fs'
import MultiStream from 'multistream'

const mdPath = new URL('../metadata.csv', import.meta.url)
const localMDPath = new URL('../metadata_added.csv', import.meta.url)

export default {
  readRows: function(onRow, onEnd, stream) {
    let headers = null
    if ( !stream ) {
      stream = new MultiStream([
        fs.createReadStream(localMDPath),
        fs.createReadStream(mdPath)
      ])
    }

    stream
      .pipe(csv())
      .on('data', (row) => {
        if ( headers == null ) {
          headers = row.map(h => h.toLowerCase())
        } else {
          let r = {}
          for(let i = 0; i < row.length; i++) {
            r[headers[i]] = row[i]
          }

          if ( r.song_id == 'SONG_ID' ) // second csv header
            return
          onRow(r)
        }
      })
      .on('end', () => {
        onEnd()
      });
  },

  addMetadata(data) {
    // SONG_ID,SOURCE,ANNOTATOR1,ANNOTATOR2,FILE_LOCATION,SONG_DURATION,EMPTY,SONG_TITLE,ARTIST,FORMAT,ANNOTATION_TIME1,ANNOTATION_TIME2,TEXTFILE1,TEXTFILE2,CLASS,GENRE,SUBMISSION_DATE1,SUBMISSION_DATE2,SONG_WAS_PRIVATE_FLAG,SONG_WAS_DISCARDED_FLAG,XEQS1,XEQS2
    return new Promise((resolve, reject) => {
      let row = []
      row[0] = data.song_id
      row[7] = data.title
      row[8] = data.artist
      row[21] = ''

      let output = csvStringify([row])


      let stream = fs.createWriteStream(localMDPath, { flags: "a" })
      stream.write(output)
      stream.end()
      resolve()
    })
  },
  nextID() {
    return new Promise((resolve, reject) => {
      let maxID = 10000

      let onRow = (row) => {
        let id = parseInt(row.song_id)
        if ( id > maxID )
          maxID = id
      }

      let stream = fs.createReadStream(localMDPath)
      this.readRows(
        onRow,
        () => {
          resolve(maxID + 1)
        },
        stream
      )
    })
  }
}
