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
  props: ["id", "annotations"],
  data() {
    return {
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
        Markers.create({
          markers: [
            {
              time: 5.5,
              label: "V1",
              color: '#ff990a'
            },
            {
              time: 10,
              label: "V2",
              color: '#00ffcc',
              position: 'top'
            }
          ]
        })
      ]
    })
    this.wavesurfer.load('/audio/' + this.id)
  }
}
</script>
