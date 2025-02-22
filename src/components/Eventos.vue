<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const selectedUser = ref(null);
const users = ref([]); // Usuarios cargados
const allUsers = ref([
  { id: 0, name: 'Todos' }, // Opción "Todos"
  { id: 1, name: 'Usuario 1' },
  { id: 2, name: 'Usuario 2' },
  { id: 3, name: 'Usuario 3' },
  { id: 4, name: 'Usuario 4' },
  { id: 5, name: 'Usuario 5' },
  { id: 6, name: 'Usuario 6' },
  { id: 7, name: 'Usuario 7' },
  { id: 8, name: 'Usuario 8' },
  { id: 9, name: 'Usuario 9' },
  { id: 10, name: 'Usuario 10' },
  { id: 11, name: 'Usuario 11' },
  { id: 12, name: 'Usuario 12' },
  { id: 13, name: 'Usuario 13' },
  { id: 14, name: 'Usuario 14' },
  { id: 15, name: 'Usuario 15' },
  { id: 16, name: 'Usuario 16' },
  { id: 17, name: 'Usuario 17' },
  { id: 18, name: 'Usuario 18' },
  { id: 19, name: 'Usuario 19' },
  { id: 20, name: 'Usuario 20' },
]);
const events = ref([]);
const eventId = ref(1);
const searchQuery = ref("");
const startDate = ref("");
const endDate = ref("");
const darkMode = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(5);
const loadedUsersCount = ref(0); // Contador de usuarios cargados

// Preestablecer "Todos" al cargar la página
onMounted(() => {
  selectedUser.value = allUsers.value[0]; // Seleccionar "Todos" por defecto
  loadMoreUsers(); // Cargar los primeros 10 usuarios
  window.addEventListener('scroll', handleScroll); // Escuchar el evento de scroll
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll); // Limpiar el evento al desmontar
});

// Cargar más usuarios (10 a la vez)
const loadMoreUsers = () => {
  const start = loadedUsersCount.value;
  const end = start + 10;
  const newUsers = allUsers.value.slice(start, end);
  users.value = [...users.value, ...newUsers];
  loadedUsersCount.value += newUsers.length;
};

// Manejar el scroll para cargar más usuarios
const handleScroll = () => {
  const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  if (bottom && loadedUsersCount.value < allUsers.value.length) {
    loadMoreUsers();
  }
};

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
  <div :class="{ 'dark-mode': darkMode }" class="container-fluid vh-100 p-4">
    <div class="row h-100">
      <!-- Listado de Usuarios -->
      <div class="col-md-4 h-100 bg-light p-3 border-end">
        <h2 class="mb-4">Usuarios</h2>
        <input type="text" class="form-control mb-3" placeholder="Buscar usuarios..." v-model="searchQuery" />
        <ul class="list-group overflow-auto" style="max-height: 80vh;">
          <li
            v-for="user in users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()))"
            :key="user.id"
            @click="selectedUser = user"
            :class="['list-group-item', 'list-group-item-action', { 'active': selectedUser && selectedUser.id === user.id }]"
          >
            {{ user.name }}
          </li>
        </ul>
      </div>

      <!-- Eventos del Usuario Seleccionado -->
      <div class="col-md-8 h-100 p-3">
        <h2 class="mb-4">Eventos de {{ selectedUser ? selectedUser.name : '...' }}</h2>
        <div class="d-flex gap-2 mb-4">
          <input type="text" class="form-control" placeholder="Buscar eventos..." v-model="searchQuery" />
          <input type="date" class="form-control" v-model="startDate" />
          <input type="date" class="form-control" v-model="endDate" />
          <button @click="clearFilters" class="btn btn-danger">Limpiar</button>
        </div>
        <div v-if="paginatedEvents.length">
          <div
            v-for="event in paginatedEvents"
            :key="event.id"
            :class="['card', 'mb-3', { 'bg-dark text-white': darkMode }]"
          >
            <div class="card-body">
              <p class="card-text">{{ event.description }}</p>
              <div class="text-muted text-end">{{ event.timestamp }}</div>
            </div>
          </div>
          <nav aria-label="Paginación de eventos" class="d-flex justify-content-center mt-4">
            <ul class="pagination">
              <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                <button class="page-link" @click="prevPage">Anterior</button>
              </li>
              <li class="page-item disabled">
                <span class="page-link">Página {{ currentPage }} de {{ totalPages }}</span>
              </li>
              <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                <button class="page-link" @click="nextPage">Siguiente</button>
              </li>
            </ul>
          </nav>
        </div>
        <p v-else class="text-muted">No hay eventos para este usuario.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dark-mode {
  background-color: #121212;
  color: white;
}

.dark-mode .bg-light {
  background-color: #1e1e1e !important;
  border-color: #444 !important;
}

.dark-mode .list-group-item {
  background-color: #2d2d2d;
  border-color: #444;
  color: white;
}

.dark-mode .list-group-item.active {
  background-color: #007bff;
  border-color: #007bff;
}

.dark-mode .card {
  background-color: #2d2d2d;
  border-color: #444;
}

.dark-mode .text-muted {
  color: #bbb !important;
}
</style>