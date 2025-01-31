<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import apiCall from '@/scripts/api-call'
import { PldInfo, isPldInCurrentPldGroup, setPldToCurrentPldGroup, useCurrentPldGroup } from '../commons';
import PldBaseSetting from './PldBaseSetting.vue';

const pldName = ref('')
const pldSetting = ref<PldInfo>({} as PldInfo)

const table = reactive({
  headers: [
    { label: "선택", value: "selected" },
    { label: "PLD 및 파라미터 선택", value: "pldName" }
  ],
  items: [] as any,
})

const page = reactive({
  total: 0,
  current: 1,
  count: 10,
})

const selectSetting = (item: PldInfo) => {
  pldSetting.value = item
}

const addSetting = () => {
  selectSetting({
    id: 0,
    pldName: '',
    pldParas: '',
    pldParaList: [],
    selected: false
  })
}

const getPldList = async () => {
  table.items.length = 0

  const url = '/son/api/pld/base/list'
  const queryParams = {
    pldName: pldName.value,
    count: page.count,
    offset: page.current - 1
  }
  const { body: pagedList } = await apiCall.get(url, null, queryParams)
  if (pagedList) {
    page.total = pagedList.total
    page.current = pagedList.offset + 1
    table.items = pagedList.list
    table.items.forEach((item: any) => {
      item.selected = isPldInCurrentPldGroup(item.pldName)
    })
  }
}

const saveSetting = async (item: PldInfo) => {
  const url = '/son/api/pld/base'
  await apiCall.post(url, null, item)
  getPldList()
}

const deleteSetting = async (item: PldInfo) => {
  const url = '/son/api/pld/base'

  await apiCall.delete(url, null, item)
  getPldList()
}

const currentPldGroup = useCurrentPldGroup()

watch(currentPldGroup, () => {
  table.items.forEach((item: any) => {
    item.selected = isPldInCurrentPldGroup(item.pldName)
  })
})

watch(() => page.current, () => {
  getPldList()
})

watch(() => page.count, () => {
  page.current = 1
  getPldList()
})

onMounted(() => {

})
</script>

<template>
  <div class="p-2">
    <div class="row mt-1">
      <div class="col">
        <div class="row pt-1 pb-1">
          <div class="col">
            <InlineInput label="PLD 목록" class="ms-1 mb-1" v-model="pldName" placeholder="PLD명 검색"
              @inputEnterPressed="getPldList()" />
          </div>
          <div class="col-4 d-flex justify-content-end mt-1 mb-1">
            <button class="btn btn-sm btn-outline-primary pt-0 pb-0" @click="getPldList()">조회</button>
          </div>
        </div>
        <ItemsTable refTable="PldBaseList" :headers="table.headers" :items="table.items" :small="true"
          @rowSelected="selectSetting" @addClicked="addSetting" @checkChanged="setPldToCurrentPldGroup">
          <template #header>
            <PldBaseSetting :setting="pldSetting" @save="saveSetting" @delete="deleteSetting"
              @selection-changed="setPldToCurrentPldGroup" />
          </template>
          <template #body="{ item }">
            <PldBaseSetting :setting="item" @save="saveSetting" @delete="deleteSetting"
              @selection-changed="setPldToCurrentPldGroup" />
          </template>
        </ItemsTable>
        <PageNavigator :totalCount="page.total" v-model:current="page.current" v-model:count="page.count" />
      </div>
    </div>
  </div>
</template>
