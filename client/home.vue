<template>
  <div>
    <vuetable ref="vuetable"
      class="song-table"
      :initial-page="initialPage"
      :fields="fields"
      :per-page="15"
      @vuetable:pagination-data="onPaginationData"
      api-url="/songs.json">
      <div slot="song_title-slot" slot-scope="props">
        <router-link v-if="props.rowData.has_file" :to="`/song/${props.rowData.song_id}`">{{ props.rowData.song_title }}</router-link>
        <span v-else>{{ props.rowData.song_title }}</span>
      </div>
    </vuetable>
    <vuetable-pagination
      ref="pagination"
      @vuetable-pagination:change-page="onChangePage"/>
  </div>
</template>
<style>
.song-table td {
  border: 1px solid #ccc;
  padding: 5px;
}
</style>
<script>
import Vuetable from "vuetable-3"
import { VuetablePagination } from "vuetable-3"

export default {
  methods: {
    onPaginationData (paginationData) {
      this.$refs.pagination.setPaginationData(paginationData)
    },
    // when the user click something that causes the page to change,
    // call "changePage" method in Vuetable, so that that page will be
    // requested from the API endpoint.
    onChangePage (page) {
      history.pushState({}, null, '/?page=' + page)
      this.$refs.vuetable.changePage(page)
    }
  },
  data() {
    return {
      fields: [
        {
          name: 'song_id',
          title: 'id'
        },
        {
          name: 'song_title-slot',
          title: 'title'
        },
        'artist',
        {
          name: 'song_duration',
          title: 'length',
          formatter: (d) => {
            let seconds = parseFloat(d)
            let m = Math.floor(d / 60)
            let s = seconds - m * 60
            return `${m}m${s}s`
          }
        },
        'source',
        {
          name: 'has_file',
          title: 'file?'
        },
        'annotations_verified'
      ]
    }
  },
  computed: {
    initialPage() {
      if (this.$route.query.page)
        return parseInt(this.$route.query.page)
      else
        return 1
    }
  },
  components: { Vuetable, VuetablePagination }
}
</script>

