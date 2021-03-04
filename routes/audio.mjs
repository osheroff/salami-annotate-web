import express from 'express'
var router = express.Router()

import fsPromises from 'fs/promises'
import fs from 'fs'

let audioURL = new URL('audio', import.meta.url)

/* GET home page. */
router.get('/:id', function(req, res, next) {
  let id = req.params.id

  let r = [`${id}.mp3`, `${id}.m4a`].map(f => {
    let u = new URL(f, audioURL)
    return fsPromises.access(u, fs.constants.R_OK).then(_ => u)
  })

  Promise.any(r)
    .then(url => res.sendFile(url))
    .catch(err => res.status(404).end())
});

export default router
