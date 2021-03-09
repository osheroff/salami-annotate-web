import express from 'express'
var router = express.Router()

import { findAudioFile } from '../lib/audio.mjs'
import { fileURLToPath } from 'url'

/* GET home page. */
router.get('/:id', function(req, res, next) {
  findAudioFile(req.params.id)
    .then(url => res.sendFile(fileURLToPath(url)))
    .catch(err => res.status(404).end())
});

export default router
