<script setup lang="ts">
import { ref, computed, onBeforeUnmount, reactive } from "vue";
import QRCode from "qrcode";
import { getDate, getTimestamp } from '@/scripts/time-util';
import { SubjectSetting } from './_interfaces'
import apiCall from '@/scripts/api-call'
import { notifyError } from "@/scripts/store-popups";

// const BASE_URL = "http://localhost:5173/quiz";
// const BASE_URL = "https://smlee1-skala-pro-sk25a-prop5173nprofessor.remote.amdp.skala-ai.com/quiz";
const BASE_URL = import.meta.env.VITE_QUIZ_BASE_URL

const props = defineProps<{
  setting: SubjectSetting
}>()

const emit = defineEmits(["closed"]);

const quizCodeButton = ref<HTMLButtonElement | null>(null);
const qr = reactive({
  size: 3,
  url: ''
});

const canvasSize = computed(() => `canvas-${qr.size}`);

const show = () => {
  if (!document.getElementById("quizCode")?.classList.contains("show")) {
    quizCodeButton.value?.click();
    qr.url = `${BASE_URL}?subjectId=${props.setting.id}&subjectName=${props.setting.subjectName}&timestamp=${getTimestamp()}`;
    QRCode.toCanvas(document.getElementById("canvas"), qr.url, { errorCorrectionLevel: "L" });
  }
};

const finishQuiz = async () => {
  const url = '/api/applicant-quiz/unfinished'
  const queryString = {
    subjectId: props.setting.id,
    date: getDate(null, ''),
  }
  const { body } = await apiCall.get(url, null, queryString)
  if (body.unfinishedCount > 0) {
    notifyError(`${body.unfinishedCount}명이 미제출 상태입니다.`)
  } else {
    hide()
  }
}

const hide = () => {
  if (document.getElementById("quizCode")?.classList.contains("show")) {
    quizCodeButton.value?.click();
  }
};

onBeforeUnmount(() => {
  hide();
});

defineExpose({
  show
})
</script>

<template>
  <button v-show="false" ref="quizCodeButton" type="button" data-bs-toggle="modal" data-bs-target="#quizCode">
    toggle
  </button>
  <div class="modal fade" ref="quizCode" id="quizCode" tabindex="-1">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header">
          <div class="container d-flex justify-content-center mt-2">
            <p class="fs-1 fw-bold">Quiz 타임 : {{ props.setting.subjectName }} </p>
          </div>
        </div>
        <div class="modal-body">
          <div class="row mt-0">
            <div class="col border-end">
              <div class="d-flex justify-content-center">
                <canvas id="canvas" :class="canvasSize"></canvas>
              </div>
              <div class="d-flex justify-content-center mt-2">
                <p class="fs-4">
                  <a :href="qr.url" target="_blank">사이트</a> 접속 후
                  <b class="text-primary">ID/이름</b>을 입력하고
                  <b class="text-primary">Quiz</b>를 풀어주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="row modal-footer">
          <div class="col">
            <label>QR 사이즈</label>
            <input type="range" v-model="qr.size" class="form-range" min="1" max="5" step="1">
          </div>
          <div class="col-4 d-flex justify-content-end">
            <button type="button" class="btn btn-primary me-2" @click="finishQuiz">Quiz 종료
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.canvas-1 {
  width: 30vh !important;
  height: 30vh !important;
}

.canvas-2 {
  width: 40vh !important;
  height: 40vh !important;
}

.canvas-3 {
  width: 50vh !important;
  height: 50vh !important;
}

.canvas-4 {
  width: 60vh !important;
  height: 60vh !important;
}

.canvas-5 {
  width: 70vh !important;
  height: 70vh !important;
}
</style>