import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index.js";

// Vuetify imports
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// v-calendar imports
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.use(VCalendar, {}) // Registers v-calendar globally
app.mount('#app')
