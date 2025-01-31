<script setup lang="ts">
import { markRaw, reactive } from 'vue'
import NavigationTabs from '@/components/NavigationTabs.vue'
import EmsStatus from './components/EmsStatus.vue';
import EmsParameters from './components/EmsParameters.vue';
import ParaComparisons from './components/ParaComparisons.vue';
import ParaSettings from './components/ParaSettings.vue';
import UserGroupSettings from './components/UserGroupSettings.vue';

const tabList = reactive([
  { name: '일별 (불)일치 현황', component: markRaw(EmsStatus) },
  { name: '파라미터 조회', component: markRaw(EmsParameters) },
  { name: '파라미터별 권고값 비교', component: markRaw(ParaComparisons) },
  { name: '권고 파라미터 설정', component: markRaw(ParaSettings) },
  { name: '사용자 그룹 설정', component: markRaw(UserGroupSettings) },
] as any)

</script>

<template>
  <div class="container-fluid mt-2 p-0">
    <NavigationTabs :tab-list="tabList" />
  </div>
</template>
