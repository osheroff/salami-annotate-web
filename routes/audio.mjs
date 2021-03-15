import express from 'express'
var router = express.Router()

import { findAudioFile } from '../lib/audio.mjs'
import { fileURLToPath } from 'url'
import system from 'system-commands'
import fsPromises from 'fs/promises'

/* GET home page. */
router.get('/:id', function(req, res, next) {
  findAudioFile(req.params.id)
    .then(url => res.sendFile(fileURLToPath(url)))
    .catch(err => res.status(404).end())
});

router.post('/truncate/:id', async function(req, res) {
  let url = await findAudioFile(req.params.id)
  let path = fileURLToPath(url)
  let time = parseFloat(req.body.truncateAt)
  system(`ffmpeg -i ${path} -c:a copy -c:v copy -to ${time} /tmp/truncated.m4a`)
    .catch(e => res.json({status: 'err', result: e}))
    .then(async r =>  {
      await fsPromises.rename("/tmp/truncated.m4a", path)
      res.json({status: 'ok', result: r})
    })
})

export default router
