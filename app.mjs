import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import indexRouter from './routes/index.mjs'
import audioRouter from './routes/audio.mjs'
import annotationsRouter from './routes/annotations.mjs'

import md from './md.mjs'

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

app.get('/songs.json', (req, res) =>  {
  let rows = []
  md.readRows(r => rows.push(r), () => res.json(rows))
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
