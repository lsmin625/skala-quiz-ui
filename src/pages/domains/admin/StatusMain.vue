<script setup lang="ts">
import ApiHistory from './components/ApiHistory.vue';
import SessionStatus from './components/SessionStatus.vue';

</script>

<template>
  <div class="container-fluid">
    <div class="row mt-1 border-0 border-start ">
      <div class="col border-start">
        <SessionStatus class="bg-body-tertiary" />
      </div>
    </div>
    <div class="row border-0 border-start">
      <div class="col">
        <ApiHistory class="bg-body-tertiary" />
      </div>
    </div>
  </div>
</template>