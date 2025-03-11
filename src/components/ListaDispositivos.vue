<template>
  <div class="container mt-4">
    <h2 class="text-center mb-4">Lista de Dispositivos</h2>

    <!-- Campo de búsqueda -->
    <div class="mb-4">
      <input
        type="text"
        class="form-control"
        placeholder="Buscar dispositivo por nombre o ID..."
        v-model="searchQuery"
      />
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <div v-else>
      <table class="table table-hover table-striped">
        <thead>
          <tr>
            <th scope="col" @click="sortByField('name')">
              Nombre
              <span v-if="sortField === 'name'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th scope="col" @click="sortByField('id')">
              ID
              <span v-if="sortField === 'id'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th scope="col" @click="sortByField('online')">
              RED
              <span v-if="sortField === 'online'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th scope="col" @click="sortByField('switchStatus')">
              ESTADO
              <span v-if="sortField === 'switchStatus'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="device in paginatedDevices"
            :key="device.id"
            :class="getRowClass(device)"
          >
            <td>{{ device.name }}</td>
            <td>{{ device.id }}</td>
            <td>
              <span :class="device.online === '✅ Conectado' ? 'text-success' : 'text-danger'">
                {{ device.online }}
              </span>
            </td>
            <td>
              {{ device.switchStatus === 'on' ? 'Encendido' : 'Apagado' }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Controles de paginación -->
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="prevPage">Anterior</a>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
            <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="nextPage">Siguiente</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import axios from "axios";

const devices = ref([]);
const previousDevices = ref([]); // Almacenar el estado anterior de los dispositivos
const loading = ref(true);
const error = ref(null);
const searchQuery = ref("");
const sortField = ref("name"); // Campo por el que se ordena
const sortOrder = ref("asc"); // Orden ascendente o descendente
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Función para obtener los dispositivos
const fetchDevices = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/devices");
    const newDevices = response.data;

    // Comparar el estado anterior con el nuevo estado
    newDevices.forEach((newDevice, index) => {
      const oldDevice = previousDevices.value[index];
      if (oldDevice && oldDevice.switchStatus === 'off' && newDevice.switchStatus === 'on') {
        // El dispositivo ha cambiado a "on"
        sendTelegramMessage(newDevice);
      }
    });

    // Actualizar el estado anterior
    previousDevices.value = newDevices;
    devices.value = newDevices;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      // Redirigir a la página de inicio de sesión
      window.location.href = "/login";
    } else {
      error.value = "Error al cargar dispositivos";
      console.error(err);
    }
  } finally {
    loading.value = false;
  }
};

// Función para enviar un mensaje a Telegram
const sendTelegramMessage = async (device) => {
  const url = "https://api.telegram.org/bot7064383758:AAF7NXbJ78DqVM9vc82qMRXLMjePtIpRbF4/sendMessage";
  const message = {
    chat_id: "-1002423016491",
    text: `${device.name} ha activado alarma el ${new Date().toLocaleString()}. Ubicación: https://www.google.com/maps?q=8.3090664,-73.6047486`
  };

  try {
    await axios.post(url, message, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log("Mensaje enviado a Telegram");
  } catch (error) {
    console.error("Error al enviar mensaje a Telegram:", error);
  }
};

// Intervalo para refrescar los datos cada 1 segundo
let intervalId;

onMounted(() => {
  const ws = new WebSocket('ws://localhost:8080');
  ws.onmessage = (event) => {
    const devicesData = JSON.parse(event.data);
    devices.value = devicesData;
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };

  fetchDevices(); // Llamada inicial
  intervalId = setInterval(fetchDevices, 1000); // Refrescar cada 1 segundo
});

// Limpiar el intervalo cuando el componente se desmonta
onUnmounted(() => {
  clearInterval(intervalId);
});

// Computed property para filtrar dispositivos
const filteredDevices = computed(() => {
  return devices.value.filter((device) => {
    return (
      device.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      device.id.toString().includes(searchQuery.value)
    );
  });
});

// Computed property para ordenar dispositivos
const sortedDevices = computed(() => {
  return filteredDevices.value.slice().sort((a, b) => {
    if (sortField.value === "name") {
      return sortOrder.value === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField.value === "id") {
      return sortOrder.value === "asc" ? a.id - b.id : b.id - a.id;
    } else if (sortField.value === "online") {
      return sortOrder.value === "asc"
        ? a.online.localeCompare(b.online)
        : b.online.localeCompare(a.online);
    } else if (sortField.value === "switchStatus") {
      return sortOrder.value === "asc"
        ? a.switchStatus.localeCompare(b.switchStatus)
        : b.switchStatus.localeCompare(a.switchStatus);
    }
    return 0;
  });
});

// Computed property para dispositivos paginados
const paginatedDevices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedDevices.value.slice(start, end);
});

// Computed property para el número total de páginas
const totalPages = computed(() => {
  return Math.ceil(sortedDevices.value.length / itemsPerPage.value);
});

// Función para ordenar por campo
const sortByField = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortOrder.value = "asc";
  }
};

// Función para determinar el color de la fila
const getRowClass = (device) => {
  if (device.switchStatus === 'on') {
    return "table-success"; // Fila verde para dispositivos encendidos
  } else if (device.online === '❌ Desconectado') {
    return "table-danger"; // Fila roja para dispositivos desconectados
  }
  return ""; // Sin color adicional
};

// Métodos para la paginación
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};
</script>

<style scoped>
.table {
  border-radius: 12px;
  overflow: hidden;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.075);
}

.table-success {
  background-color: #d4edda !important;
}

.table-danger {
  background-color: #f8d7da !important;
}

.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
}

th {
  cursor: pointer;
}

.pagination {
  margin-top: 20px;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}

.page-link {
  color: #007bff;
}

.page-link:hover {
  color: #0056b3;
}
</style>