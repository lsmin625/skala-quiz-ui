<script setup lang="ts">
import { reactive, onMounted, watch, ref } from 'vue'
import ItemsTable from '@/components/ItemsTable.vue';
import { PldInfo, PldPara, isPldParaInCurrentPldGroup, getPldListWithParaList, setPldParaToCurrentPldGroup } from '../commons';
import OptionSwitch from '@/components/OptionSwitch.vue';
import PldBaseSettingPara from './PldBaseSettingPara.vue';
import { ascendArray } from '@/scripts/utils';
import apiCall from '@/scripts/api-call'

const props = defineProps<{
  setting: PldInfo,
  selectable?: boolean
}>()

const emit = defineEmits(['save', 'delete', 'selectionChanged'])

const pldParaSetting = ref<PldPara>({} as PldPara)

const watchTargets = reactive({
  pldName: props.setting.pldName,
  changed: 0
})

const table = reactive({
  selectableHeaders: [
    { label: "선택", value: "selected" },
    { label: "PLD 파라미터", value: "paraName" },
  ],
  headers: [
    { label: "PLD 파라미터", value: "paraName" },
  ],
  items: [] as any,
})

const buildTable = async () => {
  if (props.selectable) {
    await getPldInfo()
  } else {
    table.items = props.setting.pldParaList || []
  }
  table.items.forEach((item: any) => {
    item.selected = isPldParaInCurrentPldGroup(watchTargets.pldName, item.paraName)
  })
  ascendArray(table.items, 'paraName')
}

const getPldInfo = async () => {
  table.items = []

  const url = '/son/api/pld/base'
  const queryParams = {
    pldName: props.setting.pldName
  }
  const { body: pldInfo } = await apiCall.get(url, null, queryParams)
  if (pldInfo) {
    table.items = getPldListWithParaList(pldInfo.pldParaList)
  }
}

watch(() => props.setting.selected, () => {
  emit('selectionChanged', props.setting)
})


const selectSetting = (item: PldPara) => {
  pldParaSetting.value = item
}

const addSetting = () => {
  selectSetting({
    paraName: '',
    paraValue: '',
    selected: false
  })
}

const saveSetting = async (item: PldPara) => {
  const index = table.items.findIndex((pldPara: any) => pldPara.paraName === item.paraName)
  if (index >= 0) {
    table.items.splice(index, 1)
  }
  table.items.push({ ...item })
  buildTable()
  watchTargets.changed++
}

const deleteSetting = async (item: PldPara) => {
  const index = table.items.findIndex((pldPara: any) => pldPara.paraName === item.paraName)
  if (index >= 0) {
    table.items.splice(index, 1)
    buildTable()
    watchTargets.changed++
  }
}

const emitSave = () => {
  const item = {
    id: props.setting.id,
    pldName: watchTargets.pldName,
    pldParaList: [...table.items]
  }
  emit('save', item)
}

const emitDelete = () => {
  const item = {
    id: props.setting.id,
  }
  emit('delete', item)
}

const paraSelectionChanged = (pldPara: PldPara) => {
  setPldParaToCurrentPldGroup(props.setting.pldName, pldPara)
}

onMounted(() => {
  buildTable()
})

</script>

<template>
  <div class="p-2">
    <template v-if="props.selectable">
      <ItemsTable refTable="PldBaseSetting" :headers="table.selectableHeaders" :items="table.items" :small="true"
        :scroll="true" :noaddition="true" @checkChanged="paraSelectionChanged">
        <template #body="{ item }">
          <PldBaseSettingPara :setting="item" @save="saveSetting" @delete="deleteSetting"
            @selectionChanged="paraSelectionChanged" :saveonly="true" />
        </template>
      </ItemsTable>
    </template>
    <template v-else>
      <InlineInput label="PLD 명" class="mb-1" v-model="watchTargets.pldName" :append="true">
        <OptionSwitch v-model="props.setting.selected" label="선택" :disabled="true" />
      </InlineInput>
      <div class="row g-2">
        <div class="col-2">
        </div>
        <div class="col">
          <ItemsTable refTable="PldBaseSetting" :headers="table.headers" :items="table.items" :small="true"
            :scroll="true" @rowSelected="selectSetting" @addClicked="addSetting">
            <template #header>
              <PldBaseSettingPara :setting="pldParaSetting" @save="saveSetting" @delete="deleteSetting" />
            </template>
            <template #body="{ item }">
              <PldBaseSettingPara :setting="item" @save="saveSetting" @delete="deleteSetting" />
            </template>
          </ItemsTable>
        </div>
      </div>
      <ElementButtons refTable="PldBaseList" @save="emitSave" @delete="emitDelete" :watchTargets="watchTargets"
        :disableDelete="!props.setting.id" />
    </template>
  </div>
</template>
