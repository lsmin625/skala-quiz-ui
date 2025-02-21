<script setup lang="ts">
import { reactive } from 'vue'
import { ascendArray } from '@/scripts/utils'
import apiCall from '@/scripts/api-call'
import { SubjectSetting } from './_interfaces'
import { getTimestamp } from '@/scripts/time-util'

const props = defineProps<{
    setting: SubjectSetting
}>()

const table = reactive({
    headers: [
        { label: "질문ID", value: "quizId" },
        { label: "질문", value: "quizQuestion" },
        { label: "정답", value: "quizAnswer" },
        { label: "정답수", value: "correctCount" },
        { label: "오답수", value: "incorrectCount" },
    ],
    items: [] as any,
})

const showSummary = async () => {
    table.items.length = 0
    const url = `/api/quiz/report/list?subjectId=${props.setting.id}`
    const { body: list } = await apiCall.get(url, null, null)
    if (list) {
        table.items = list
        ascendArray(table.items, ['correctCount', 'quizId'])
        console.log(table.items)
    }
}

const hideSummary = () => {
    table.items.length = 0
}


const scoreQuiz = async () => {
    const url = '/api/applicant-quiz/score'
    const subject = {
        id: props.setting.id,
        subjectName: props.setting.subjectName,
        instructor: null
    }
    await apiCall.post(url, null, subject)
}

const downloadScore = async () => {
    const url = `/api/applicant-quiz/excel/subject?subjectId=${props.setting.id}`
    await apiCall.download(url, null, null, `${props.setting.subjectName}-score-${getTimestamp()}`)
}

</script>

<template>
    <div class="bg-warning-subtle m-0 mt-2 p-1">
        <div class="row m-1">
            <div class="col-2 d-flex justify-content-start">
                <h4 class="fw-bold">Quiz 응답 현황</h4>
            </div>
            <div class="col d-flex justify-content-end">
                <button class="btn btn-sm btn-outline-danger me-1" @click="scoreQuiz">
                    Quiz 채점
                </button>
                <button v-if="table.items.length === 0" class="btn btn-sm btn-outline-primary me-1"
                    @click="showSummary">
                    보이기
                </button>
                <button v-else class="btn btn-sm btn-outline-primary me-1" @click="hideSummary">
                    숨기기
                </button>
                <button class="btn btn-sm btn-secondary" @click="downloadScore">
                    점수 (XLS)
                </button>
            </div>
        </div>
        <template v-if="table.items.length > 0">
            <ItemsTable refTable="QuizSummary" class="mt-2" :headers="table.headers" :items="table.items"
                :noaddition="true" :nosetting="true">
            </ItemsTable>
        </template>
    </div>
</template>
