<template>
  <div class="dashboard-container">
    <!-- Encabezado del Dashboard -->
    <div class="dashboard-header">
      <h2>
        <i class="bi bi-clipboard2-pulse me-2"></i>Panel de Control de
        Emergencias
      </h2>
      <p class="welcome-message">
        Bienvenido, <strong>{{ currentUser }}</strong>
        <i class="bi bi-person-circle ms-1"></i>
      </p>
    </div>

    <!-- Tarjetas resumen (KPI) -->
    <div class="row mb-4">
      <!-- Tarjetas de dispositivos -->
      <div class="col-md-3">
        <div class="card summary-card device-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="icon-container bg-primary bg-opacity-10 me-3">
                <i class="bi bi-wifi text-primary fs-3"></i>
              </div>
              <div>
                <h5 class="card-title mb-1">Dispositivos Activos</h5>
                <p class="card-value mb-0">{{ stats.activeDevices }}</p>
                <p class="card-change positive">
                  <i class="bi bi-graph-up-arrow"></i> +5% vs ayer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card summary-card device-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="icon-container bg-secondary bg-opacity-10 me-3">
                <i class="bi bi-wifi-off text-secondary fs-3"></i>
              </div>
              <div>
                <h5 class="card-title mb-1">Dispositivos Inactivos</h5>
                <p class="card-value mb-0">{{ stats.inactiveDevices }}</p>
                <p class="card-change negative">
                  <i class="bi bi-graph-down-arrow"></i> -2% vs ayer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tarjetas de emergencias -->
      <div class="col-md-3">
        <div class="card summary-card police-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="icon-container bg-police-subtle me-3">
                <i class="bi bi-shield-fill text-police fs-3"></i>
              </div>
              <div>
                <h5 class="card-title mb-1">Incidentes Policiales</h5>
                <p class="card-value mb-0">{{ stats.policeIncidents }}</p>
                <p class="card-change positive">
                  <i class="bi bi-graph-up-arrow"></i> +8% vs ayer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
  <div class="card summary-card ambulance-card">
    <div class="card-body">
      <div class="d-flex align-items-center">
        <div class="icon-container bg-primary bg-opacity-10 me-3">
          <i class="bi bi-hospital text-primary fs-3"></i>
        </div>
        <div>
          <h5 class="card-title mb-1">Llamadas Ambulancia</h5>
          <p class="card-value mb-0">{{ stats.ambulanceCalls }}</p>
          <p class="card-change negative"><i class="bi bi-graph-down-arrow"></i> -3% vs ayer</p>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>

    <!-- Segunda fila de tarjetas -->
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card summary-card firefighter-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="icon-container bg-firefighter-subtle me-3">
                <i class="bi bi-fire text-firefighter fs-3"></i>
              </div>
              <div>
                <h5 class="card-title mb-1">Salidas Bomberos</h5>
                <p class="card-value mb-0">{{ stats.firefighterOutcomes }}</p>
                <p class="card-change positive">
                  <i class="bi bi-graph-up-arrow"></i> +12% vs ayer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card summary-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="icon-container bg-info bg-opacity-10 me-3">
                <i class="bi bi-speedometer2 text-info fs-3"></i>
              </div>
              <div>
                <h5 class="card-title mb-1">Tiempo Respuesta</h5>
                <p class="card-value mb-0">{{ stats.responseTime }} min</p>
                <p class="card-change positive">
                  <i class="bi bi-graph-down-arrow"></i> -1.5 min vs ayer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card summary-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="icon-container bg-dark bg-opacity-10 me-3">
                <i class="bi bi-shield-check text-dark fs-3"></i>
              </div>
              <div>
                <h5 class="card-title mb-1">Situaciones Controladas</h5>
                <p class="card-value mb-0">{{ stats.controlledSituations }}</p>
                <p class="card-change positive">
                  <i class="bi bi-graph-up-arrow"></i> +7% vs ayer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos y visualizaciones -->
    <div class="row mb-4">
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-activity me-2"></i>Actividad Reciente de
              Emergencias
            </h5>
            <div class="chart-container">
              <canvas ref="activityChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-pie-chart-fill me-2"></i>Distribución de
              Emergencias
            </h5>
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
          <h5 class="card-title mb-0">
            <i class="bi bi-list-ul me-2"></i>Últimas Emergencias
          </h5>
          <router-link to="/eventos" class="btn btn-sm btn-outline-primary">
            <i class="bi bi-eye-fill me-1"></i> Ver todos
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
                <td>#{{ event.id }}</td>
                <td>
                  <span
                    :class="`badge bg-${
                      event.deviceStatus === 'Activo' ? 'success' : 'secondary'
                    }`"
                  >
                    <i
                      :class="`bi ${
                        event.deviceStatus === 'Activo'
                          ? 'bi-wifi'
                          : 'bi-wifi-off'
                      } me-1`"
                    ></i>
                    {{ event.device }}
                  </span>
                </td>
                <td>
                  <span
                    class="badge d-flex align-items-center"
                    :class="`bg-${getEventTypeClass(event.type)}`"
                  >
                    <i :class="`bi ${getEventIcon(event.type)} me-1`"></i>
                    {{ event.type }}
                  </span>
                </td>
                <td>
                  <i class="bi bi-geo-alt-fill me-1 text-muted"></i>
                  {{ event.location }}
                </td>
                <td>
                  <i class="bi bi-clock-fill me-1 text-muted"></i>
                  {{ formatDateTime(event.timestamp) }}
                </td>
                <td>
                  <span
                    class="badge"
                    :class="`bg-${getStatusClass(event.status)}`"
                  >
                    <i :class="`bi ${getStatusIcon(event.status)} me-1`"></i>
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
      <h5 class="mb-3">
        <i class="bi bi-lightning-charge-fill me-2"></i>Acciones Rápidas
      </h5>
      <div class="row">
        <div
          class="col-md-2 col-6 mb-3"
          v-for="action in quickActions"
          :key="action.title"
        >
          <router-link
            :to="action.path"
            class="quick-action-card text-decoration-none"
          >
            <div class="card h-100">
              <div class="card-body text-center">
                <div
                  class="icon-container mb-3"
                  :class="`bg-${action.color}-subtle`"
                >
                  <i :class="`bi ${action.icon} fs-4 text-${action.color}`"></i>
                </div>
                <p class="mb-0 small fw-bold">{{ action.title }}</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { Chart, registerables } from "chart.js";

// Registra todos los componentes de Chart.js
Chart.register(...registerables);

const router = useRouter();
const currentUser = ref(
  localStorage.getItem("authUser") || "Operador de Emergencias"
);
const activityChart = ref(null);
const pieChart = ref(null);
let activityChartInstance = null;
let pieChartInstance = null;

// Colores personalizados
const colors = {
  police: "rgb(107, 142, 35)", // Verde oliva
  ambulance: "rgb(13, 110, 253)", // Azul
  firefighter: "rgb(220, 53, 69)", // Rojo
};

// Datos de ejemplo para el dashboard
const stats = ref({
  activeDevices: 42,
  inactiveDevices: 8,
  policeIncidents: 15,
  ambulanceCalls: 22,
  firefighterOutcomes: 8,
  responseTime: 5.2,
  controlledSituations: 38,
});

const recentEvents = ref([
  {
    id: 1024,
    device: "CAM-025",
    deviceStatus: "Activo",
    type: "POLICÍA",
    location: "Av. Principal 123",
    timestamp: new Date(),
    status: "En curso",
  },
  {
    id: 1023,
    device: "SEN-412",
    deviceStatus: "Inactivo",
    type: "AMBULANCIA",
    location: "Calle Secundaria 456",
    timestamp: new Date(Date.now() - 3600000),
    status: "Atendido",
  },
  {
    id: 1022,
    device: "CAM-012",
    deviceStatus: "Activo",
    type: "BOMBEROS",
    location: "Barrio Industrial",
    timestamp: new Date(Date.now() - 7200000),
    status: "En proceso",
  },
  {
    id: 1021,
    device: "SEN-205",
    deviceStatus: "Activo",
    type: "POLICÍA",
    location: "Parque Central",
    timestamp: new Date(Date.now() - 10800000),
    status: "Resuelto",
  },
  {
    id: 1020,
    device: "CAM-018",
    deviceStatus: "Inactivo",
    type: "AMBULANCIA",
    location: "Residencial Las Flores",
    timestamp: new Date(Date.now() - 14400000),
    status: "Atendido",
  },
]);

const quickActions = ref([
  {
    title: "Dispositivos",
    icon: "bi-device-hdd-fill",
    path: "/dispositivos",
    color: "primary",
  },
  {
    title: "Eventos",
    icon: "bi-plus-circle-fill",
    path: "/eventos",
    color: "success",
  },
  { title: "Despacho", icon: "bi-send-fill", path: "/despacho", color: "info" },
  { title: "Ver Mapa", icon: "bi-map-fill", path: "/mapa", color: "warning" },
  {
    title: "Reportes",
    icon: "bi-file-earmark-bar-graph-fill",
    path: "/reports",
    color: "danger",
  },
  {
    title: "Configuración",
    icon: "bi-gear-fill",
    path: "/settings",
    color: "secondary",
  },
]);

// Inicializar gráficos
const initCharts = () => {
  // Destruir instancias anteriores si existen
  if (activityChartInstance) activityChartInstance.destroy();
  if (pieChartInstance) pieChartInstance.destroy();

  // Gráfico de actividad (líneas) - SOLO EMERGENCIAS
  if (activityChart.value) {
    activityChartInstance = new Chart(activityChart.value, {
      type: "line",
      data: {
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
        datasets: [
          {
            label: "POLICÍA",
            data: [2, 1, 4, 5, 3, 2],
            backgroundColor: `${colors.police.replace(")", ", 0.2)")}`,
            borderColor: colors.police,
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
          {
            label: "AMBULANCIA",
            data: [3, 2, 5, 7, 4, 3],
            backgroundColor: `${colors.ambulance.replace(")", ", 0.2)")}`,
            borderColor: colors.ambulance,
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
          {
            label: "BOMBEROS",
            data: [0, 1, 2, 1, 3, 1],
            backgroundColor: `${colors.firefighter.replace(")", ", 0.2)")}`,
            borderColor: colors.firefighter,
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "#333",
              font: {
                weight: "bold",
              },
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              color: "#666",
            },
          },
          x: {
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              color: "#666",
            },
          },
        },
      },
    });
  }

  // Gráfico circular (pie) - SOLO EMERGENCIAS
  if (pieChart.value) {
    pieChartInstance = new Chart(pieChart.value, {
      type: "pie",
      data: {
        labels: ["POLICÍA", "AMBULANCIA", "BOMBEROS"],
        datasets: [
          {
            data: [15, 22, 8],
            backgroundColor: [
              colors.police,
              colors.ambulance,
              colors.firefighter,
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: "#333",
              font: {
                weight: "bold",
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.raw}`;
              },
            },
          },
        },
      },
    });
  }
};

// Métodos de ayuda
const getEventTypeClass = (type) => {
  const types = {
    POLICÍA: "police",
    AMBULANCIA: "ambulance",
    BOMBEROS: "firefighter",
  };
  return types[type] || "secondary";
};

const getEventIcon = (type) => {
  const icons = {
    POLICÍA: "bi-shield-fill",
    AMBULANCIA: "bi-ambulance",
    BOMBEROS: "bi-fire",
  };
  return icons[type] || "bi-exclamation-triangle-fill";
};

const getStatusClass = (status) => {
  const statuses = {
    Nuevo: "danger",
    Atendido: "success",
    "En proceso": "warning",
    "En curso": "warning",
    Resuelto: "info",
  };
  return statuses[status] || "secondary";
};

const getStatusIcon = (status) => {
  const icons = {
    Nuevo: "bi-asterisk",
    Atendido: "bi-check-circle-fill",
    "En proceso": "bi-hourglass-split",
    "En curso": "bi-arrow-repeat",
    Resuelto: "bi-flag-fill",
  };
  return icons[status] || "bi-question-circle-fill";
};

const formatDateTime = (date) => {
  return date.toLocaleString();
};

// Ciclo de vida
onMounted(() => {
  if (!currentUser.value) {
    router.push("/");
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
  border-left: 4px solid;
  height: 100%;
  transition: transform 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-3px);
}

.device-card {
  border-left-color: var(--bs-primary) !important;
}

/* Estilos para colores personalizados */
.police-card {
  border-left-color: rgb(107, 142, 35) !important;
}

.ambulance-card {
  border-left-color: rgb(13, 110, 253) !important;
}

.firefighter-card {
  border-left-color: rgb(220, 53, 69) !important;
}

.bg-police {
  background-color: rgb(107, 142, 35) !important;
}

.text-police {
  color: rgb(107, 142, 35) !important;
}

.bg-police-subtle {
  background-color: rgba(107, 142, 35, 0.1) !important;
}

.bg-ambulance {
  background-color: rgb(13, 110, 253) !important;
}

.text-ambulance {
  color: rgb(13, 110, 253) !important;
}

.bg-ambulance-subtle {
  background-color: rgba(13, 110, 253, 0.1) !important;
}

.bg-firefighter {
  background-color: rgb(220, 53, 69) !important;
}

.text-firefighter {
  color: rgb(220, 53, 69) !important;
}

.bg-firefighter-subtle {
  background-color: rgba(220, 53, 69, 0.1) !important;
}

.summary-card .card-value {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 5px 0;
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

.icon-container {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-action-card .card {
  transition: all 0.2s ease;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.quick-action-card .card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.quick-action-card .card-body {
  padding: 1.5rem 0.5rem;
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

.dark-mode .quick-action-card .card {
  background-color: #3a3a3a;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
</style>
