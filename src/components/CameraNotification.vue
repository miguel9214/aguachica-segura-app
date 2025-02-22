<script setup>
import { defineProps, watch, ref } from 'vue';
import { Modal } from 'bootstrap';

const props = defineProps({
  camera: Object
});
const modalRef = ref(null);

watch(() => props.camera, (newCamera) => {
  if (newCamera && modalRef.value) {
    const modal = new Modal(modalRef.value);
    modal.show();
  }
});
</script>

<template>
  <div class="modal fade" ref="modalRef" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Alerta de Cámara</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" v-if="camera">
          <p>{{ camera.name }} ha enviado una alerta.</p>
          <a :href="camera.stream" target="_blank" class="btn btn-primary">Ver transmisión</a>
        </div>
      </div>
    </div>
  </div>
</template>