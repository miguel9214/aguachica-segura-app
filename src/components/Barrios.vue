<template>
    <div class="container mt-5">
      <h1 class="mb-4 text-center">Gestión de Barrios</h1>
  
      <!-- Campo de búsqueda -->
      <div class="mb-4">
        <input
          type="text"
          class="form-control"
          placeholder="Buscar barrio..."
          v-model="searchQuery"
        />
      </div>
  
      <!-- Botón para abrir el modal de creación -->
      <div class="d-flex justify-content-end mb-4">
        <button class="btn btn-primary" @click="openCreateModal">
          <i class="fas fa-plus me-2"></i>Crear Barrio
        </button>
      </div>
  
      <!-- Tabla de barrios -->
      <div class="table-responsive">
        <table class="table table-striped table-hover table-bordered">
          <thead class="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Ciudad</th>
              <th>Código Postal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="barrio in filteredBarrios" :key="barrio.id">
              <td>{{ barrio.name }}</td>
              <td>{{ barrio.city }}</td>
              <td>{{ barrio.postalCode }}</td>
              <td>
                <button class="btn btn-sm btn-warning me-2" @click="openEditModal(barrio)">
                  <i class="fas fa-edit me-1"></i>Editar
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteBarrio(barrio.id)">
                  <i class="fas fa-trash me-1"></i>Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Modal para crear/editar barrio -->
      <div class="modal fade" :class="{ show: isModalOpen }" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">
                {{ isEditing ? 'Editar Barrio' : 'Crear Barrio' }}
              </h5>
              <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveBarrio">
                <div class="mb-3">
                  <label for="name" class="form-label">Nombre</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    v-model="currentBarrio.name"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="city" class="form-label">Ciudad</label>
                  <input
                    type="text"
                    class="form-control"
                    id="city"
                    v-model="currentBarrio.city"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="postalCode" class="form-label">Código Postal</label>
                  <input
                    type="text"
                    class="form-control"
                    id="postalCode"
                    v-model="currentBarrio.postalCode"
                    required
                  />
                </div>
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save me-2"></i>
                    {{ isEditing ? 'Guardar Cambios' : 'Crear Barrio' }}
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
  import { ref, computed, watch } from 'vue';
  
  // Datos de ejemplo para barrios
  const barrios = ref([
    {
      id: 1,
      name: 'Barrio Norte',
      city: 'Ciudad A',
      postalCode: '12345',
    },
    {
      id: 2,
      name: 'Barrio Sur',
      city: 'Ciudad B',
      postalCode: '67890',
    },
  ]);
  
  // Estado del modal y del barrio actual
  const isModalOpen = ref(false);
  const isEditing = ref(false);
  const currentBarrio = ref({
    id: null,
    name: '',
    city: '',
    postalCode: '',
  });
  
  // Campo de búsqueda
  const searchQuery = ref('');
  
  // Filtrar barrios según la búsqueda
  const filteredBarrios = computed(() => {
    return barrios.value.filter(barrio => {
      return (
        barrio.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        barrio.city.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        barrio.postalCode.includes(searchQuery.value)
      );
    });
  });
  
  // Abrir modal para crear barrio
  const openCreateModal = () => {
    isEditing.value = false;
    currentBarrio.value = {
      id: null,
      name: '',
      city: '',
      postalCode: '',
    };
    isModalOpen.value = true;
  };
  
  // Abrir modal para editar barrio
  const openEditModal = (barrio) => {
    isEditing.value = true;
    currentBarrio.value = { ...barrio };
    isModalOpen.value = true;
  };
  
  // Cerrar modal
  const closeModal = () => {
    isModalOpen.value = false;
  };
  
  // Guardar o actualizar barrio
  const saveBarrio = () => {
    if (isEditing.value) {
      // Actualizar barrio existente
      const index = barrios.value.findIndex((b) => b.id === currentBarrio.value.id);
      if (index !== -1) {
        barrios.value[index] = { ...currentBarrio.value };
      }
    } else {
      // Crear nuevo barrio
      currentBarrio.value.id = barrios.value.length + 1;
      barrios.value.push({ ...currentBarrio.value });
    }
    closeModal();
  };
  
  // Eliminar barrio
  const deleteBarrio = (barrioId) => {
    barrios.value = barrios.value.filter((barrio) => barrio.id !== barrioId);
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
  </style>