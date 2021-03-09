import fs from 'fs'
import fsPromises from 'fs/promises'

// returns a promise that resolves with the URL of the first found file, if any
export function findAudioFile(id) {
  let r = [`${id}.mp3`, `${id}.m4a`].map(f => {
    let u = new URL('../audio/' + f, import.meta.url)
    return fsPromises.access(u, fs.constants.R_OK).then(_ => u)
  })

  return Promise.any(r)
}
