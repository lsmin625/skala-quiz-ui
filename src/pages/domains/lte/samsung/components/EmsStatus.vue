<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import apiCall from '@/scripts/api-call'
import { getDate, trimDate, getTimestamp } from '@/scripts/time-util';
import ItemsTable from '@/components/ItemsTable.vue';
import OptionSwitch from '@/components/OptionSwitch.vue';
import OptionSelectByCode from '@/components/OptionSelectByCode.vue';

const selectedDate = ref('')
const region = reactive({
  codeGroupId: 'region_code',
  value: ''
})

const noSubway = ref(false)

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
    { label: "사용자 정의 그룹", value: "userDefinedGroup" },
    { label: "대상", value: "collectedSummary" }, // totalParaCount(collectedParaCount)
    { label: "불일치", value: "discordSummary" }, // discordParaCount(collectedDiscordParaCount)
  ],
  items: [] as any,
})

const tableService = reactive({
  headers: [
    { label: "사용자 정의 그룹", value: "userDefinedGroup" },
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

  const url = '/son/api/lte/samsung/ems'
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

  const url = '/son/api/lte/samsung/para'
  const queryParams = {
    region: region.value,
    noSubway: noSubway.value ? 'yes' : 'no',
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

  const url = '/son/api/lte/samsung/region'
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

  const url = '/son/api/lte/samsung/service'
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

const downloadExcel = async (path: string) => {
  const url = `/son/api/lte/samsung/${path}/excel/download`
  await apiCall.download(url, null, null, `lte-${path}-${getTimestamp()}`)
}

onMounted(() => {
  selectedDate.value = getDate()
  region.value = '1'
})
</script>

<template>
  <div class="container-fluid border border-top-0 p-2">
    <div class="row">
      <div class="col-2">
        <OptionSelectByCode class="mb-1" :code-group-id="region.codeGroupId" v-model="region.value" />
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
        <div class="row pt-1 pb-1">
          <div class="col">
            <p class="fs-6 fw-bold m-0">EMS별 수집상태</p>
          </div>
          <div class="col d-flex justify-content-end">
            <button class="btn btn-sm btn-outline-primary pt-0 pb-0" @click="downloadExcel('ems')">엑셀다운로드
            </button>
          </div>
        </div>
        <ItemsTable :headers="tableEms.headers" :items="tableEms.items" :scroll="true" :nosetting="true"
          :small="true" />
      </div>
      <div class="col">
        <div class="row pt-1 pb-1">
          <div class="col-2">
            <p class="fs-6 fw-bold m-0">Default PARA</p>
          </div>
          <div class="col">
            <OptionSwitch class="mb-1" label="지하철제외" v-model="noSubway" />
          </div>
          <div class="col d-flex justify-content-end">
            <button class="btn btn-sm btn-outline-primary pt-0 pb-0" @click="downloadExcel('para')">엑셀다운로드
            </button>
          </div>
        </div>
        <ItemsTable :headers="tablePara.headers" :items="tablePara.items" :scroll="true" :nosetting="true"
          :small="true" />
      </div>
    </div>
    <div class="row mt-1">
      <div class="col">
        <div class="row pt-1 pb-1">
          <div class="col">
            <p class="fs-6 fw-bold m-0">서비스 지역별 총괄</p>
          </div>
          <div class="col d-flex justify-content-end">
            <button class="btn btn-sm btn-outline-primary pt-0 pb-0" @click="downloadExcel('region')">엑셀다운로드
            </button>
          </div>
        </div>
        <ItemsTable :headers="tableRegion.headers" :items="tableRegion.items" :scroll="true" :noaddition="true"
          :small="true" />
      </div>
      <div class="col">
        <div class="row pt-1 pb-1">
          <div class="col">
            <p class="fs-6 fw-bold m-0">서비스별 총괄</p>
          </div>
          <div class="col d-flex justify-content-end">
            <button class="btn btn-sm btn-outline-primary pt-0 pb-0" @click="downloadExcel('service')">엑셀다운로드
            </button>
          </div>
        </div>
        <ItemsTable :headers="tableService.headers" :items="tableService.items" :scroll="true" :noaddition="true"
          :small="true" />
      </div>
    </div>
  </div>
</template>
