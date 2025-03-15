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
            <th scope="col" @click="sortByField('state')">
              ESTADO
              <span v-if="sortField === 'state'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th scope="col">MODELO</th>
            <th scope="col">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="device in paginatedDevices" :key="device.id">
            <!-- Fila principal del dispositivo -->
            <tr
              :class="getRowClass(device)"
              @click="toggleChannels(device.id)"
              style="cursor: pointer;"
            >
              <td>{{ device.name }}</td>
              <td>{{ device.id }}</td>
              <td>
                <span :class="device.online === '✅ Conectado' ? 'text-success' : 'text-danger'">
                  {{ device.online }}
                </span>
              </td>
              <td>
                {{ getDeviceState(device) }}
              </td>
              <td>{{ device.model }}</td>
              <td>
                <button
                  class="btn btn-sm btn-success"
                  @click.stop="toggleDeviceState(device.id, 'on')"
                  :disabled="!device.online || getDeviceState(device) === 'Encendido'"
                >
                  Encender
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  @click.stop="toggleDeviceState(device.id, 'off')"
                  :disabled="!device.online || getDeviceState(device) === 'Apagado'"
                >
                  Apagar
                </button>
              </td>
            </tr>

            <!-- Fila adicional para dispositivos de 3 vías -->
            <tr
              v-if="device.type === 162 && device.channels && expandedDevices.includes(device.id)"
              class="bg-light"
            >
              <td colspan="6">
                <div class="p-2">
                  <div class="d-flex gap-3">
                    <div
                      v-for="channel in device.channels"
                      :key="channel.channel"
                      :class="['channel', 'p-2', 'border', 'rounded', { 'bg-success text-white': channel.state === 'on' }]"
                    >
                      <p class="mb-1"><strong>{{ channel.name || `Canal ${channel.channel}` }}</strong></p>
                      <p>{{ channel.state === 'on' ? 'Encendido' : 'Apagado' }}</p>
                      <div class="d-flex gap-2">
                        <button
                          class="btn btn-sm btn-success"
                          @click.stop="controlChannel(device.id, channel.channel, 'on')"
                          :disabled="!device.online || channel.state === 'on'"
                        >
                          Encender
                        </button>
                        <button
                          class="btn btn-sm btn-danger"
                          @click.stop="controlChannel(device.id, channel.channel, 'off')"
                          :disabled="!device.online || channel.state === 'off'"
                        >
                          Apagar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
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
import { ref, onMounted, computed, onUnmounted, watch } from "vue";
import axios from "axios";

const devices = ref([]);
const previousDevices = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref("");
const sortField = ref("name");
const sortOrder = ref("asc");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const expandedDevices = ref([]);
const wsReconnectTimer = ref(null);

// Transformar datos de los dispositivos al formato que necesitamos
const transformDevices = (devicesData) => {
  return devicesData.map(device => ({
    id: device.id,
    name: device.name,
    online: device.online ? "✅ Conectado" : "❌ Desconectado",
    state: device.state,
    type: device.type,
    model: device.model,
    channels: device.channels || []
  }));
};

// Función para obtener los dispositivos
const fetchDevices = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/devices");
    if (response.data.error === 0 && response.data.devices) {
      const transformedDevices = transformDevices(response.data.devices);
      previousDevices.value = JSON.parse(JSON.stringify(transformedDevices));
      devices.value = transformedDevices;
    } else {
      error.value = "Error en los datos recibidos: " + (response.data.msg || "Formato inesperado");
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      window.location.href = "/login";
    } else {
      error.value = "Error al cargar dispositivos";
      console.error(err);
    }
  } finally {
    loading.value = false;
  }
};

// Función para cambiar el estado de un dispositivo
const toggleDeviceState = async (deviceId, newState) => {
  try {
    const response = await axios.post(`http://127.0.0.1:8000/control/${deviceId}`, {
      switch: newState
    });
    if (response.data.error === 0) {
      const deviceIndex = devices.value.findIndex(d => d.id === deviceId);
      if (deviceIndex !== -1) {
        devices.value[deviceIndex].state = newState;
      }
    } else {
      console.error("Error al controlar el dispositivo:", response.data.msg);
    }
  } catch (error) {
    console.error("Error de conexión con el servidor:", error);
  }
};

// Función para controlar un canal de un dispositivo
const controlChannel = async (deviceId, channel, newState) => {
  try {
    const params = {
      switches: [{ switch: newState, outlet: channel - 1 }]
    };
    const response = await axios.post(`http://127.0.0.1:8000/control/${deviceId}`, params);
    if (response.data.error === 0) {
      const deviceIndex = devices.value.findIndex(d => d.id === deviceId);
      if (deviceIndex !== -1 && devices.value[deviceIndex].channels) {
        const channelIndex = devices.value[deviceIndex].channels.findIndex(ch => ch.channel === channel);
        if (channelIndex !== -1) {
          devices.value[deviceIndex].channels[channelIndex].state = newState;
        }
      }
    } else {
      console.error("Error al controlar el dispositivo:", response.data.msg);
    }
  } catch (error) {
    console.error("Error de conexión con el servidor:", error);
  }
};

// Función para obtener el estado general del dispositivo
const getDeviceState = (device) => {
  if (device.type === 162 && device.channels) {
    return device.channels.some(channel => channel.state === 'on') ? 'Encendido' : 'Apagado';
  }
  return device.state === 'on' ? 'Encendido' : 'Apagado';
};

// Función para determinar el color de la fila
const getRowClass = (device) => {
  if (getDeviceState(device) === 'Encendido') {
    return "table-success";
  } else if (device.online === '❌ Desconectado') {
    return "table-danger";
  }
  return "";
};

// Función para mostrar/ocultar los canales de un dispositivo
const toggleChannels = (deviceId) => {
  if (expandedDevices.value.includes(deviceId)) {
    expandedDevices.value = expandedDevices.value.filter(id => id !== deviceId);
  } else {
    expandedDevices.value.push(deviceId);
  }
};

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
      return sortOrder.value === "asc" 
        ? a.id.localeCompare(b.id)
        : b.id.localeCompare(a.id);
    } else if (sortField.value === "online") {
      return sortOrder.value === "asc"
        ? a.online.localeCompare(b.online)
        : b.online.localeCompare(a.online);
    } else if (sortField.value === "state") {
      const stateA = getDeviceState(a) === 'Encendido' ? 1 : 0;
      const stateB = getDeviceState(b) === 'Encendido' ? 1 : 0;
      return sortOrder.value === "asc"
        ? stateA - stateB
        : stateB - stateA;
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
  return Math.ceil(sortedDevices.value.length / itemsPerPage.value) || 1;
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

// Vigilar cambios en la búsqueda o el ordenamiento para reiniciar la paginación
watch([searchQuery, sortField, sortOrder], () => {
  currentPage.value = 1;
});

onMounted(() => {
  fetchDevices();
});
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

.channel {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
}

.bg-success {
  background-color: #28a745 !important;
  color: white !important;
}

.btn-sm {
  margin: 2px;
}
</style>