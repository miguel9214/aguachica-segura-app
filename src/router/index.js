import { createRouter, createWebHistory } from "vue-router";
import LoginEwelink from "../views/Login.vue";
import LoginUser from "../views/LoginUser.vue";
import Eventos from "../components/Eventos.vue";
import UserManagement from "../components/UserManagement.vue";
import Barrios from "../components/Barrios.vue";
import ListaDispositivos from "../components/ListaDispositivos.vue";
import Mapa from "../components/Mapa.vue";
import DashboardView from "../views/DashboardView.vue"; // Nueva vista protegida

const routes = [
  { 
    path: "/",  
    component: LoginUser, 
    meta: { 
      forGuests: true,
      hideLayout: true // Oculta navbar y footer
    }
  },
  { 
    path: "/loginewelink", 
    component: LoginEwelink,
    meta: {
      forGuests: true,
      hideLayout: true
    } 
  },

  { 
    path: "/eventos", 
    name: "eventos",
    component: Eventos, 
    meta: { 
      requiresAuth: true,
      title: "Eventos"
    } 
  },
  { 
    path: "/users", 
    name: "users",
    component: UserManagement, 
    meta: { 
      requiresAuth: true,
      title: "Gestión de Usuarios"
    } 
  },
  { 
    path: "/barrios", 
    name: "barrios",
    component: Barrios, 
    meta: { 
      requiresAuth: true,
      title: "Barrios"
    } 
  },
  {
    path: "/dispositivos",
    name: "dispositivos",
    component: ListaDispositivos,
    meta: { 
      requiresAuth: true,
      title: "Dispositivos"
    },
  },
  { 
    path: "/mapa", 
    name: "mapa",
    component: Mapa, 
    meta: { 
      requiresAuth: true,
      title: "Mapa"
    } 
  },
  { 
    path: "/dashboard", 
    name: "dashboard",
    component: DashboardView,
    meta: { 
      requiresAuth: true,
      title: "Panel de Control"
    } 
  },
  // Ruta de fallback para 404
  { 
    path: "/:pathMatch(.*)*", 
    redirect: "/" 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Comportamiento de scroll al cambiar de ruta
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Protección de rutas alternativa (sin usar beforeEach)
router.beforeResolve((to) => {
  const isAuthenticated = localStorage.getItem("accessToken") || sessionStorage.getItem("authUser");
  
  // Redirigir a login si requiere auth y no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { path: "/" };
  }
  
  // Redirigir al dashboard si ya está autenticado y trata de acceder a rutas de invitados
  if (to.meta.forGuests && isAuthenticated) {
    return { path: "/dashboard" };
  }
});

export default router;