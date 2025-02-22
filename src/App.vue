<template>
  <div :class="{ 'dark-mode': darkMode }">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-brand">Sistema de Monitoreo</div>
      <div class="navbar-links">
        <!-- <router-link to="/" class="nav-link">Eventos</router-link> -->
        <router-link to="/cameras" class="nav-link">Eventos</router-link>
        <router-link to="/users" class="nav-link">Usuarios</router-link>
      </div>
      <button @click="toggleDarkMode" class="toggle-dark-mode">
        {{ darkMode ? 'Modo Claro' : 'Modo Oscuro' }}
      </button>
    </nav>

    <!-- Contenido dinámico -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const darkMode = ref(false);

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
};
</script>

<style>
/* Estilos globales */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #007bff;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.toggle-dark-mode {
  background-color: #333;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-dark-mode:hover {
  background-color: #555;
}

/* Modo oscuro */
.dark-mode {
  background-color: #121212;
  color: white;
}

.dark-mode .navbar {
  background-color: #1e1e1e;
}
</style>