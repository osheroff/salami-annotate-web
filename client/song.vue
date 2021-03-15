<template>
  <div class="song-container">
    <GlobalEvents
      @keydown.prevent.m="addMarker"/>
    <div class="song-header">
      <router-link v-if="song.prev" :to="song.prev.url">&lt;&lt; {{ song.prev.title }}</router-link>
      <h3 v-if="song.title">{{ song.title }} by {{ song.artist }}</h3>
      <router-link v-if="song.next" :to="song.next.url">{{ song.next.title }} &gt;&gt;</router-link>
    </div>
    <waveform class="waveform-container" :id="$route.params.id" :annotations="annotations" ref="waveform" @time="setTime" :key="$route.params.id + keybust"/>
    <div class="annotations-container">
      <div class="files-list">
        <div v-for="f in available" :key="f">
          <span v-if="f == file">{{ f }}</span>
          <a v-else href="#" @click.prevent="chooseFile(f)">{{ f }}</a>
        </div>
      </div>
      <ul class="annotations">
        <li v-for="(a, idx) in annotations" :key="idx" :class="{ active: idx == activeAnnotation }">
          <div>
            <a href="#" @click.prevent="deleteAt(idx)"><i class="far fa-minus-square"/></a>
            <a href="#" @click.prevent="editAnnotation = idx"><i class="far fa-edit"/></a>
            <a href="#" @click.prevent="a.time = $refs.waveform.playheadTime()"><i class="fas fa-arrow-up"/></a>
          </div>
          <div style="flex-grow:1">
            <div v-if="editAnnotation == idx">
              <input type="text" :value="a.time" @input="a.time = parseFloat($event.target.value)"/>
              <button @click="editAnnotation = null">Done</button>
            </div>
            <a v-else href='#' @click.prevent='seek(a.time)'>{{ a.time.toFixed(2) }}</a>
          </div>
          <div class="label">{{ a.label }}</div>
        </li>
      </ul>
      <div>
        <input type="text" placeholder="adjustment" v-model="adjustment"> <button @click="adjust">Adjust Times</button>
      </div>
      <div>
      </div>
      <div>
        <button @click="save">Save</button>
        {{ saveNotification }}
        <button @click="annotations = []">CLEAR</button>
        <button @click="doTruncate">Truncate to cursor</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.song-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fa-edit,.fa-arrow-up {
  margin-left: 5px;
}

.song-container {
  margin: 30px;
  margin-top: 10px;
}

.annotations-container {
  max-width: 800px;
}

.waveform-container {
  border: 1px solid #ccc;
  padding: 10px;
}

.annotations {
  height: 200px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 5px;
}

.annotations li {
  display: flex;
}

.annotations li.active {
  background-color: #fceaff;
}

.annotations li div {
  margin-left: 5px;
  margin-right: 10px;
}

.label {
  padding-right: 30px;
}

.files-list {
  display: flex;
  flex-direction: row;
}

.files-list * {
  padding-right: 10px;
}
</style>

<script>
import Waveform from './waveform.vue'
import GlobalEvents from 'vue-global-events';

export default {
  data() {
    return {
      keybust: 0,
      time: -1,
      song: {
        title: null,
        artist: null,
        url: null,
        next: null,
        prev: null
      },
      adjustment: 0,
      editAnnotation: null,
      saveNotification: "",
      annotations: [],
      available: [],
      file: ""
    }
  },
  methods: {
    async save() {
      let response = await fetch('/annotations/' + this.id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annotations: this.annotations
        })
      })
      response.json().then(d => this.saveNotification = d.status)
    },
    addMarker() {
      let a = { time: this.time, label: ""}
      let index = this.activeAnnotation

      this.annotations.splice(index + 1, 0, a)
    },
    setTime(ev) {
      this.time = ev
    },
    chooseFile(f) {
      this.file = f
      this.fetchAnnotations()
    },
    adjust() {
      this.adjustment = parseFloat(this.adjustment)
      this.annotations.forEach(a => a.time += this.adjustment)
      this.adjustment = 0
    },
    deleteAt(idx) {
      this.annotations.splice(idx, 1)
    },
    seek(time) {
      this.$refs.waveform.seek(parseFloat(time))
    },
    fetchSongInfo() {
      fetch(`/songs/${this.id}.json`)
        .then(r => r.json())
        .then(j => this.song = j)
    },
    fetchAnnotations() {
      fetch('/annotations/' + this.id + "?file=" + this.file)
        .then(r => r.json())
        .then(j => {
          this.file = j.file
          this.available = j.available
          this.annotations = j.annotations
        })
    },
    async doTruncate() {
      await fetch(`/audio/truncate/${this.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ truncateAt: this.time })
      })


      this.keybust++
    }
  },
  watch: {
    id() {
      this.editAnnotation = null
      this.saveNotification = ""
      this.fetchSongInfo()
      this.fetchAnnotations()
    }
  },
  mounted() {
    this.fetchSongInfo()
    this.fetchAnnotations()
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    activeAnnotation() {
      for ( let i = this.annotations.length - 1; i >= 0 ; i-- ) {
        if ( this.annotations[i].time <= this.time )
          return i
      }
      return -1
    }
  },
  components: { Waveform, GlobalEvents }
}
</script>
