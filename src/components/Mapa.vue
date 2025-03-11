<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h1 class="text-center">Mapa de Aguachica</h1>
        <div id="map" style="height: 500px"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

onMounted(() => {
  const map = L.map('map').setView([8.3060, -73.6181], 14);

  // Capas base
  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors',
  });

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

  // Marcadores azules
  users.forEach((user) => {
    L.marker([user.latitude, user.longitude])
      .addTo(map)
      .bindPopup(user.name);
  });

  // Marcadores rojos
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

  redMarkers.forEach((marker) => {
    L.marker([marker.latitude, marker.longitude], { icon: redIcon })
      .addTo(map)
      .bindPopup(marker.name);
  });
});
</script>