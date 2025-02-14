<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ascendArray, setSequence } from '@/scripts/utils'
import apiCall from '@/scripts/api-call'
import { notifyConfirm, notifySuccess, notifyError } from '@/scripts/store-popups';
import { getTimestamp } from '@/scripts/time-util';
import TooltipBox from '@/components/TooltipBox.vue';
import { SubjectSetting } from './_interfaces'
import QuizCodeModal from './QuizCodeModal.vue';

const props = defineProps<{
    setting: SubjectSetting
}>()

const table = reactive({
    headers: [
        { label: "순번", value: "no" },
        { label: "질문", value: "quizQuestion" },
        { label: "난도", value: "quizDifficulty" },
        { label: "유형", value: "quizType" },
        { label: "선다항(;)", value: "quizOptions" },
        { label: "정답", value: "quizAnswer" },
    ],
    items: [] as any,
})

const getQuizList = async () => {
    table.items.length = 0
    isSetup.value = false

    if (props.setting.id > 0) {
        const url = '/api/quiz/list'
        const queryParams = {
            subjectId: props.setting.id,
        }
        const { body: pagedList } = await apiCall.get(url, null, queryParams)
        if (pagedList) {
            table.items = pagedList.list
            table.items.forEach((item: any) => {
                item.quizOptions = item.quizOptionList?.join('; ')
            })
            ascendArray(table.items, ['systemName', 'menuId'])
            setSequence(table.items, 1)
        }
    }
}

const downloadTemplate = async () => {
    const url = '/api/quiz/excel/template'
    await apiCall.download(url, null, null, `${props.setting.subjectName}-template-${getTimestamp()}`)
}

const fileInput = ref<HTMLInputElement | null>(null)

const openBrowser = () => {
    if (fileInput.value) {
        fileInput.value.value = ''
        fileInput.value.click()
    }
}

const selectFile = async () => {
    const file = fileInput.value?.files?.[0]
    if (file) {
        notifyConfirm('Quiz를 업로드 할까요?', async (confirmed: boolean) => {
            if (confirmed) {
                const url = `/api/quiz/excel/upload?subjectId=${props.setting.id}`
                const response = await apiCall.upload(url, null, file)
                if (response.result === apiCall.Response.SUCCESS) {
                    notifySuccess('Quiz가 업로드 되었어요.')
                    await getQuizList()
                }
            }
        })
    }
}

const downloadExcel = async () => {
    const url = `/api/quiz/excel/download?subjectId=${props.setting.id}`
    await apiCall.download(url, null, null, `${props.setting.subjectName}-quiz-${getTimestamp()}`)
}

const quizOption = reactive({
    high: 3,
    medium: 4,
    low: 3
})

const isSetup = ref(false)
const setupQuiz = async () => {
    table.items.length = 0
    isSetup.value = true
}

const startQuiz = async () => {
    if (quizOption.high * quizOption.medium * quizOption.low < 0) {
        notifyError('출제 난이도 항목을 점검하세요.')
        return
    }
    await clearCacheQuiz()
    await generateQuiz()
}

const quizCodeModal = ref()
const showQuizCodeModal = () => {
    if (quizCodeModal.value) {
        quizCodeModal.value.show()
    }
}

const generateQuiz = async () => {
    const url = '/api/quiz/generate'
    const queryParams = {
        subjectId: props.setting.id,
        high: quizOption.high,
        medium: quizOption.medium,
        low: quizOption.low
    }
    const { body: pagedList } = await apiCall.get(url, null, queryParams)
    if (pagedList) {
        showQuizCodeModal()
    }
}

const clearCacheQuiz = async () => {
    const url = '/api/quiz/clear-cache'
    const queryParams = {
        subjectId: props.setting.id,
    }
    await apiCall.get(url, null, queryParams)
}

onMounted(() => {
    getQuizList()
})

</script>

<template>
    <div class="bg-secondary-subtle m-0 mt-2 p-1">
        <div class="row m-1">
            <div class="col-2 d-flex justify-content-start">
                <h4 class="fw-bold">Quiz 문항</h4>
            </div>
            <div class="col d-flex justify-content-end">
                <TooltipBox tips="템플릿 받기" :no-icon="true">
                    <button class="btn btn-sm btn-outline-primary p-0 px-1 me-1" @click="downloadTemplate">
                        <i class="bi bi-file-earmark-arrow-down file-icon"></i>
                    </button>
                </TooltipBox>
                <TooltipBox tips="엑셀 올리기" :no-icon="true">
                    <input v-show="false" type="file" ref="fileInput" accept=".xlsx" @change="selectFile"
                        multiple="false" />
                    <button class="btn btn-sm btn-outline-primary p-0 px-1 me-1" @click="openBrowser">
                        <i class="bi bi-file-earmark-arrow-up file-icon"></i>
                    </button>
                </TooltipBox>
                <TooltipBox tips="엑셀 받기" :no-icon="true">
                    <button class="btn btn-sm btn-outline-primary p-0 px-1 me-1" @click="downloadExcel">
                        <i class="bi bi-filetype-xlsx file-icon"></i>
                    </button>
                </TooltipBox>
                <button class="btn btn-sm btn-outline-primary me-1" @click="getQuizList">
                    검색
                </button>
                <button class="btn btn-sm btn-secondary" @click="setupQuiz">
                    Quiz 출제
                </button>
            </div>
        </div>
        <template v-if="table.items.length > 0">
            <ItemsTable refTable="QuizList" class="mt-2" :headers="table.headers" :items="table.items"
                :noaddition="true" :nosetting="true">
            </ItemsTable>
        </template>
        <template v-if="isSetup">
            <div class="m-1 p-2 bg-danger-subtle">
                <InlineInput class="m-1" label="난이도(상)" v-model="quizOption.high" type="number" />
                <InlineInput class="m-1" label="난이도(중)" v-model="quizOption.medium" type="number" />
                <InlineInput class="m-1" label="난이도(하)" v-model="quizOption.low" type="number" />
                <div class="d-flex justify-content-end m-2">
                    <button class="btn btn-sm btn-danger me-1" @click="startQuiz">
                        Quiz 시작
                    </button>
                </div>
            </div>
        </template>
        <QuizCodeModal ref="quizCodeModal" :setting="props.setting" />
    </div>
</template>

<style scoped>
.file-icon {
    font-size: 1.5rem;
    color: black;
}
</style>