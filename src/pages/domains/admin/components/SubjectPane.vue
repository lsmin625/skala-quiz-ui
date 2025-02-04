<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ascendArray } from '@/scripts/utils'
import apiCall from '@/scripts/api-call'
import SubjectSettingPane from './SubjectSettingPane.vue'
import { useUserSession } from '@/scripts/session'
import { SubjectSetting } from './_interfaces'
import { notifyConfirm } from '@/scripts/store-popups';

const user = useUserSession()

const table = reactive({
    headers: [
        { label: "과정ID", value: "id" },
        { label: "과정명", value: "subjectName" },
        { label: "강사", value: "accountName" }
    ],
    items: [] as any,
})

const subjectSetting = ref<SubjectSetting>({} as SubjectSetting)
const selectSetting = (item: SubjectSetting) => {
    subjectSetting.value = item
}

const getSubjects = async () => {
    table.items.length = 0

    const url = '/api/subject'
    const { body: pagedList } = await apiCall.get(url, null, null)
    if (pagedList) {
        table.items = pagedList.list
        table.items.forEach((item: any) => {
            item.accountName = user.value?.accountName
        })
        ascendArray(table.items, 'id')
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
    await apiCall.post(url, null, subject)
    getSubjects()
}

const deleteSetting = async (item: SubjectSetting) => {
    notifyConfirm('과목을 삭제 할까요?', async (confirmed: boolean) => {
        if (confirmed) {
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
    })
}

onMounted(() => {
    getSubjects()
})

</script>

<template>
    <PanelCollapse title="과정 Quiz 관리">
        <div class="row">
            <div class="col">
            </div>
            <div class="col-3 d-flex justify-content-end">
                <button class="btn btn-sm btn-primary me-1" @click="getSubjects">조회</button>
            </div>
        </div>
        <ItemsTable refTable="SubjectPane" class="mt-2" :headers="table.headers" :items="table.items"
            @rowSelected="selectSetting">
            <template #header>
                <SubjectSettingPane :setting="subjectSetting" @save="saveSetting" @delete="deleteSetting" />
            </template>
            <template #body="{ item }">
                <SubjectSettingPane :setting="item" @save="saveSetting" @delete="deleteSetting" />
            </template>
        </ItemsTable>
    </PanelCollapse>
</template>