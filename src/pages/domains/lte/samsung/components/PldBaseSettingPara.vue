<script setup lang="ts">
import { reactive } from 'vue'
import { PldPara } from '../commons';

const props = defineProps<{
  setting: PldPara,
  saveonly?: boolean
}>()

const emit = defineEmits(['save', 'delete'])

const watchTargets = reactive({
  paraName: props.setting.paraName,
  paraValue: props.setting.paraValue,
})

const emitSave = () => {
  const item = {
    paraName: watchTargets.paraName,
    paraValue: watchTargets.paraValue,
  }
  emit('save', item)
}

const emitDelete = () => {
  const item = {
    paraName: watchTargets.paraName,
    paraValue: watchTargets.paraValue,
  }
  emit('delete', item)
}
</script>

<template>
  <div class="p-2">
    <InlineInput label="파라미터명" class="mb-1" v-model="watchTargets.paraName" />
    <InlineInput label="파라미터값" class="mb-1" v-model="watchTargets.paraValue" />
    <ElementButtons refTable="PldBaseSetting" @save="emitSave" @delete="emitDelete" :watchTargets="watchTargets"
      :disableDelete="!props.setting.paraName || props.saveonly" />
  </div>
</template>
