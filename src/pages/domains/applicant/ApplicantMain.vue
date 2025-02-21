<script setup lang="ts">
import { reactive, onMounted, ref, toRaw } from 'vue'
import apiCall from '@/scripts/api-call'
import { notifyError, notifyConfirm } from '@/scripts/store-popups'
import { useRoute, useRouter } from 'vue-router'
import QuizItem from './components/QuizItem.vue'
import { storeQuizQuestionList, useQuizQuestionList, storeQuizAnswerList, useQuizAnswerList } from '@/scripts/store-quiz'

const ITEM_KEY = 'skala-quiz-applicant'

const applicant = reactive({
  subjectId: 0,
  subjectName: '',
  applicantId: '',
  applicantName: '',
})

const router = useRouter()
const route = useRoute()

const isStarted = ref(false)

onMounted(async () => {
  if (route.query.subjectId) {
    applicant.subjectId = Number(route.query.subjectId)
    applicant.subjectName = String(route.query.subjectName)

    await generateQuiz()
    restoreApplicant()
  }
})

const restoreApplicant = () => {
  const item = localStorage.getItem(ITEM_KEY)
  if (item) {
    const json = JSON.parse(item)
    applicant.applicantId = json.applicantId
    applicant.applicantName = json.applicantName
  }
}

const quizQuestionList = useQuizQuestionList()

const quizAnswerList = useQuizAnswerList()

const generateQuiz = async () => {
  isStarted.value = false

  const url = '/api/quiz/generate'
  const queryParams = {
    subjectId: applicant.subjectId,
    high: 0,
    medium: 0,
    low: 0
  }

  const { body: pagedList } = await apiCall.get(url, null, queryParams)
  if (pagedList) {
    storeQuizQuestionList(pagedList.list)
  }
}

const startQuiz = async () => {
  const regex = /^S(00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})$/;
  if (!regex.test(applicant.applicantId)) {
    notifyError('ID를 정확하게 입력하세요.')
    return
  }

  const item = {
    applicantId: applicant.applicantId,
    applicantName: applicant.applicantName
  }
  localStorage.setItem(ITEM_KEY, JSON.stringify(item))

  const url = '/api//applicant-quiz/start'
  const requestBody = getRequestBody()
  await apiCall.post(url, null, requestBody)

  isStarted.value = true
}

const finishQuiz = () => {
  if (!quizAnswerList.value.every(answer => answer.applicantAnswer.trim())) {
    notifyError('모든 문항에 답변을 입력해주세요.')
    return
  }

  notifyConfirm('답안을 제출 하시겠습니까?', async (confirmed: boolean) => {
    if (confirmed) {
      const url = '/api//applicant-quiz/submit'
      const requestBody = getRequestBody()
      const { body: pagedList } = await apiCall.post(url, null, requestBody)
      isStarted.value = false
      storeQuizQuestionList([])
      storeQuizAnswerList(pagedList.list)
      router.push('/quiz-bye')
    }
  })
}

const getRequestBody = () => {
  return {
    id: 0,
    subjectId: applicant.subjectId,
    applicantId: applicant.applicantId,
    applicantName: applicant.applicantName,
    startTime: null,
    finishTime: null,
    applicantScore: 0,
    quizAnswerList: toRaw(quizAnswerList.value)
  }
}

</script>

<template>
  <div class="container-sm mt-3 border border-3 p-1" style="max-width: 600px">
    <div v-if="!isStarted">
      <div class="bg-info-subtle p-2 m-1">
        <h2 class="text-center fw-bold m-3">Quiz : {{ applicant.subjectName }}</h2>
        <InlineInput class="mb-2" label="ID" v-model="applicant.applicantId" type="text" placeholder="S000" />
        <InlineInput class="mb-2" label="이름" v-model="applicant.applicantName" type="text" placeholder="교육생 이름" />
        <div class="d-flex justify-content-end">
          <button class="btn btn-primary btn-sm" @click="startQuiz"
            :disabled="!(applicant.applicantId && applicant.applicantName)">응시</button>
        </div>
      </div>
    </div>
    <div v-else>
      <template v-for="(item, index) in quizQuestionList" :key="index">
        <QuizItem :index="index" :setting="item" />
      </template>
      <div class="d-flex justify-content-end mt-2 mb-2 me-1">
        <button class="btn btn-primary" @click="finishQuiz">제출</button>
      </div>
    </div>
  </div>
</template>
