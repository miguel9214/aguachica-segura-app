<template>
  <div class="container mt-5">
    <h1 class="mb-4">Gestión de Usuarios</h1>

    <!-- Botón para abrir el modal de creación -->
    <button class="btn btn-primary mb-4" @click="openCreateModal">
      Crear Usuario
    </button>

    <!-- Tabla de usuarios -->
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Cédula</th>
          <th>Teléfono</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.cedula }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.email }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" @click="openEditModal(user)">
              Editar
            </button>
            <button class="btn btn-sm btn-danger" @click="deleteUser(user.id)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para crear/editar usuario -->
    <div class="modal fade" :class="{ show: isModalOpen }" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? 'Editar Usuario' : 'Crear Usuario' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
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
              <button type="submit" class="btn btn-primary">
                {{ isEditing ? 'Guardar Cambios' : 'Crear Usuario' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// Datos de ejemplo para usuarios
const users = ref([
  {
    id: 1,
    name: 'Juan Pérez',
    cedula: '123456789',
    phone: '3001234567',
    email: 'juan@example.com',
    address: 'Calle 123 #45-67',
    coordinates: '4.7110,-74.0721',
    createdAt: '2023-10-25',
  },
  {
    id: 2,
    name: 'María Gómez',
    cedula: '987654321',
    phone: '3109876543',
    email: 'maria@example.com',
    address: 'Carrera 45 #67-89',
    coordinates: '4.6980,-74.0431',
    createdAt: '2023-10-26',
  },
]);

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
  createdAt: '',
});

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
    createdAt: new Date().toISOString().split('T')[0], // Fecha actual
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
const saveUser = () => {
  if (isEditing.value) {
    // Actualizar usuario existente
    const index = users.value.findIndex((u) => u.id === currentUser.value.id);
    if (index !== -1) {
      users.value[index] = { ...currentUser.value };
    }
  } else {
    // Crear nuevo usuario
    currentUser.value.id = users.value.length + 1;
    users.value.push({ ...currentUser.value });
  }
  closeModal();
};

// Eliminar usuario
const deleteUser = (userId) => {
  users.value = users.value.filter((user) => user.id !== userId);
};

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
</style>