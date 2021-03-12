import express from 'express'
import path from 'path'
import { filesExist } from '../lib/file_exists.mjs'
import fsPromises from 'fs/promises'
import fs from 'fs'
import { fileURLToPath } from 'url'

var router = express.Router()

router.get('/:id', function(req, res, next) {
  let id = req.params.id
  let basePath = new URL(`../annotations/${id}/parsed/`, import.meta.url)
  let fileParam = req.query.file

  filesExist(basePath, 'textfile3_uppercase.txt', 'textfile1_uppercase.txt', 'textfile2_uppercase.txt', 'predicted.txt').then(files => {
    if ( files.length == 0 ) {
      return res.json({
        available: [],
        file: null,
        annotations: []
      })
    }

    let chosen = files.find(f => path.basename(fileURLToPath(f)) == fileParam)

    if ( chosen == null ) {
      chosen = files[0]
    }

    let output = {
      available: files.map(f => path.basename(fileURLToPath(f))),
      file: path.basename(fileURLToPath(chosen))
    }

    fsPromises.readFile(chosen, { encoding: 'utf8' })
      .then(file => {
        let lines = file.split("\n").filter(l => l.length > 0)
        let j = lines.map(l => {
          const split = l.split(/\s+/)
          return {
            time: parseFloat(split[0]),
            label: split.slice(1, 10000).join(' ')
          }
        })
        output.annotations = j
        res.json(output)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json(err).end()
      })
  })
});

router.post('/:id', async function(req, res, next) {
  let id = req.params.id

  let path = new URL(`../annotations/${id}/parsed/`, import.meta.url)
  await fsPromises.mkdir(path, { recursive: true })

  let u = new URL('textfile3_uppercase.txt', path)

  let stream = fs.createWriteStream(u, { encoding: 'utf8' })

  let data = req.body.annotations.map(a => {
    return a.time + "\t" + a.label
  }).join("\n")
  stream.end(data)

  res.json({status: "saved"})
})
export default router
