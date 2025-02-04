<script setup lang="ts">
import { reactive, onMounted, ref, watch } from 'vue'
import apiCall from '@/scripts/api-call'
import { validateAndNotify, isEmpty } from '@/scripts/validater'
import { setUserSession, getStoredUserSession } from '@/scripts/session'
import { notifyError } from '@/scripts/store-popups'
import { useRoute, useRouter } from 'vue-router';
import QuizItem from './components/QuizItem.vue'

const subjectName = ref('')

const applicant = reactive({
  id: 0,
  subjectId: 0,
  applicantId: "",
  applicantName: "",
  startTime: null,
  finishTime: null,
  applicantScore: 0,
  quizAnswerList: []
})

const router = useRouter()
const route = useRoute()

onMounted(() => {
  if (route.query.subjectId) {
    subjectName.value = String(route.query.subjectName)
    applicant.subjectId = Number(route.query.subjectId)
    generateQuiz()
  }
})

const table = reactive({
  items: [] as any
})

const generateQuiz = async () => {
  const url = '/api/quiz/generate'
  const queryParams = {
    subjectId: applicant.subjectId,
    high: 0,
    medium: 0,
    low: 0
  }

  const { body: pagedList } = await apiCall.get(url, null, queryParams)
  if (pagedList) {
    table.items = pagedList.list
  }
}

const isStarted = ref(false)

const startQuiz = () => {
  isStarted.value = true
}

const finishQuiz = () => {
  isStarted.value = false
  router.push('/quiz-bye')
}

</script>

<template>
  <div class="container-sm mt-3 border border-3 p-1" style="max-width: 600px">
    <div v-if="!isStarted">
      <div class="bg-info-subtle p-2 m-1">
        <h2 class="text-center fw-bold m-3">Quiz : {{ subjectName }}</h2>
        <InlineInput class="mb-2" label="ID" v-model="applicant.applicantId" type="text" placeholder="S000" />
        <InlineInput class="mb-2" label="이름" v-model="applicant.applicantName" type="text" placeholder="교육생 이름" />
        <div class="d-flex justify-content-end">
          <button class="btn btn-primary btn-sm" @click="startQuiz"
            :disabled="!(applicant.applicantId && applicant.applicantName)">응시</button>
        </div>
      </div>
    </div>
    <div v-else>
      <template v-for="(item, index) in table.items" :key="index">
        <QuizItem :index="index" :setting="item" />
      </template>
      <div class="d-flex justify-content-end mt-2">
        <button class="btn btn-primary btn-sm" @click="finishQuiz">제출</button>
      </div>
    </div>
  </div>
</template>
