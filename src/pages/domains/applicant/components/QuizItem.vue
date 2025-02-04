<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'

interface Quiz {
  id: number,
  quizQuestion: string,
  quizDifficulty: number,
  quizType: number,
  quizAnswer: string,
  quizScore: number,
  quizOptionList: string[]
}

const props = defineProps<{
  index: number,
  setting: Quiz
}>()

interface Option {
  label: string,
  value: any
}

const options = ref<Option[]>([])

onMounted(() => {
  if (props.setting.quizType === 0) {
    props.setting.quizOptionList.forEach((option: string) => {
      options.value.push({
        label: option,
        value: option
      })
    })
  }
})

const answer = reactive({
  quizId: props.setting.id,
  quizQuestion: `${props.index + 1}. ${props.setting.quizQuestion}`,
  quizAnswer: props.setting.quizQuestion,
  applicantAnswer: ''
})

</script>

<template>
  <div class="p-1 bg-secondary-subtle">
    <InlineTextarea class="mb-1" v-model="answer.quizQuestion" :disabled="true" />
    <div class="row">
      <div class="col-2">
        <label class="col-form-label form-control-sm">답</label>
      </div>
      <div class="col">
        <OptionRadio v-if="props.setting.quizType === 0" :options="options" v-model="answer.applicantAnswer"
          class="mb-1" />
        <InlineInput v-else class="mb-1" v-model="answer.applicantAnswer" type="text" :disabled="false" />
      </div>
    </div>
  </div>
</template>
