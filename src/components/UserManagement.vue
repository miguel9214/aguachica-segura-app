<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Gestión de Usuarios</h1>

    <!-- Campo de búsqueda -->
    <div class="mb-4">
      <input
        type="text"
        class="form-control"
        placeholder="Buscar usuario..."
        v-model="searchQuery"
      />
    </div>

    <!-- Botón para abrir el modal de creación -->
    <div class="d-flex justify-content-end mb-4">
      <button class="btn btn-primary" @click="openCreateModal">
        <i class="fas fa-plus me-2"></i>Crear Usuario
      </button>
    </div>

    <!-- Tabla de usuarios -->
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered">
        <thead class="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Cédula</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>ID de Dispositivo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.cedula }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.deviceId }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="openEditModal(user)">
                <i class="fas fa-edit me-1"></i>Editar
              </button>
              <button class="btn btn-sm btn-danger" @click="deleteUser(user.id)">
                <i class="fas fa-trash me-1"></i>Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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

    <!-- Modal para crear/editar usuario -->
    <div class="modal fade" :class="{ show: isModalOpen }" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              {{ isEditing ? 'Editar Usuario' : 'Crear Usuario' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label for="name" class="form-label">Nombre</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="currentUser.name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="cedula" class="form-label">Cédula</label>
                <input
                  type="text"
                  class="form-control"
                  id="cedula"
                  v-model="currentUser.cedula"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="phone" class="form-label">Teléfono</label>
                <input
                  type="tel"
                  class="form-control"
                  id="phone"
                  v-model="currentUser.phone"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="currentUser.email"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="address" class="form-label">Dirección</label>
                <input
                  type="text"
                  class="form-control"
                  id="address"
                  v-model="currentUser.address"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="coordinates" class="form-label">Coordenadas</label>
                <input
                  type="text"
                  class="form-control"
                  id="coordinates"
                  v-model="currentUser.coordinates"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="deviceId" class="form-label">ID de Dispositivo</label>
                <input
                  type="text"
                  class="form-control"
                  id="deviceId"
                  v-model="currentUser.deviceId"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="neighborhood" class="form-label">Barrio</label>
                <input
                  type="text"
                  class="form-control"
                  id="neighborhood"
                  v-model="currentUser.neighborhood"
                  required
                />
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">
                  <i class="fas fa-save me-2"></i>
                  {{ isEditing ? 'Guardar Cambios' : 'Crear Usuario' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';

// Estado de los usuarios
const users = ref([]);

// Estado del modal y del usuario actual
const isModalOpen = ref(false);
const isEditing = ref(false);
const currentUser = ref({
  id: null,
  name: '',
  cedula: '',
  phone: '',
  email: '',
  address: '',
  coordinates: '',
  deviceId: '',
  neighborhood: '',
});

// Campo de búsqueda
const searchQuery = ref('');

// Variables de paginación
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Filtrar usuarios según la búsqueda
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    return (
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.cedula.includes(searchQuery.value) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.deviceId.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

// Computed property para usuarios paginados
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

// Computed property para el número total de páginas
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
});

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

// Abrir modal para crear usuario
const openCreateModal = () => {
  isEditing.value = false;
  currentUser.value = {
    id: null,
    name: '',
    cedula: '',
    phone: '',
    email: '',
    address: '',
    coordinates: '',
    deviceId: '',
    neighborhood: '',
  };
  isModalOpen.value = true;
};

// Abrir modal para editar usuario
const openEditModal = (user) => {
  isEditing.value = true;
  currentUser.value = { ...user };
  isModalOpen.value = true;
};

// Cerrar modal
const closeModal = () => {
  isModalOpen.value = false;
};

// Guardar o actualizar usuario
const saveUser = async () => {
  try {
    const url = 'http://127.0.0.1:8000/api/users'; // URL de la API
    const method = isEditing.value ? 'PUT' : 'POST'; // Método HTTP
    const endpoint = isEditing.value ? `${url}/${currentUser.value.id}` : url; // Endpoint

    // Enviar la solicitud a la API
    const response = await axios({
      method: method,
      url: endpoint,
      data: currentUser.value,
    });

    if (response.status === 200 || response.status === 201) {
      // Actualizar la lista de usuarios en el frontend
      if (isEditing.value) {
        const index = users.value.findIndex((u) => u.id === currentUser.value.id);
        if (index !== -1) {
          users.value[index] = response.data.user;
        }
      } else {
        users.value.push(response.data.user);
      }

      closeModal();
    }
  } catch (error) {
    console.error('Error al guardar el usuario:', error);
    alert('Hubo un error al guardar el usuario. Por favor, inténtalo de nuevo.');
  }
};

// Eliminar usuario
const deleteUser = async (userId) => {
  try {
    const url = `http://127.0.0.1:8000/api/users/${userId}`; // URL de la API

    // Enviar la solicitud a la API
    const response = await axios.delete(url);

    if (response.status === 200) {
      // Eliminar el usuario de la lista en el frontend
      users.value = users.value.filter((user) => user.id !== userId);
    }
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    alert('Hubo un error al eliminar el usuario. Por favor, inténtalo de nuevo.');
  }
};

// Cargar usuarios al iniciar
const fetchUsers = async () => {
  try {
    const url = 'http://127.0.0.1:8000/api/users'; // URL de la API
    const response = await axios.get(url);
    users.value = response.data; // Actualizar la lista de usuarios
  } catch (error) {
    console.error('Error al cargar los usuarios:', error);
    alert('Hubo un error al cargar los usuarios. Por favor, inténtalo de nuevo.');
  }
};

onMounted(() => {
  fetchUsers();
});

// Cerrar modal al hacer clic fuera del modal
const handleClickOutside = (event) => {
  if (event.target.classList.contains('modal')) {
    closeModal();
  }
};

// Escuchar cambios en isModalOpen
watch(isModalOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('click', handleClickOutside);
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
});
</script>

<style scoped>
.modal {
  display: none;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal.show {
  display: block;
}

.table-responsive {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.table thead th {
  background-color: #343a40;
  color: white;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.modal-header {
  background-color: #007bff;
  color: white;
}

.modal-content {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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