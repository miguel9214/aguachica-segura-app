import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Asegúrate de importar el router
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App);
app.use(router); // Usa el router
app.use(Vue3Toastify);
app.mount('#app');
