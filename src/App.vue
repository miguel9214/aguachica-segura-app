<template>
  <div :class="{ 'dark-mode': darkMode }">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">Sistema de Monitoreo</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/eventos" class="nav-link">Eventos</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/users" class="nav-link">Usuarios</router-link>
            </li>
          </ul>
          <button @click="toggleDarkMode" class="btn btn-outline-light">
            {{ darkMode ? 'Modo Claro' : 'Modo Oscuro' }}
          </button>
        </div>
      </div>
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

/* Modo oscuro */
.dark-mode {
  background-color: #121212;
  color: white;
}

.dark-mode .navbar {
  background-color: #1e1e1e !important;
}

.dark-mode .navbar-brand,
.dark-mode .nav-link {
  color: white !important;
}

.dark-mode .btn-outline-light {
  border-color: white;
  color: white;
}

.dark-mode .btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>