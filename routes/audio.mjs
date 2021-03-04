var express = require('express')
var router = express.Router()
let path = require('path')
let fsPromises = require('fs/promises')
let fs = require ('fs')

let audioPath = path.join(__dirname, '..', 'audio')

/* GET home page. */
router.get('/:id', function(req, res, next) {
  let id = req.params.id

  console.log(id)
  let r = [`${id}.mp3`, `${id}.m4a`].map(f => {
    let p = path.join(audioPath, f)
    return fsPromises.access(p, fs.constants.R_OK).then(_ => p)
  })

  Promise.any(r)
    .then(path => res.sendFile(path))
    .catch(err => res.status(404).end())
});

module.exports = router;
