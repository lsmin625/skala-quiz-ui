<script setup lang="ts">
import UserPane from './components/UserPane.vue';
import MenuPane from './components/MenuPane.vue';
import ApiPane from './components/ApiPane.vue';
import UserGroupApi from './components/UserGroupApi.vue'
import UserGroupMenu from './components/UserGroupMenu.vue'
import CodeGroupPane from './components/CodeGroupPane.vue'

</script>

<template>
  <div class="container-fluid">
    <div class="row mt-1 border-0 border-start ">
      <div class="col">
        <MenuPane class="bg-warning-subtle" />
        <ApiPane class="bg-warning-subtle" />
        <CodeGroupPane class="bg-warning-subtle" />
      </div>
      <div class="col border-start">
        <UserGroupMenu class="bg-success-subtle" />
        <UserGroupApi class="bg-success-subtle" />
        <UserPane class="bg-success-subtle" />
      </div>
    </div>
  </div>
</template>