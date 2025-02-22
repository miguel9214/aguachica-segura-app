import { createRouter, createWebHistory } from 'vue-router';
import CameraList from '@/components/CameraList.vue';
import UserManagement from '@/components/UserManagement.vue';
import EventView from '@/components/EventView.vue'; // Tu componente actual

const routes = [
  { path: '/', component: EventView }, // Ruta por defecto
  { path: '/cameras', component: CameraList },
  { path: '/users', component: UserManagement },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;