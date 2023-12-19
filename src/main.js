import './assets/main.css'

import { VueFire, VueFireAuth } from 'vuefire'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { firebaseApp } from './firebase.js'
import VueGtag from "vue-gtag";

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'


const app = createApp(App)

app.use(router)
app.use(VueFire, {
    firebaseApp: firebaseApp,
    modules: [
      // ... other modules
      VueFireAuth(),
    ],
  })
app.use(VueGtag, {
  config: { id: "G-4FHX7HGJ24"}
})

app.mount('#app')
