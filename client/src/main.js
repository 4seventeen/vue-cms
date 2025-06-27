<<<<<<< Updated upstream
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
=======
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index.js";
>>>>>>> Stashed changes

// Vuetify imports
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App)
  .use(vuetify)
  .mount('#app')
