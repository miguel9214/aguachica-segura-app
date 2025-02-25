import { createRouter, createWebHistory } from 'vue-router';
import Eventos from '@/components/Eventos.vue';
import UserManagement from '@/components/UserManagement.vue';
import HomeView from '../views/HomeView.vue'; // Tu componente actual
import Barrios from '../components/Barrios.vue';

const routes = [
  { path: '/', component: HomeView }, // Ruta por defecto
  { path: '/eventos', component: Eventos },
  { path: '/users', component: UserManagement },
  { path: '/barrios', component: Barrios }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;