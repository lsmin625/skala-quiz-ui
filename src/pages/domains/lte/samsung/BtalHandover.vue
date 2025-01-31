<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import apiCall from '@/scripts/api-call'
import { getDate, trimDate, getTimestamp } from '@/scripts/time-util';
import ItemsTable from '@/components/ItemsTable.vue';
import InlineInput from '@/components/InlineInput.vue';
import { setSequence } from '@/scripts/utils'

const selectedDate = ref('')

const tableTal = reactive({
  headers: [
    { label: "순번", value: "no" },
    { label: "TAL", value: "talId" },
    { label: "ATT_TOT_CNT", value: "attTotCnt" },
    { label: "INTRA_ATT_TOT", value: "intraAttTot" },
  ],
  items: [] as any,
})

const tableTac = reactive({
  headers: [
    { label: "NB TAC", value: "nbTac" },
    { label: "NB TAC_ATT_TOT", value: "nbTacAttTot" }
  ],
  items: [] as any,
})

const selectedTalId = ref<string>()

const selectTal = (item: any) => {
  selectedTalId.value = item.talId
  tableTac.items = item.nbTacList
}

const getList = async () => {
  tableTal.items.length = 0
  tableTac.items.length = 0
  selectedTalId.value = ''

  const url = '/son/api/btal-ho/list'
  const queryParams = {
    date: trimDate(selectedDate.value),
    count: page.count,
    offset: page.current - 1
  }
  const { body: pagedList } = await apiCall.get(url, null, queryParams)
  if (pagedList) {
    page.total = pagedList.total
    page.current = pagedList.offset + 1
    tableTal.items = pagedList.list
    tableTal.items.forEach((item: any) => {
      item.talId = item.id.talId
    })
    setSequence(tableTal.items, (page.current - 1) * page.count + 1)
  }
}

const downloadExcel = async (path: string) => {
  const url = `/son/api/lte/samsung/${path}/excel/download`
  await apiCall.download(url, null, null, `lte-${path}-${getTimestamp()}`)
}

const page = reactive({
  total: 0,
  current: 1,
  count: 10,
})


watch(() => page.current, () => {
  getList()
})

watch(() => page.count, () => {
  page.current = 1
  getList()
})

onMounted(() => {
  selectedDate.value = getDate()
})
</script>

<template>
  <div class="container-fluid border border-top-0 p-2">
    <div class="row">
      <div class="col-4">
        <InlineInput label="조회일자" type="date" class="form-control-sm p-1" v-model="selectedDate" />
      </div>
      <div class="col d-flex justify-content-start">
        <button class="btn btn-sm btn-outline-primary pt-0 pb-0 m-1" @click="downloadExcel('ems')">엑셀다운로드
        </button>
      </div>
      <div class="col d-flex justify-content-end">
        <button class="btn btn-sm btn-primary" @click="getList">조회</button>
      </div>
    </div>
    <div class="row mt-1">
      <div class="col">
        <ItemsTable :headers="tableTal.headers" :items="tableTal.items" @rowSelected="selectTal" :scroll="true"
          :nosetting="true" :small="true" />
        <PageNavigator :totalCount="page.total" v-model:current="page.current" v-model:count="page.count" />
      </div>
      <div class="col">
        <InlineInput label="TAL" v-model="selectedTalId" :disabled="true" class="mb-1" />
        <ItemsTable :headers="tableTac.headers" :items="tableTac.items" :scroll="true" :nosetting="true"
          :small="true" />
      </div>
    </div>
  </div>
</template>
