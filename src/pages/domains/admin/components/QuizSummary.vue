<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ascendArray, setSequence } from '@/scripts/utils'
import apiCall from '@/scripts/api-call'
import { SubjectSetting } from './_interfaces'
import { getDate, getTimestamp } from '@/scripts/time-util'
import { notifyConfirm, notifyInfo } from '@/scripts/store-popups'
import { isEmpty } from '@/scripts/validater'

const props = defineProps<{
    setting: SubjectSetting
}>()

const scoreDate = ref('')

const table = reactive({
    headers: [
        { label: "순번", value: "no" },
        { label: "질문ID", value: "quizId" },
        { label: "질문", value: "quizQuestion" },
        { label: "선택항목", value: "quizOptions" },
        { label: "정답", value: "quizAnswer" },
        { label: "정답수", value: "correctCount" },
        { label: "오답수", value: "incorrectCount" },
    ],
    items: [] as any,
})

const showSummary = async () => {
    table.items.length = 0
    const url = '/api/quiz/report/list'
    const queryString = {
        subjectId: props.setting.id,
        date: scoreDate.value,
    }

    const { body: pagedList } = await apiCall.get(url, null, queryString)
    if (pagedList.total > 0) {
        table.items = pagedList.list
        ascendArray(table.items, ['correctCount', 'quizId'])
        setSequence(table.items, 1)
        console.log(table.items)
    } else {
        notifyInfo("Quiz 채점을 완료 하셨나요?")
    }
}

const hideSummary = () => {
    table.items.length = 0
}
const checkToScoreQuiz = () => {
    if (isEmpty(scoreDate.value)) {
        notifyConfirm('이전 채점 결과를 삭제하고 전체 응시자를 다시 채점 하시겠습니까?', (confirmed: boolean) => {
            if (confirmed) {
                scoreQuiz()
            }
        })
    } else {
        scoreQuiz()
    }
}

const scoreQuiz = async () => {
    const url = `/api/applicant-quiz/score?date=${scoreDate.value}`
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

onMounted(() => {
    scoreDate.value = getDate(null, '')
})
</script>

<template>
    <div class="bg-warning-subtle m-0 mt-2 p-1">
        <div class="row m-1">
            <div class="col-2 d-flex justify-content-start">
                <h5 class="fw-bold pt-2"><i class="bi bi-check-circle fw-bold fs-5 me-2"></i>Quiz 채점 관리</h5>
            </div>
            <div class="col d-flex justify-content-end">
                <InlineInput class="me-1" v-model="scoreDate" type="text" placeholder="출제일(YYYYMMDD)" />
                <button class="btn btn-sm btn-outline-primary me-1" @click="checkToScoreQuiz">
                    Quiz 채점
                </button>
                <button v-if="table.items.length === 0" class="btn btn-sm btn-outline-primary me-1"
                    @click="showSummary">
                    보이기
                </button>
                <button v-else class="btn btn-sm btn-outline-primary me-1" @click="hideSummary">
                    숨기기
                </button>
                <button class="btn btn-sm btn-outline-primary" @click="downloadScore">
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
