<template>
    <div class="dashboard-container">
      <!-- Encabezado del Dashboard -->
      <div class="dashboard-header">
        <h2>Panel de Control</h2>
        <p class="welcome-message">Bienvenido, <strong>{{ currentUser }}</strong></p>
      </div>
  
      <!-- Tarjetas resumen (KPI) -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card summary-card">
            <div class="card-body">
              <h5 class="card-title">Dispositivos Activos</h5>
              <p class="card-value">{{ stats.activeDevices }}</p>
              <p class="card-change positive">+5% vs ayer</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card summary-card">
            <div class="card-body">
              <h5 class="card-title">Eventos Hoy</h5>
              <p class="card-value">{{ stats.todayEvents }}</p>
              <p class="card-change negative">-2% vs ayer</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card summary-card">
            <div class="card-body">
              <h5 class="card-title">Alertas</h5>
              <p class="card-value">{{ stats.alerts }}</p>
              <p class="card-change neutral">0 nuevas</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card summary-card">
            <div class="card-body">
              <h5 class="card-title">Cobertura</h5>
              <p class="card-value">{{ stats.coverage }}%</p>
              <p class="card-change positive">+3% este mes</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Gráficos y visualizaciones -->
      <div class="row mb-4">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Actividad Reciente</h5>
              <div class="chart-container">
                <canvas ref="activityChart"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Eventos por Tipo</h5>
              <div class="chart-container">
                <canvas ref="pieChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Tabla de últimos eventos -->
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="card-title mb-0">Últimos Eventos</h5>
            <router-link to="/eventos" class="btn btn-sm btn-outline-primary">
              Ver todos
            </router-link>
          </div>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Dispositivo</th>
                  <th>Tipo</th>
                  <th>Ubicación</th>
                  <th>Fecha/Hora</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in recentEvents" :key="event.id">
                  <td>{{ event.id }}</td>
                  <td>{{ event.device }}</td>
                  <td>
                    <span class="badge" :class="`bg-${getEventTypeClass(event.type)}`">
                      {{ event.type }}
                    </span>
                  </td>
                  <td>{{ event.location }}</td>
                  <td>{{ formatDateTime(event.timestamp) }}</td>
                  <td>
                    <span class="badge" :class="`bg-${getStatusClass(event.status)}`">
                      {{ event.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- Acceso rápido -->
      <div class="quick-actions mt-4">
        <h5 class="mb-3">Acciones Rápidas</h5>
        <div class="row">
          <div class="col-md-2 col-6 mb-3" v-for="action in quickActions" :key="action.title">
            <router-link :to="action.path" class="quick-action-card">
              <div class="card">
                <div class="card-body text-center">
                  <i :class="`bi ${action.icon} fs-4 mb-2`"></i>
                  <p class="mb-0 small">{{ action.title }}</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useRouter } from 'vue-router';
  import { Chart, registerables } from 'chart.js';
  
  // Registra todos los componentes de Chart.js
  Chart.register(...registerables);
  
  const router = useRouter();
  const currentUser = ref(localStorage.getItem('authUser') || 'Administrador');
  const activityChart = ref(null);
  const pieChart = ref(null);
  let activityChartInstance = null;
  let pieChartInstance = null;
  
  // Datos de ejemplo para el dashboard
  const stats = ref({
    activeDevices: 42,
    todayEvents: 18,
    alerts: 3,
    coverage: 92
  });
  
  const recentEvents = ref([
    { id: 1024, device: 'CAM-025', type: 'Movimiento', location: 'Barrio Norte', timestamp: new Date(), status: 'Nuevo' },
    { id: 1023, device: 'SEN-412', type: 'Sonido', location: 'Barrio Centro', timestamp: new Date(Date.now() - 3600000), status: 'Revisado' },
    { id: 1022, device: 'CAM-012', type: 'Movimiento', location: 'Barrio Sur', timestamp: new Date(Date.now() - 7200000), status: 'En proceso' },
    { id: 1021, device: 'SEN-205', type: 'Vibración', location: 'Barrio Este', timestamp: new Date(Date.now() - 10800000), status: 'Nuevo' },
  ]);
  
  const quickActions = ref([
    { title: 'Añadir Evento', icon: 'bi-plus-circle', path: '/eventos' },
    { title: 'Gestionar Usuarios', icon: 'bi-people', path: '/users' },
    { title: 'Ver Mapa', icon: 'bi-map', path: '/mapa' },
    { title: 'Dispositivos', icon: 'bi-device-hdd', path: '/dispositivos' },
    { title: 'Configuración', icon: 'bi-gear', path: '/settings' },
    { title: 'Reportes', icon: 'bi-file-earmark-bar-graph', path: '/reports' },
  ]);
  
  // Inicializar gráficos
  const initCharts = () => {
    // Destruir instancias anteriores si existen
    if (activityChartInstance) activityChartInstance.destroy();
    if (pieChartInstance) pieChartInstance.destroy();
  
    // Gráfico de actividad (líneas)
    if (activityChart.value) {
      activityChartInstance = new Chart(activityChart.value, {
        type: 'line',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Eventos',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              tension: 0.3,
              fill: true
            },
            {
              label: 'Alertas',
              data: [5, 8, 2, 3, 1, 4],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#333',
                font: {
                  weight: 'bold'
                }
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#fff',
              bodyColor: '#fff'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                color: '#666'
              }
            },
            x: {
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                color: '#666'
              }
            }
          }
        }
      });
    }
  
    // Gráfico circular (pie)
    if (pieChart.value) {
      pieChartInstance = new Chart(pieChart.value, {
        type: 'pie',
        data: {
          labels: ['Movimiento', 'Sonido', 'Vibración', 'Alarma'],
          datasets: [{
            data: [300, 50, 100, 30],
            backgroundColor: [
              'rgba(54, 162, 235, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(255, 99, 132, 0.7)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: '#333',
                font: {
                  weight: 'bold'
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#fff',
              bodyColor: '#fff'
            }
          }
        }
      });
    }
  };
  
  // Métodos de ayuda
  const getEventTypeClass = (type) => {
    const types = {
      'Movimiento': 'primary',
      'Sonido': 'info',
      'Vibración': 'warning',
      'Alarma': 'danger'
    };
    return types[type] || 'secondary';
  };
  
  const getStatusClass = (status) => {
    const statuses = {
      'Nuevo': 'danger',
      'Revisado': 'success',
      'En proceso': 'warning'
    };
    return statuses[status] || 'secondary';
  };
  
  const formatDateTime = (date) => {
    return date.toLocaleString();
  };
  
  // Ciclo de vida
  onMounted(() => {
    if (!currentUser.value) {
      router.push('/');
    }
    initCharts();
  });
  
  onBeforeUnmount(() => {
    if (activityChartInstance) activityChartInstance.destroy();
    if (pieChartInstance) pieChartInstance.destroy();
  });
  </script>
  
  <style scoped>
  .dashboard-container {
    padding: 20px;
  }
  
  .dashboard-header {
    margin-bottom: 30px;
  }
  
  .welcome-message {
    color: #6c757d;
  }
  
  .summary-card {
    border-left: 4px solid var(--bs-primary);
    height: 100%;
  }
  
  .summary-card .card-value {
    font-size: 1.8rem;
    font-weight: bold;
    margin: 10px 0;
  }
  
  .card-change {
    font-size: 0.8rem;
    margin: 0;
  }
  
  .positive {
    color: var(--bs-success);
  }
  
  .negative {
    color: var(--bs-danger);
  }
  
  .neutral {
    color: var(--bs-secondary);
  }
  
  .chart-container {
    position: relative;
    height: 250px;
    width: 100%;
  }
  
  .quick-action-card .card {
    transition: all 0.2s ease;
  }
  
  .quick-action-card .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .quick-action-card .card-body {
    padding: 1rem;
  }
  
  /* Estilos para modo oscuro */
  .dark-mode .chart-container canvas {
    filter: brightness(0.9);
  }
  
  .dark-mode .summary-card {
    background-color: #2d2d2d;
    color: #fff;
  }
  
  .dark-mode .table {
    --bs-table-bg: #2d2d2d;
    --bs-table-color: #fff;
    --bs-table-border-color: #444;
  }
  
  .dark-mode .card {
    background-color: #2d2d2d;
    color: #fff;
  }
  
  .dark-mode .card-body {
    color: #fff;
  }
  
  .dark-mode .welcome-message {
    color: #aaa;
  }
  </style>