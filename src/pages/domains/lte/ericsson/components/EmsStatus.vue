<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import apiCall from '@/scripts/api-call'
import { getDate, trimDate } from '@/scripts/time-util';
import ItemsTable from '@/components/ItemsTable.vue';

const selectedDate = ref('')
const region = reactive({
  options: [
    { label: '수도권', value: '0' },
    { label: '강원', value: '1' },
    { label: '충청', value: '2' },
    { label: '전라', value: '3' },
    { label: '경상', value: '4' },
    { label: '제주', value: '5' },
  ],
  selected: {} as any,
  value: ''
})

const tableEms = reactive({
  headers: [
    { label: "EMS", value: "ems" },
    { label: "전체PLD", value: "totalPldCount" },
    { label: "수집PLD", value: "collectedPldCount" },
    { label: "수집DU-2일", value: "collectedDuCountAgo2" },
    { label: "수집DU-1일", value: "collectedDuCountAgo1" },
    { label: "수집DU", value: "collectedDuCount" },
  ],
  items: [] as any,
})

const tablePara = reactive({
  headers: [
    { label: "PLD NAME", value: "pldName" },
    { label: "대상", value: "collectedSummary" }, // totalParaCount(collectedParaCount)
    { label: "불일치", value: "discordSummary" }, // discordParaCount(collectedDiscordParaCount)
  ],
  items: [] as any,
})

const tableRegion = reactive({
  headers: [
    { label: "User-defined group", value: "userDefinedGroup" },
    { label: "PLD NAME", value: "pldName" },
    { label: "대상", value: "collectedSummary" }, // totalParaCount(collectedParaCount)
    { label: "불일치", value: "discordSummary" }, // discordParaCount(collectedDiscordParaCount)
  ],
  items: [] as any,
})

const tableService = reactive({
  headers: [
    { label: "User-defined group", value: "userDefinedGroup" },
    { label: "PLD NAME", value: "pldName" },
    { label: "대상", value: "collectedSummary" }, // totalParaCount(collectedParaCount)
    { label: "불일치", value: "discordSummary" }, // discordParaCount(collectedDiscordParaCount)
  ],
  items: [] as any,
})

const getStatus = async () => {
  await getEmsStatus()
  await getParaStatus()
  await getRegionStatus()
  await getServiceStatus()
}

const getEmsStatus = async () => {
  tableEms.items.length = 0

  const url = '/api/lte/samsung/ems/status'
  const queryParams = {
    region: region.value,
    date: trimDate(selectedDate.value),
  }
  const { body: pagedList } = await apiCall.get(url, null, queryParams)
  if (pagedList) {
    tableEms.items = pagedList.list
  }
}

const getParaStatus = async () => {
  tablePara.items.length = 0

  const url = '/api/lte/samsung/para/status'
  const queryParams = {
    region: region.value,
    date: trimDate(selectedDate.value),
  }
  const { body: pagedList } = await apiCall.get(url, null, queryParams)
  if (pagedList) {
    tablePara.items = pagedList.list
    tablePara.items.forEach((item: any) => {
      item.collectedSummary = `${item.totalParaCount}(${item.collectedParaCount})`
      item.discordSummary = `${item.discordParaCount}(${item.collectedDiscordParaCount})`
    })
  }
}

const getRegionStatus = async () => {
  tableRegion.items.length = 0

  const url = '/api/lte/samsung/user-group/region'
  const queryParams = {
    region: region.value,
    date: trimDate(selectedDate.value),
  }
  const { body: pagedList } = await apiCall.get(url, null, queryParams)
  if (pagedList) {
    tableRegion.items = pagedList.list
    tableRegion.items.forEach((item: any) => {
      item.collectedSummary = `${item.totalParaCount}(${item.collectedParaCount})`
      item.discordSummary = `${item.discordParaCount}(${item.collectedDiscordParaCount})`
    })
  }
}

const getServiceStatus = async () => {
  tableService.items.length = 0

  const url = '/api/lte/samsung/user-group/service'
  const queryParams = {
    region: region.value,
    date: trimDate(selectedDate.value),
  }
  const { body: pagedList } = await apiCall.get(url, null, queryParams)
  if (pagedList) {
    tableService.items = pagedList.list
    tableService.items.forEach((item: any) => {
      item.collectedSummary = `${item.totalParaCount}(${item.collectedParaCount})`
      item.discordSummary = `${item.discordParaCount}(${item.collectedDiscordParaCount})`
    })
  }
}

onMounted(() => {
  selectedDate.value = getDate()
  region.value = '0'
})
</script>

<template>
  <div class="container-fluid border border-top-0 p-2">
    <div class="row">
      <div class="col-2">
        <OptionSelect class="mb-1" :options="region.options" v-model="region.value" />
      </div>
      <div class="col-2">
        <input type="date" class="form-control-sm p-1" v-model="selectedDate">
      </div>
      <div class="col d-flex justify-content-end">
        <button class="btn btn-sm btn-primary" @click="getStatus">조회</button>
      </div>
    </div>
    <div class="row mt-1">
      <div class="col">
        <p class="fs-6 fw-bold m-0">EMS별 수집상태</p>
        <ItemsTable :headers="tableEms.headers" :items="tableEms.items" :scroll="true" :nosetting="true"
          :small="true" />
      </div>
      <div class="col">
        <p class="fs-6 fw-bold m-0">Default PARA</p>
        <ItemsTable :headers="tablePara.headers" :items="tablePara.items" :scroll="true" :nosetting="true"
          :small="true" />
      </div>
    </div>
    <div class="row mt-1">
      <div class="col">
        <p class="fs-6 fw-bold m-0">서비스 지역별 총괄</p>
        <ItemsTable :headers="tableRegion.headers" :items="tableRegion.items" :scroll="true" :nosetting="true"
          :small="true" />
      </div>
      <div class="col">
        <p class="fs-6 fw-bold m-0">서비스별 총괄</p>
        <ItemsTable :headers="tableService.headers" :items="tableService.items" :scroll="true" :nosetting="true"
          :small="true" />
      </div>
    </div>
  </div>
</template>
