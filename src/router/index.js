import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/Login.vue";
import Eventos from "../components/Eventos.vue";
import UserManagement from "../components/UserManagement.vue";
import Barrios from "../components/Barrios.vue";
import HomeView from "../views/HomeView.vue";
import ListaDispositivos from "../components/ListaDispositivos.vue";
import Mapa from "../components/Mapa.vue";

const routes = [
  { path: "/", component: LoginView }, // Login como página principal
  { path: "/home", component: HomeView, meta: { requiresAuth: true } },
  { path: "/eventos", component: Eventos, meta: { requiresAuth: true } },
  { path: "/users", component: UserManagement, meta: { requiresAuth: true } },
  { path: "/barrios", component: Barrios, meta: { requiresAuth: true } },
  { path: "/dispositivos", component: ListaDispositivos, meta: { requiresAuth: true } },
  { path: "/mapa", component: Mapa, meta: { requiresAuth: true } },
  { path: "/login-success", component: LoginView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// // 🔹 Middleware para proteger rutas
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem("accessToken");

//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next("/");
//   } else {
//     next();
//   }
// });

export default router;
