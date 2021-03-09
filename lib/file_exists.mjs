import fs from 'fs'
import fsPromises from 'fs/promises'

export function filesExist(base) {
  let fullPaths = []
  for ( let i = 1 ; i < arguments.length ; i++ ) {
    fullPaths[i - 1] = arguments[i]
  }

  let promises = fullPaths.map(p => {
    let u = new URL(p, base)
    return fsPromises.access(u, fs.constants.R_OK).then(_ => u)
  })

  return Promise.allSettled(promises).then(results => {
    return results.filter(r => r.status == 'fulfilled').map(r => r.value)
  })
}

export default function(path, base) {
  let u = new URL(path, base)
  return fsPromises.access(u, fs.constants.R_OK).then(_ => u)
}
