<script setup lang="ts">
import SubjectPane from './components/SubjectPane.vue';
import ScorePane from './components/ScorePane.vue';

</script>

<template>
  <div class="container-fluid">
    <div class="row mt-1 border-0 border-start ">
      <SubjectPane class="bg-success-subtle" />
      <ScorePane class="bg-warning-subtle" />
    </div>
  </div>
</template>