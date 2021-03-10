<template>
  <div class="song-container">
    <GlobalEvents
      @keydown.prevent.m="addMarker"/>
    <waveform class="waveform-container" :id="$route.params.id" :annotations="annotations" ref="waveform" @time="setTime"/>
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
      </div>
    </div>
  </div>
</template>

<style scoped>
.fa-edit,.fa-arrow-up {
  margin-left: 5px;
}

.song-container {
  margin: 30px;
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
      time: -1,
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
      this.annotations.push({time: this.time, label: ""})
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
    fetchAnnotations() {
      fetch('/annotations/' + this.id + "?file=" + this.file)
        .then(r => r.json())
        .then(j => {
          this.file = j.file
          this.available = j.available
          this.annotations = j.annotations
        })
    }
  },
  watch: {
    id() {
      this.fetchAnnotations()
    }
  },
  mounted() {
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
