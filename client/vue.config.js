module.exports = {
  devServer: {
    proxy: {
      '^/audio/.*': {
        target: 'http://localhost:3000'
      },
      '^/songs.json': {
        target: 'http://localhost:3000'
      },
      '^/annotations/.*': {
        target: 'http://localhost:3000'
      },
      '^/upload.json': {
        target: 'http://localhost:3000'
      }
    }
  }
}

