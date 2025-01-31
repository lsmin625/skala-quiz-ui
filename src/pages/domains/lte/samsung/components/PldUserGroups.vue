<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import apiCall from '@/scripts/api-call'
import { setSequence } from '@/scripts/utils'
import PldUserGroupSetting from './PldUserGroupSetting.vue'
import PldBaseList from './PldBaseList.vue'
import { validateAndNotify } from '@/scripts/validater'
import { PldGroup, getServiceTypeName, setCurrentPldGroup } from '../commons'

const filter = ref('')

const region = reactive({
  codeGroupId: 'region_code',
  code: ''
})

const groupName = ref('')


const pldGroupSetting = ref<PldGroup>({} as PldGroup)

const table = reactive({
  headers: [
    { label: "순번", value: "no" },
    { label: "서비스 타입", value: "serviceTypeName" },
    { label: "그룹명", value: "groupName" },
  ],
  items: [] as any,
})

const page = reactive({
  total: 0,
  current: 1,
  count: 10,
})

const selectSetting = (item: PldGroup) => {
  pldGroupSetting.value = item
}

const addSetting = () => {
  selectSetting({
    id: 0,
    regionCode: region.code,
    serviceType: 'S',
    groupName: '',
    pldList: []
  })
}

const getUserGroups = async () => {
  const inputs = [
    { label: '지역', value: region.code },
  ]
  if (validateAndNotify(inputs)) {
    table.items.length = 0

    const url = '/son/api/pld/groups/list'
    const queryParams = {
      regionCode: region.code,
      groupName: groupName.value,
      count: page.count,
      offset: page.current - 1
    }
    const { body: pagedList } = await apiCall.get(url, null, queryParams)
    if (pagedList) {
      page.total = pagedList.total
      page.current = pagedList.offset + 1
      table.items = pagedList.list
      table.items.forEach((item: any) => {
        item.serviceTypeName = getServiceTypeName(item.serviceType)
      })
      setSequence(table.items, (page.current - 1) * page.count + 1)
    }
  }
  setCurrentPldGroup(null)
}

const saveSetting = async (item: any) => {
  const url = '/son/api/pld/groups'
  const requestBody = {
    id: item.id,
    regionCode: region.code,
    serviceType: item.serviceType,
    groupName: item.groupName,
    pldList: item.pldList
  }

  await apiCall.post(url, null, requestBody)
  getUserGroups()
}

const deleteSetting = async (item: any) => {
  const url = '/son/api/pld/groups'

  await apiCall.delete(url, null, item)
  getUserGroups()
}

watch(() => region.code, () => {
  getUserGroups()
})

watch(() => page.current, () => {
  getUserGroups()
})

watch(() => page.count, () => {
  page.current = 1
  getUserGroups()
})

onMounted(() => {
  region.code = 'capital'
})
</script>

<template>
  <div class="container-fluid border border-top-0 p-2">
    <div class="row mb-2 pb-2 ms-1 me-1 border-0 border-bottom">
      <div class="col">
        <InlineInput label="대상 필터링" v-model="filter" :disabled="true" />
      </div>
      <div class="col">
        <button class="btn btn-sm btn-secondary" @click="">대상 등록 필터링 선택
        </button>
      </div>
      <div class="col d-flex justify-content-end">
        <button class="btn btn-sm btn-primary me-1" @click="">취소</button>
        <button class="btn btn-sm btn-primary" @click="">저장</button>
      </div>
    </div>
    <div class="row mt-1">
      <div class="col">
        <div class="row pt-1 pb-1">
          <div class="col d-flex justify-content-start">
            <OptionSelectByCode class="mb-1" :code-group-id="region.codeGroupId" v-model="region.code" />
            <InlineInput class="ms-1 mb-1" v-model="groupName" placeholder="그룹명 검색"
              @inputEnterPressed="getUserGroups()" />
          </div>
          <div class="col d-flex justify-content-end mt-1 mb-1">
            <button class="btn btn-sm btn-outline-primary pt-0 pb-0" @click="getUserGroups()">조회</button>
          </div>
        </div>
        <ItemsTable refTable="PldUserGroups" :headers="table.headers" :items="table.items" :small="true"
          @rowSelected="selectSetting" @addClicked="addSetting">
          <template #header>
            <PldUserGroupSetting :setting="pldGroupSetting" @save="saveSetting" @delete="deleteSetting" />
          </template>
          <template #body="{ item }">
            <PldUserGroupSetting :setting="item" @save="saveSetting" @delete="deleteSetting" />
          </template>
        </ItemsTable>
        <PageNavigator :totalCount="page.total" v-model:current="page.current" v-model:count="page.count" />
      </div>
      <div class="col">
        <PldBaseList />
      </div>
    </div>
  </div>
</template>
