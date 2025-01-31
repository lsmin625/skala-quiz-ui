<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationBar from './components/NavigationBar.vue'
import { getCurrentMenu } from '@/scripts/store-menus'
import { isEmpty } from '@/scripts/validater';
import { onMounted } from 'vue';

const currentMenu = getCurrentMenu()

onMounted(() => {
  currentMenu.groupId = ''
})
</script>

<template>
  <div class="container-fluid">
    <div class="row bg-body-tertiary">
      <div class="col">
        <NavigationBar />
        <div v-if="!isEmpty(currentMenu.groupId)" style="font-size: small; font-weight: bold;" class="p-1">
          {{ currentMenu.groupName }} > {{ currentMenu.menuName }}
        </div>
      </div>
    </div>
    <div class="row ">
      <div class="col">
        <RouterView v-slot="{ Component }">
          <KeepAlive>
            <component :is="Component" />
          </KeepAlive>
        </RouterView>
      </div>
    </div>
  </div>
</template>
