<script setup>
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const selectedUser = ref(null);
const users = ref([
  { id: 0, name: 'Todos' }, // Opción "Todos"
  { id: 1, name: 'Usuario 1' },
  { id: 2, name: 'Usuario 2' },
  { id: 3, name: 'Usuario 3' },
]);
const events = ref([]);
const eventId = ref(1);
const searchQuery = ref("");
const startDate = ref("");
const endDate = ref("");
const darkMode = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Preestablecer "Todos" al cargar la página
onMounted(() => {
  selectedUser.value = users.value[0]; // Seleccionar "Todos" por defecto
});

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
};

const showNotification = () => {
  toast.info(`🔴 Nueva alerta`, {
    autoClose: 5000,
    position: "top-right",
  });
};

const validateDates = () => {
  if (startDate.value && endDate.value && startDate.value > endDate.value) {
    toast.error("La fecha de inicio no puede ser mayor que la fecha de fin");
    return false;
  }
  return true;
};

const getCurrentDateTime = () => {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0];
  return `${date} ${time}`;
};

const simulateEvent = () => {
  if (!selectedUser.value || selectedUser.value.id === 0) return; // No generar eventos para "Todos"
  const newEvent = {
    id: eventId.value++,
    userId: selectedUser.value.id,
    description: `Evento generado por ${selectedUser.value.name}`,
    timestamp: getCurrentDateTime(),
  };
  events.value.unshift(newEvent);
  showNotification();
};

const clearFilters = () => {
  searchQuery.value = "";
  startDate.value = "";
  endDate.value = "";
};

const filteredEvents = computed(() => {
  if (!validateDates()) return [];
  return events.value.filter(event => 
    (selectedUser.value.id === 0 || event.userId === selectedUser.value.id) && // Mostrar todos si se selecciona "Todos"
    (!searchQuery.value || event.description.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
    (!startDate.value || event.timestamp.split(' ')[0] >= startDate.value) &&
    (!endDate.value || event.timestamp.split(' ')[0] <= endDate.value)
  );
});

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredEvents.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / itemsPerPage.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

setInterval(simulateEvent, 3000);
</script>

<template>
  <div :class="{'dark-mode': darkMode}" class="container">
    <!-- <button @click="toggleDarkMode" class="toggle-dark-mode">Modo Oscuro</button> -->
    <div class="row">
      <!-- Listado de Usuarios -->
      <div class="col-md-4 user-list">
        <h2>Usuarios</h2>
        <ul>
          <li 
            v-for="user in users" 
            :key="user.id" 
            @click="selectedUser = user" 
            :class="{ 'selected': selectedUser && selectedUser.id === user.id }">
            {{ user.name }}
          </li>
        </ul>
      </div>
<!-- cao -->
      <!-- Eventos del Usuario Seleccionado -->
      <div class="col-md-8 event-list">
        <h2>Eventos de {{ selectedUser ? selectedUser.name : '...' }}</h2>
        <div class="filters">
          <input type="text" class="form-control" placeholder="Buscar eventos..." v-model="searchQuery" />
          <input type="date" class="form-control" v-model="startDate" />
          <input type="date" class="form-control" v-model="endDate" />
          <button @click="clearFilters" class="clear-filters-button">Limpiar</button>
        </div>
        <div v-if="paginatedEvents.length">
          <div
            v-for="event in paginatedEvents" 
            :key="event.id" 
            class="event-card" 
            :class="{'dark-mode': darkMode}"> -->
            <p>{{ event.description }}</p>
            <div class="timestamp">{{ event.timestamp }}</div>
          </div>
          <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
            <span>Página {{ currentPage }} de {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
          </div>
        </div>
        <p v-else>No hay eventos para este usuario.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  transition: background-color 0.3s, color 0.3s;
}
.user-list {
  background-color: #f8f9fa;
  padding: 20px;
  border-right: 1px solid #ddd;
}
.user-list ul {
  list-style: none;
  padding: 0;
}
.user-list li {
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
}
.user-list li:hover, .user-list li.selected {
  background-color: #007bff;
  color: white;
}
.event-list {
  flex-grow: 1;
  padding: 20px;
}
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.event-card {
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s, border-color 0.3s, color 0.3s;
}
.timestamp {
  font-size: 0.85em;
  color: #999;
  text-align: right;
}
.toggle-dark-mode {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #333;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
}
.toggle-dark-mode:hover {
  background-color: #555;
}

.dark-mode {
  background-color: #121212;
  color: white;

}
.dark-mode .user-list {
  background-color: #1e1e1e;
  border-right: 1px solid #444;
}
.dark-mode .event-card {
  background-color: #1e1e1e;
  border: 1px solid #444;
  color: white;
}
.dark-mode .user-list li:hover, .dark-mode .user-list li.selected {
  background-color: #007bff;
}
.dark-mode .timestamp {
  color: #bbb;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}
.pagination button {
  padding: 5px 10px;
  cursor: pointer;
}
.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.clear-filters-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.clear-filters-button:hover {
  background-color: #c82333;
}
</style>