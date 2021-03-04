<template>
  <div>
    <div id="waveform">
    </div>
    <div style="padding-top: 10px;">
      <button id="play" @click="playClick">Play</button>
    </div>
  </div>
</template>

<script>
import WaveSurfer from 'wavesurfer.js'
import Markers from "wavesurfer.js/dist/plugin/wavesurfer.markers"

export default {
  props: ["id"],
  data() {
    return {
      annotations: null,
      wavesurfer: null
    }
  },
  methods: {
    playClick() {
      this.wavesurfer.playPause()
    }
  },
  mounted() {
    this.wavesurfer = WaveSurfer.create({
      container: this.$el.children[0],
      plugins: [
        Markers.create()
      ]
    })
    this.wavesurfer.load('/audio/' + this.id)
    fetch('/annotations/' + this.id)
      .then(r => r.json())
      .then(j => {
        this.annotations = j
        j.forEach(a => {
          let pos, color
          let firstLetter = a.label[0]
          if ( firstLetter.toUpperCase() == firstLetter ) {
            pos = 'top'
            color = '#ff990a'
          } else {
            pos= 'bottom'
            color = '#aa23ff'
          }
          this.wavesurfer.markers.add({
            time: a.time,
            position: pos,
            color: color,
            label: a.label
          })
        })
      })
  }
}
</script>
