<template>
    <div class="event-view-container">
      <!-- Encabezado con estilo moderno -->
      <div class="event-header text-center py-5 bg-primary text-white">
        <h2 class="display-4 fw-bold">Vista de Eventos</h2>
        <p class="lead">Aquí se mostrarán los eventos registrados en el sistema.</p>
      </div>
  
      <!-- Contenido principal -->
      <div class="container my-5">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="card shadow-sm">
              <div class="card-body">
                <h3 class="card-title fw-bold mb-4">Lista de Eventos</h3>
                <p class="card-text">
                  Próximamente se mostrará una lista detallada de eventos con información relevante.
                </p>
                <!-- Botón como router-link -->
                <router-link to="/eventos" class="btn btn-primary btn-lg">
                  <i class="fas fa-calendar-alt me-2"></i>Ver Eventos
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // Lógica del componente
  </script>
  
  <style scoped>
  .event-view-container {
    background-color: #f8f9fa;
    min-height: 100vh;
  }
  
  .event-header {
    background: linear-gradient(135deg, #007bff, #0056b3);
    padding: 4rem 1rem;
    border-bottom: 4px solid rgba(255, 255, 255, 0.1);
  }
  
  .event-header h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .event-header p {
    font-size: 1.25rem;
    opacity: 0.9;
  }
  
  .card {
    border: none;
    border-radius: 12px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
  
  .card-title {
    color: #343a40;
    font-size: 1.75rem;
  }
  
  .card-text {
    color: #6c757d;
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  .btn-primary {
    background-color: #007bff;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    border-radius: 8px;
    transition: background-color 0.3s ease;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
  }
  
  .btn-primary i {
    margin-right: 0.5rem;
  }
  </style>