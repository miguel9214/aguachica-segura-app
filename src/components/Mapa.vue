<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <!-- Título dinámico -->
        <h1 class="text-center">{{ tituloMapa }}</h1>

        <!-- Select de Departamentos -->
        <select id="departamento-select" class="form-control mb-3" @change="cargarMunicipios">
          <option value="">Selecciona un departamento</option>
          <option v-for="departamento in departamentos" :key="departamento.codigo" :value="departamento.codigo">
            {{ departamento.nombre }}
          </option>
        </select>

        <!-- Select de Municipios -->
        <select id="municipio-select" class="form-control mb-3" @change="cargarMapa">
          <option value="">Selecciona un municipio</option>
          <option v-for="municipio in municipiosFiltrados" :key="municipio.codigo" :value="municipio.codigo">
            {{ municipio.nombre }}
          </option>
        </select>

        <!-- Mapa -->
        <div id="map" style="height: 500px"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { departamentos as departamentosData } from '@/assets/recursos/CoordenadasColombia.js'; // Importar los datos

// Datos de departamentos y municipios
const departamentos = ref(departamentosData);
const municipiosFiltrados = ref([]); // Municipios filtrados por departamento
const tituloMapa = ref("Mapa de Colombia"); // Título dinámico del mapa
let map;

// Marcadores de Aguachica
const users = [
  { name: 'Usuario 1', latitude: 8.3090664, longitude: -73.6047486 },
  { name: 'Usuario 2', latitude: 8.3104319, longitude: -73.6294380 },
  { name: 'Usuario 3', latitude: 8.3120532, longitude: -73.6269369 },
];

const redMarkers = [
  { name: 'SIRENA 1', latitude: 8.3107275, longitude: -73.6270800 },
  { name: 'SIRENA 2', latitude: 8.3106233, longitude: -73.6292610 },
  { name: 'SIRENA 3', latitude: 8.3096493, longitude: -73.6047024 },
];

// Icono azul para usuarios
const blueIcon = L.icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Icono rojo para sirenas
const redIcon = L.icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Inicializar el mapa
onMounted(() => {
  map = L.map('map').setView([8.3060, -73.6181], 14); // Vista inicial de Aguachica

  // Capa base de OpenStreetMap
  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors',
  });

  // Capa Satelital
  const satelliteLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution:
        'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    }
  );

  osmLayer.addTo(map); // Capa estándar por defecto

  // Control de capas
  const baseMaps = {
    Standard: osmLayer,
    Satellite: satelliteLayer,
  };

  L.control.layers(baseMaps).addTo(map);

  // Marcadores azules (usuarios)
  users.forEach((user) => {
    L.marker([user.latitude, user.longitude], { icon: blueIcon })
      .addTo(map)
      .bindPopup(user.name);
  });

  // Marcadores rojos (sirenas)
  redMarkers.forEach((marker) => {
    L.marker([marker.latitude, marker.longitude], { icon: redIcon })
      .addTo(map)
      .bindPopup(marker.name);
  });
});

// Cargar municipios según el departamento seleccionado
function cargarMunicipios(event) {
  const codigoDepartamento = event.target.value;
  const departamento = departamentos.value.find((d) => d.codigo === codigoDepartamento);
  municipiosFiltrados.value = departamento ? departamento.municipios : [];
}

// Cargar el mapa según el municipio seleccionado
function cargarMapa(event) {
  const codigoMunicipio = event.target.value;
  const municipio = municipiosFiltrados.value.find((m) => m.codigo === codigoMunicipio);

  if (municipio) {
    // Ajustar la vista del mapa al municipio seleccionado con su nivel de zoom
    map.setView([municipio.latitud, municipio.longitud], municipio.zoom);

    // Cambiar el título del mapa
    tituloMapa.value = `Mapa de ${municipio.nombre}`;
  } else {
    // Si no se selecciona un municipio, volver al título por defecto
    tituloMapa.value = "Mapa de Colombia";
  }
}
</script>

<style scoped>
/* Estilos opcionales */
</style>
