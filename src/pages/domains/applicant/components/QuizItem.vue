<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { QuizQuestion, QuizAnswer, addQuizAnswer } from '@/scripts/store-quiz'

const props = defineProps<{
  index: number,
  setting: QuizQuestion
}>()

interface Option {
  label: string,
  value: any
}

const answer = ref<QuizAnswer>({
  quizId: props.setting.id,
  quizQuestion: `${props.index + 1}. ${props.setting.quizQuestion}`,
  quizAnswer: props.setting.quizQuestion,
  applicantAnswer: ''
})

const options = ref<Option[]>([])

const buildOptions = () => {
  if (props.setting.quizType === 0) {
    props.setting.quizOptionList.forEach((option: string) => {
      options.value.push({
        label: option,
        value: option
      })
    })
  }
}

onMounted(() => {
  buildOptions()
  addQuizAnswer(answer.value)
})

</script>

<template>
  <div class="p-1 bg-secondary-subtle">
    <InlineTextarea class="mt-2 mb-1" v-model="answer.quizQuestion" :disabled="true" />
    <div class="row fw-bold">
      <div class="col ms-3">
        <OptionRadio v-if="props.setting.quizType === 0" :options="options" v-model="answer.applicantAnswer"
          class="mb-1" />
        <InlineInput v-else class="mb-1" v-model="answer.applicantAnswer" type="text" :disabled="false" />
      </div>
    </div>
  </div>
</template>
