<template>
  <div class="app-container" :class="{ 'dark-mode': darkMode }">
    <AppNavbar
      v-if="showLayout"
      :darkMode="darkMode"
      @toggle-dark-mode="toggleDarkMode"
      @logout="handleLogout"
    />
    
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <AppFooter v-if="showLayout" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'; // Importa watch aquí
import { useRoute, useRouter } from 'vue-router';
import AppNavbar from '@/components/Navbar.vue';
import AppFooter from '@/components/Footer.vue';

const route = useRoute();
const router = useRouter();
const darkMode = ref(false);

const hiddenLayoutRoutes = ['/', '/login'];

const showLayout = computed(() => {
  return !hiddenLayoutRoutes.includes(route.path) && isAuthenticated.value;
});

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('accessToken') || !!sessionStorage.getItem('authUser');
});

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  updateDarkModeStyles();
  saveDarkModePreference();
};

const updateDarkModeStyles = () => {
  if (darkMode.value) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
};

const saveDarkModePreference = () => {
  localStorage.setItem('darkMode', darkMode.value.toString());
};

const loadDarkModePreference = () => {
  const savedMode = localStorage.getItem('darkMode') === 'true';
  darkMode.value = savedMode;
  updateDarkModeStyles();
};

const handleLogout = () => {
  localStorage.removeItem('accessToken');
  sessionStorage.removeItem('authUser');
  localStorage.removeItem('region');
  router.push('/');
};

// Ahora watch funciona correctamente
watch(route, (to) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    router.push('/login');
  }
});

onMounted(() => {
  loadDarkModePreference();
});
</script>

<style>
/* Tus estilos permanecen igual */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bs-body-bg);
  transition: background-color 0.3s ease;
}

.main-content {
  flex: 1;
  padding-top: 56px;
  padding-bottom: 60px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dark-mode {
  --bs-body-bg: #1a1a1a;
  --bs-body-color: #e0e0e0;
  --bs-border-color: #333;
}

.dark-mode .navbar {
  background-color: #0d3b66 !important;
  border-bottom: 1px solid #333;
}

.dark-mode .card {
  background-color: #2d2d2d;
  border-color: var(--bs-border-color);
  color: #e0e0e0;
}

.dark-mode .table {
  --bs-table-bg: #2d2d2d;
  --bs-table-color: #e0e0e0;
  --bs-table-border-color: #444;
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 50px;
    padding-bottom: 50px;
  }
}
</style>