// load bootstrap css globally (week3 lab style)
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// mount vue app with router
createApp(App).use(router).mount('#app')
