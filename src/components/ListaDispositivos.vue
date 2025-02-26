<template>
    <div class="container mt-4">
      <h2 class="text-center mb-4">Lista de Dispositivos</h2>
  
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
  
      <div v-else-if="error" class="alert alert-danger text-center">
        {{ error }}
      </div>
  
      <div v-else>
        <div class="row">
          <div v-for="device in devices" :key="device.deviceid" class="col-md-4 mb-3">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h5 class="card-title">{{ device.name }}</h5>
                <p class="card-text">
                  <strong>ID:</strong> {{ device.deviceid }} <br>
                  <strong>Estado:</strong>
                  <span :class="device.online ? 'text-success' : 'text-danger'">
                    {{ device.online ? "🟢 En línea" : "🔴 Desconectado" }}
                  </span>
                </p>
                <button class="btn btn-primary">Ver Detalles</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>


<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const devices = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchDevices = async () => {
  try {
    const response = await axios.get("http://localhost:8000/devices");
    devices.value = response.data;
  } catch (err) {
    error.value = "Error al cargar dispositivos";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDevices);
</script>



<style scoped>
.card {
  border-radius: 12px;
}
</style>
