<template>
  <div>
    <GlobalEvents
      @keydown.prevent.space="spaceKeyUp"
      @keydown.prevent.down="downKeyUp"
      @keydown.prevent.left="leftKeyUp"
      @keydown.prevent.right="rightKeyUp"
    />
    <div id="waveform">
    </div>
    <div style="padding-top: 10px;" class="controls">
      <button id="play" @click="playClick">Play</button>
      <input ref="slider" @input="zoom" type="range" min="1" max="200" value="0" style="max-width: 300px;" />
      <span>{{ seekTime.toFixed(2) }}</span>
    </div>
  </div>
</template>

<style scoped>
#waveform {
  position: relative;
  width: 100%;
}

.controls {
  display: flex;
  margin-top: 10px;
}

.controls * {
  margin-right: 30px;
}
</style>

<script>
import WaveSurfer from 'wavesurfer.js';
import Markers from 'wavesurfer.js/dist/plugin/wavesurfer.markers.js';
import Playhead from 'wavesurfer.js/dist/plugin/wavesurfer.playhead.js';
import GlobalEvents from 'vue-global-events';

export default {
  components: { GlobalEvents },
  props: ["id", "annotations"],
  data() {
    return {
      seekTime: 0,
      wavesurfer: null
    }
  },
  methods: {
    seek(time) {
      this.wavesurfer.setCurrentTime(time)
    },
    spaceKeyUp() {
      this.playClick()
    },
    downKeyUp() {
      this.wavesurfer.playhead.setPlayheadTime(this.wavesurfer.getCurrentTime())
    },
    leftKeyUp() {
      this.wavesurfer.setCurrentTime(this.wavesurfer.getCurrentTime() - 1)
    },
    rightKeyUp() {
      this.wavesurfer.setCurrentTime(this.wavesurfer.getCurrentTime() + 1)
    },
    playClick() {
      this.wavesurfer.playPause()
    },
    zoom(ev) {
      this.wavesurfer.zoom(Number(ev.target.value))
    },
    playheadTime() {
      return this.wavesurfer.playhead.playheadTime
    }
  },
  watch: {
    annotations: {
      deep: true,
      handler(value) {
        this.wavesurfer.markers.clear()

        value.forEach(a => {
          let pos, color
          pos = 'top'
          color = '#ff990a'

          this.wavesurfer.markers.add({
            time: a.time,
            position: pos,
            color: color,
            label: a.label
          })
        })
      }
    }
  },
  beforeDestroy() {
    this.wavesurfer.destroy()
  },
  mounted() {
    this.wavesurfer = WaveSurfer.create({
      backend: 'MediaElement',
      container: this.$el.children[0],
      plugins: [
        Markers.create(),
        Playhead.create()
      ]
    })
    this.wavesurfer.load('/audio/' + this.id)
    this.wavesurfer.on('audioprocess', time => {
      this.seekTime = time
      this.$emit('time', time)
    })

    this.wavesurfer.on('seek', pct => {
      this.playhead = this.wavesurfer.getDuration() * pct
      this.$emit('time', this.playhead)
      this.seekTime = this.playhead
    })

    this.wavesurfer.on('play', () => {
      this.playhead = this.wavesurfer.getCurrentTime()
    })

    this.wavesurfer.on('pause', () => {
      this.wavesurfer.setCurrentTime(this.playhead)
    })

    let slider = this.$refs.slider

    slider.value = 1;
    slider.min = 1;
    slider.max = 20;
    this.wavesurfer.zoom(slider.value);

  }
}
</script>
