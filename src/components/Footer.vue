<template>
    <footer class="footer" :class="{'bg-dark': darkMode, 'bg-light': !darkMode}">
      <div class="container py-4">
        <div class="row">
          <div class="col-md-4 mb-4 mb-md-0">
            <h5 class="d-flex align-items-center">
              <!-- <img src="@/assets/logo.png" alt="Logo" class="footer-logo me-2"> -->
              Mantenimiento y Seguridad RP
            </h5>
            <p class="mt-2 small">Sistema profesional de monitoreo y seguridad</p>
          </div>
          
          <div class="col-md-4 mb-4 mb-md-0">
            <h5>Enlaces rápidos</h5>
            <ul class="nav flex-column">
              <li class="nav-item">
                <router-link to="/home" class="nav-link">Inicio</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/eventos" class="nav-link">Eventos</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/dispositivos" class="nav-link">Dispositivos</router-link>
              </li>
            </ul>
          </div>
          
          <div class="col-md-4">
            <h5>Contacto</h5>
            <ul class="nav flex-column">
              <li class="nav-item">
                <a href="mailto:mantenimientoyseguridadrp@gmail.com" class="nav-link">
                  <i class="bi bi-envelope me-2"></i> mantenimientoyseguridadrp@gmail.com
                </a>
              </li>
              <li class="nav-item">
                <a href="tel:+573175755104" class="nav-link">
                  <i class="bi bi-telephone me-2"></i> +57 317 575 5104
                </a>
              </li>
            </ul>
            
            <div class="social-icons mt-3">
              <a href="#" class="text-decoration-none me-3">
                <i class="bi bi-facebook"></i>
              </a>
              <a href="#" class="text-decoration-none me-3">
                <i class="bi bi-twitter-x"></i>
              </a>
              <a href="#" class="text-decoration-none me-3">
                <i class="bi bi-instagram"></i>
              </a>
              <a href="#" class="text-decoration-none">
                <i class="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
        
        <hr class="my-4">
        
        <div class="row">
          <div class="col-md-6 text-center text-md-start">
            <p class="small mb-0">© {{ currentYear }} Mantenimiento y seguridad RP. Todos los derechos reservados.</p>
          </div>
          <div class="col-md-6 text-center text-md-end">
            <p class="small mb-0">
              <router-link to="/privacidad" class="text-decoration-none me-3">Política de privacidad</router-link>
              <router-link to="/terminos" class="text-decoration-none">Términos de servicio</router-link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const darkMode = ref(localStorage.getItem('darkMode') === 'true');
  const currentYear = computed(() => new Date().getFullYear());
  </script>
  
  <style scoped>
  .footer {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding: 2rem 0;
  }
  
  .footer-logo {
    height: 25px;
    width: auto;
  }
  
  .footer h5 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: inherit;
  }
  
  .footer .nav-link {
    padding: 0.25rem 0;
    color: inherit;
  }
  
  .footer .nav-link:hover {
    opacity: 0.8;
  }
  
  .social-icons i {
    font-size: 1.25rem;
    transition: opacity 0.2s;
  }
  
  .social-icons a:hover i {
    opacity: 0.7;
  }
  
  /* Modo oscuro */
  .dark-mode .footer {
    background-color: #1a1a1a !important;
    color: #e0e0e0;
    border-top: 1px solid #333;
  }
  
  .dark-mode .footer a {
    color: #e0e0e0;
  }
  
  .dark-mode .footer hr {
    border-color: #333;
  }
  </style>