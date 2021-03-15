import express from 'express'
var router = express.Router()

import { findAudioFile } from '../lib/audio.mjs'
import md from '../lib/md.mjs'
import fileExists from '../lib/file_exists.mjs'

router.get('/:id\.json', async (req, res) =>  {
  let rows = []

  let formatSong = (s) => {
    return {
      title: s.song_title,
      artist: s.artist,
      song_id: s.song_id,
      url: `/song/${s.song_id}`
    }
  }

  md.readRows(
    r => rows.push(r),
    () => {
      let index = rows.findIndex(s => s.song_id == req.params.id)
      if ( index > -1 ) {
        let next = rows[index + 1]
        let prev = rows[index - 1]

        let song = formatSong(rows[index])
        if ( next )
          song.next = formatSong(next)
        if ( prev )
          song.prev = formatSong(prev)

        res.json(song)
      } else
        res.status(404).end()
    }
  )
})

export default router
