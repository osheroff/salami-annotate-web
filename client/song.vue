<template>
  <div>
    <waveform :id="$route.params.id"/>
  </div>
</template>

<script>
import Waveform from './waveform.vue'
export default {
  components: { Waveform }
}
</script>
