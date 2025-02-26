<template>
  <div :class="{ 'dark-mode': darkMode }">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">Sistema de Monitoreo</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link to="/eventos" class="nav-link">Eventos</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/users" class="nav-link">Usuarios</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/barrios" class="nav-link">Barrios</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/dispositivos" class="nav-link">Dispositivos</router-link>
            </li>
          </ul>

          <button @click="toggleDarkMode" class="btn btn-outline-light">
            {{ darkMode ? "Modo Claro" : "Modo Oscuro" }}
          </button>

          <button v-if="isAuthenticated" @click="logout" class="btn btn-danger ms-3">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const darkMode = ref(false);
const router = useRouter();

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
};

const isAuthenticated = computed(() => !!localStorage.getItem("accessToken"));

const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("region");
  router.push("/");
};
</script>
