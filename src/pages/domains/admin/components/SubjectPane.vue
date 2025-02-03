<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { ascendArray, setSequence } from '@/scripts/utils'
import apiCall from '@/scripts/api-call'
import SubjectSettingPane from './SubjectSettingPane.vue'
import { useUserSession } from '@/scripts/session'

const user = useUserSession()

const table = reactive({
    headers: [
        { label: "순번", value: "no" },
        { label: "과정ID", value: "id" },
        { label: "과정명", value: "subjectName" }
    ],
    items: [] as any,
})

const page = reactive({
    total: 0,
    current: 1,
    count: 10,
})

interface SubjectSetting {
    id: string,
    subjectName: string,
}
const SubjectSetting = ref<SubjectSetting>({} as SubjectSetting)
const selectSetting = (item: SubjectSetting) => {
    SubjectSetting.value = item
}

const getSubjects = async () => {
    console.log(user.value?.instructorId, user.value?.accountId)
    table.items.length = 0

    const url = '/api/subject'
    const { body: pagedList } = await apiCall.get(url, null, null)
    if (pagedList) {
        page.total = pagedList.total
        page.current = pagedList.offset + 1
        table.items = pagedList.list
        table.items.forEach((item: any) => {
            item.backendApiCount = item.backendApiList?.length
        })
        ascendArray(table.items, 'id')
        setSequence(table.items, (page.current - 1) * page.count + 1)
    }
}

const saveSetting = async (item: SubjectSetting) => {
    const url = '/api/subject'
    const subject = {
        id: item.id,
        subjectName: item.subjectName,
        instructor: {
            id: user.value?.instructorId
        }
    }
    await apiCall.put(url, null, subject)
    getSubjects()
}

const deleteSetting = async (item: SubjectSetting) => {
    const url = '/api/subject'
    const subject = {
        id: item.id,
        subjectName: item.subjectName,
        instructor: {
            id: user.value?.instructorId
        }
    }
    await apiCall.delete(url, null, subject)
    getSubjects()
}

watch(() => page.current, () => {
    getSubjects()
})

watch(() => page.count, () => {
    page.current = 1
    getSubjects()
})
</script>

<template>
    <PanelCollapse title="교과과정 관리">
        <div class="row">
            <div class="col">
            </div>
            <div class="col-3 d-flex justify-content-end">
                <button class="btn btn-sm btn-primary me-1" @click="getSubjects">검색</button>
            </div>
        </div>
        <ItemsTable refTable="SubjectPane" class="mt-2" :headers="table.headers" :items="table.items"
            @rowSelected="selectSetting">
            <template #body="{ item }">
                <SubjectSettingPane :setting="item" @save="saveSetting" @delete="deleteSetting" />
            </template>
        </ItemsTable>
        <PageNavigator :totalCount="page.total" v-model:current="page.current" v-model:count="page.count" />
    </PanelCollapse>
</template>