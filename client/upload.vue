<template>
  <form class="ui form upload-form">
    <h1>New Song</h1>
    <div class="field">
      <label>
        File:
        <input type="file" @change="setFile"/>
      </label>
    </div>
    <div class="field">
      <label>
        Artist: <input type="text" v-model="artist"/>
      </label>
    </div>
    <div class="field">
      <label>
        Title: <input type="text" v-model="title"/>
      </label>
    </div>
    <button class="ui button" @click.prevent="upload">Upload</button>
  </form>
</template>

<style scoped>
.upload-form {
  max-width: 600px;
  margin: auto;
}
</style>

<script>
export default {
  data() {
    return {
      file: null,
      artist: "",
      title: ''
    }
  },
  methods: {
    setFile(ev) {
      this.file = ev.target.files[0]
    },
    upload() {
      const formData = new FormData()

      formData.append('artist', this.artist)
      formData.append('title', this.title)
      formData.append('audio', this.file)

      fetch('/upload.json', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(result => {
          this.$router.push(`/song/${result.song_id}`)
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }
}
</script>
