var express = require('express')
var router = express.Router()
let path = require('path')
let fsPromises = require('fs/promises')
let fs = require ('fs')

let annotationsPath = path.join(__dirname, '..', 'annotations')

/* GET home page. */
router.get('/:id', function(req, res, next) {
  let id = req.params.id

  let f = path.join(annotationsPath, id, 'textfile1.txt')
  fsPromises.readFile(f, { encoding: 'utf8' })
    .then(file => {
      let lines = file.split("\n")
      let output = lines.map(l => {
        const split = l.split(/\s+/)
        return {
          time: parseFloat(split[0]),
          label: split.slice(1, 10000).join(' ')
        }
      })
      res.json(output)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err).end()
    })
});

module.exports = router;
