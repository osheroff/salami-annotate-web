
import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './app.vue'
import Home from './home.vue'
import Song from './song.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/song/:id', component: Song }
]

const router = new VueRouter({ routes, mode: 'history' })

document.addEventListener("DOMContentLoaded", () => {
  new Vue({ router, render: h => h(App) }).$mount('#app')
})

