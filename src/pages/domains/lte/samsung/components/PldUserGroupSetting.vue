<script setup lang="ts">
import { reactive, onMounted, onUnmounted, watch } from 'vue'
import ItemsTable from '@/components/ItemsTable.vue';
import { PldGroup, serviceTypes, setCurrentPldGroup, getPldListWithParas, getPldListWithParaList } from '../commons';
import PldBaseSetting from './PldBaseSetting.vue';

const props = defineProps<{
  setting: PldGroup,
}>()

const emit = defineEmits(['save', 'delete'])

const watchTargets = reactive({
  serviceType: props.setting.serviceType,
  groupName: props.setting.groupName,
  pldGuide: 'PLD 목록(오른쪽 패널)에서 선택',
  changed: 0
})

const emitSave = () => {
  const item = {
    id: props.setting.id,
    serviceType: watchTargets.serviceType,
    groupName: watchTargets.groupName,
    pldList: getPldListWithParas(table.items),
  }
  emit('save', item)
}

const emitDelete = () => {
  const item = {
    id: props.setting.id,
  }
  emit('delete', item)
}

const table = reactive({
  headers: [
    { label: "PLD명", value: "pldName" },
  ],
  items: [] as any,
})

watch(() => props.setting.pldList, () => {
  table.items = props.setting.pldList
  watchTargets.changed++
}, { deep: true })

onMounted(() => {
  props.setting.pldList = getPldListWithParaList(props.setting.pldList)
  setCurrentPldGroup(props.setting)
})

onUnmounted(() => {
  setCurrentPldGroup(null)
})

</script>

<template>
  <div class="p-2">
    <OptionSelect label="서비스타입" class="mb-1" :options="serviceTypes" v-model="watchTargets.serviceType" />
    <InlineInput label="그룹명" class="mb-1" v-model="watchTargets.groupName" />
    <InlineInput label="PLD 목록" v-model="watchTargets.pldGuide" :disabled="true" />
    <div class="row g-2">
      <div class="col-2">
      </div>
      <div class="col">
        <ItemsTable class="mt-1" :headers="table.headers" :items="table.items" :scroll="true" :small="true"
          :noheader="true">
          <template #body="{ item }">
            <PldBaseSetting :setting="item" :selectable="true" />
          </template>
        </ItemsTable>
      </div>
    </div>
    <ElementButtons refTable="PldUserGroups" @save="emitSave" @delete="emitDelete" :watchTargets="watchTargets"
      :disableDelete="!props.setting.id" />
  </div>
</template>
