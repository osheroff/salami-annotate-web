import express from 'express'
import path from 'path'
import fsPromises from 'fs/promises'
import fs from 'fs'

var router = express.Router()
let annotationsURL = new URL('annotations', import.meta.url)

/* GET home page. */
router.get('/:id', function(req, res, next) {
  let id = req.params.id

  let u = new URL(`${id}/textfile1.txt`, annotationsURL)
  fsPromises.readFile(u, { encoding: 'utf8' })
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

export default router
