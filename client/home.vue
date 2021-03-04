<template>
  <div>
    <vuetable ref="vuetable"
      :fields="['name', 'nickname', 'email', 'gender']"
      api-url="/songs.json"
    ></vuetable>
  </div>
</template>
<script>
export default {}
</script>

