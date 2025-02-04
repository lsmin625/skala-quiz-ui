<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import apiCall from '@/scripts/api-call'
import { notifyError, notifyConfirm } from '@/scripts/store-popups'
import { useRoute, useRouter } from 'vue-router'
import QuizItem from './components/QuizItem.vue'
import { storeQuizQuestionList, useQuizQuestionList } from '@/scripts/store-quiz'

const ITEM_KEY = 'skala-quiz-applicant'

const applicant = reactive({
  id: 0,
  subjectId: 0,
  subjectName: '',
  applicantId: '',
  applicantName: '',
  startTime: null,
  finishTime: null,
  applicantScore: 0,
  quizAnswerList: [] as any
})

const router = useRouter()
const route = useRoute()

const isStarted = ref(false)

onMounted(() => {
  if (route.query.subjectId) {
    applicant.subjectId = Number(route.query.subjectId)
    applicant.subjectName = String(route.query.subjectName)

    generateQuiz()
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

const startQuiz = () => {
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

  isStarted.value = true
}

const finishQuiz = () => {
  notifyConfirm('답안을 제출 하시겠습니까?', (confirmed: boolean) => {
    if (confirmed) {
      isStarted.value = false
      router.push('/quiz-bye')
    }
  })
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
      <div class="d-flex justify-content-end mt-2">
        <button class="btn btn-primary btn-sm" @click="finishQuiz">제출</button>
      </div>
    </div>
  </div>
</template>
