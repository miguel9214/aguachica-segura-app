<template>
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>Acceso al Sistema</h2>
          <p class="text-muted">Ingrese sus credenciales</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="mb-3">
            <label for="email" class="form-label">Usuario</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="username"
              required
              placeholder="Usuario de prueba: admin"
            >
          </div>
          
          <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <div class="input-group">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                class="form-control" 
                v-model="password"
                required
                placeholder="Cualquier contraseña"
              >
              <button 
                class="btn btn-outline-secondary" 
                type="button"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>
          
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="!loading">Ingresar</span>
              <span v-else class="spinner-border spinner-border-sm"></span>
            </button>
          </div>
        </form>
        
        <div class="login-footer mt-3">
          <p class="text-center mb-0">
            <router-link to="/" class="text-decoration-none">
              ← Volver al inicio
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginUser',
    data() {
      return {
        username: '',
        password: '',
        showPassword: false,
        loading: false
      }
    },
    methods: {
      handleLogin() {
        this.loading = true;
        
        // Simulación de login (2 segundos de delay)
        setTimeout(() => {
          // Credenciales de prueba (cualquier contraseña funciona)
          const testUsers = ['admin', 'operador', 'tecnico'];
          
          if (testUsers.includes(this.username.toLowerCase())) {
            // Guardar en sessionStorage (solo para esta sesión)
            sessionStorage.setItem('authUser', this.username);
            this.$router.push('/dashboard');
          } else {
            alert('Usuario no reconocido. Use: admin, operador o tecnico');
          }
          
          this.loading = false;
        }, 2000);
      }
    },
    mounted() {
      // Si ya está logueado, redirigir
      if (sessionStorage.getItem('authUser')) {
        this.$router.push('/dashboard');
      }
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f8f9fa;
    padding: 20px;
  }
  
  .login-card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    width: 100%;
    max-width: 400px;
  }
  
  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .login-header img {
    max-height: 60px;
    margin-bottom: 1rem;
  }
  
  .login-header h2 {
    color: #2c3e50;
    font-weight: 600;
  }
  
  .login-footer {
    border-top: 1px solid #eee;
    padding-top: 1rem;
  }
  </style>