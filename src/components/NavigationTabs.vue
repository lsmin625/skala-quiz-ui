<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Tab {
  name: string;
  component: any;
}

const props = defineProps<{
  tabList: Tab[];
}>();

const emit = defineEmits(['tabSelected']);

const elementId = crypto.randomUUID();

const currentTab = ref<Tab>();
const currentComponent = ref(null);

const selectTab = (tab: Tab) => {
  currentTab.value = tab
  currentComponent.value = tab.component
  emit('tabSelected', tab)
}

onMounted(() => {
  if (props.tabList.length > 0) {
    selectTab(props.tabList[0])
  }
})
</script>

<template>
  <div>
    <ul class="nav nav-tabs" :id="elementId" role="tablist">
      <li v-for="(tab, index) in props.tabList" :key="index" class="nav-item" @click="selectTab(tab)">
        <button class="nav-link" :class="{ 'active': currentTab === tab }" :id="elementId + '-' + index + 'btn'"
          type="button" role="tab">{{ tab.name }}</button>
      </li>
    </ul>
    <div class="tab-content" :id="elementId + 'content'">
      <KeepAlive>
        <component :is="currentComponent"></component>
      </KeepAlive>
    </div>
  </div>
</template>
