<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useQuizAnswerList, storeQuizAnswerList } from '@/scripts/store-quiz'

const quizAnswerList = useQuizAnswerList()

const score = ref(0)

onMounted(() => {
  storeQuizAnswerList([])

  score.value = 0
  quizAnswerList.value.forEach(quizAnswer => {
    score.value += quizAnswer.applicantScore
  })

  if (score.value === 0) {
    window.close()
  }
})

</script>

<template>
  <div class="container mt-5 d-flex flex-column">
    <div v-if="score > 0" class="fs-2 text-center">
      {{ score }}점! 수고 하셨습니다.
      <i class="bi bi-emoji-laughing"></i>
    </div>
    <div v-else class="fs-2 text-center">
      수고 하셨습니다.
      <i class="bi bi-emoji-laughing"></i>
    </div>
  </div>
</template>
