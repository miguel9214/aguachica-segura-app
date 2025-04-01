<template>
    <nav class="navbar navbar-expand-lg navbar-dark" :class="{'bg-dark': darkMode, 'bg-primary': !darkMode}">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand d-flex align-items-center">
          <img src="@/assets/logo.png" alt="Logo" class="navbar-logo me-2">
          <span>Monitoreo RP</span>
        </router-link>
        
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
  
        <div class="collapse navbar-collapse" id="navbarContent">
          <!-- Menú izquierdo (solo visible autenticado) -->
          <ul v-if="isAuthenticated" class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link to="/home" class="nav-link" active-class="active">
                <i class="bi bi-house-door me-1"></i> Inicio
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/eventos" class="nav-link" active-class="active">
                <i class="bi bi-calendar-event me-1"></i> Eventos
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/dispositivos" class="nav-link" active-class="active">
                <i class="bi bi-camera-video me-1"></i> Dispositivos
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/mapa" class="nav-link" active-class="active">
                <i class="bi bi-map me-1"></i> Mapa
              </router-link>
            </li>
          </ul>
  
          <!-- Menú derecho -->
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <button 
                @click="toggleDarkMode"
                class="btn btn-link nav-link"
                :title="darkMode ? 'Modo claro' : 'Modo oscuro'"
              >
                <i :class="darkMode ? 'bi bi-sun' : 'bi bi-moon'"></i>
              </button>
            </li>
            
            <li v-if="isAuthenticated" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle me-1"></i> {{ currentUser }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <router-link to="/perfil" class="dropdown-item">
                    <i class="bi bi-person me-2"></i> Perfil
                  </router-link>
                </li>
                <li>
                  <router-link to="/configuracion" class="dropdown-item">
                    <i class="bi bi-gear me-2"></i> Configuración
                  </router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <button @click="logout" class="dropdown-item text-danger">
                    <i class="bi bi-box-arrow-right me-2"></i> Cerrar sesión
                  </button>
                </li>
              </ul>
            </li>
            
            <li v-else class="nav-item">
              <router-link to="/login" class="nav-link" active-class="active">
                <i class="bi bi-box-arrow-in-right me-1"></i> Iniciar sesión
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const darkMode = ref(false);
  
  // Verificar autenticación
  const isAuthenticated = computed(() => {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('authUser');
  });
  
  // Obtener usuario actual
  const currentUser = computed(() => {
    return sessionStorage.getItem('authUser') || 'Usuario';
  });
  
  // Cambiar modo oscuro/claro
  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value;
    document.body.classList.toggle('dark-mode', darkMode.value);
    localStorage.setItem('darkMode', darkMode.value);
  };
  
  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('authUser');
    router.push('/');
  };
  
  // Cargar preferencias al iniciar
  onMounted(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    if (savedMode) {
      darkMode.value = true;
      document.body.classList.add('dark-mode');
    }
  });
  </script>
  
  <style scoped>
  .navbar-logo {
    height: 30px;
    width: auto;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
  }
  
  .nav-link i {
    font-size: 1.1rem;
  }
  
  .active {
    font-weight: 600;
    position: relative;
  }
  
  .active:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 1rem;
    right: 1rem;
    height: 2px;
    background-color: currentColor;
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
  }
  
  .dark-mode .navbar {
    background-color: #1a1a1a !important;
    border-bottom: 1px solid #333;
  }
  
  .dark-mode .dropdown-menu {
    background-color: #2d2d2d;
    border: 1px solid #444;
  }
  
  .dark-mode .dropdown-item {
    color: #eee;
  }
  
  .dark-mode .dropdown-item:hover {
    background-color: #3a3a3a;
    color: #fff;
  }
  </style>