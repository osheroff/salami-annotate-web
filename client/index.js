
import Vue from 'vue'
import App from './app.vue'


document.addEventListener("DOMContentLoaded", (ev) => {
  new Vue({ render: createElement => createElement(App) }).$mount('#app');
})

