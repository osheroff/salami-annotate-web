import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import indexRouter from './routes/index.mjs'
import audioRouter from './routes/audio.mjs'
import annotationsRouter from './routes/annotations.mjs'

import md from './lib/md.mjs'
import fileExists from './lib/file_exists.mjs'

var app = express();
const root = new URL(import.meta.url)

// view engine setup
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('client/dist'));

app.use('/audio', audioRouter);
app.use('/annotations', annotationsRouter);


import { findAudioFile } from './lib/audio.mjs'


app.get('/songs.json', async (req, res) =>  {
  let json = {data: [], links: { pagination: {}}}

  md.readRows(
    r => json.data.push(r),
    () => {
      let promises = []

      let page = parseInt(req.query.page)
      let perPage = parseInt(req.query.per_page)
      let offset = (page - 1) * perPage

      json.links.pagination = {
        total: json.data.length,
        per_page: perPage,
        current_page: page,
        last_page: Math.floor(json.data.length / perPage) + 1,
        from: offset,
        to: offset + perPage

      }

      json.data = json.data.slice(offset, offset + perPage)
      json.data.forEach(r => {
        promises.push(
          findAudioFile(r.song_id)
          .then(u => r.has_file = true)
          .catch(e => r.has_file = false)
        )

        promises.push(
          fileExists(`./annotations/${r.song_id}/parsed/textfile3_uppercase.txt`, import.meta.url)
          .then(() => r.annotations_verified = true)
          .catch(() => {})
        )
      })

      Promise.allSettled(promises).then(() => res.json(json))
    }
  )
})


app.get('/', (req, res) =>  {
  res.sendFile(new URL('client/dist/index.html', import.meta.url))
});


app.get('/song/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app
