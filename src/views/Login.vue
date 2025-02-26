<template>
    <div class="container">
      <h1 class="text-center mt-5">Iniciar Sesión en eWeLink</h1>
      <div class="text-center mt-4">
        <button @click="redirectToLogin" class="btn btn-primary">
          Iniciar Sesión con eWeLink
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter, useRoute } from "vue-router";
  import { onMounted } from "vue";
  
  const router = useRouter();
  const route = useRoute();
  
  const redirectToLogin = () => {
    window.location.href = "http://127.0.0.1:8000/login";
  };
  
  onMounted(() => {
    const token = route.query.token;
    const region = route.query.region;
  
    if (token) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("region", region);
      router.push("/home");
    }
  });
  </script>
  