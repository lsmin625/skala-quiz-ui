<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()

const goBack = () => {
  router.go(-1);
}

const goHome = () => {
  router.push('/');
}

</script>

<template>
  <div class="container mt-3 d-flex flex-column">
    <div class="fs-2 text-center"><i class="bi bi-emoji-tear"> </i> Ooops! Unknown Route.</div>
    <span class="fs-1 text-center">
      {{ route.fullPath }}
    </span>
    <!-- Add Home Icon Button -->
    <div class="text-center mt-3">
      <button @click="goBack" class="btn btn-primary me-1">
        <i class="bi bi-arrow-left"></i> Go Back
      </button>
      <button @click="goHome" class="btn btn-secondary">
        <i class="bi bi-house"></i> Go Home
      </button>
    </div>
  </div>
</template>
