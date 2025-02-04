<script setup lang="ts">
import { reactive, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router';
import apiCall from '@/scripts/api-call'
import { validateAndNotify, isEmpty } from '@/scripts/validater'
import { setUserSession, getStoredUserSession } from '@/scripts/session'
import { notifyError } from '@/scripts/store-popups'

const router = useRouter()

const instructor = reactive({
  id: 0,
  instructorEmail: '',
  instructorName: '',
  instructorPassword: '',
  passwordConfirm: ''
})

const login = async () => {
  const inputs = [
    { label: '이메일', value: instructor.instructorEmail },
    { label: '비밀번호', value: instructor.instructorPassword },
  ]
  if (validateAndNotify(inputs)) {
    const url = '/api/instructor/login'
    const { body: session } = await apiCall.post(url, null, instructor)
    if (session) {
      setUserSession(session)
      router.push('/main')
    }
  }
}

const isSignup = ref(false)
watch(isSignup, (value) => {
  if (value) {
    instructor.id = 0
    instructor.instructorEmail = ''
    instructor.instructorName = ''
    instructor.instructorPassword = ''
    instructor.passwordConfirm = ''
    idChecked.value = false
  }
})

const signup = async () => {
  if (isEmpty(instructor.instructorPassword) || instructor.instructorPassword !== instructor.passwordConfirm) {
    notifyError('비밀번호를 확인하세요.')
    return
  }
  const inputs = [
    { label: '사용자명', value: instructor.instructorName },
    { label: '이메일', value: instructor.instructorEmail },
    { label: '비밀번호', value: instructor.instructorPassword },
  ]
  if (validateAndNotify(inputs)) {
    const url = '/api/instructor'
    const response = await apiCall.post(url, null, instructor)
    if (response.result === apiCall.Response.SUCCESS) {
      isSignup.value = false
      instructor.instructorPassword = ''
    }
  }
}

const idChecked = ref(false)
const checkId = async () => {
  const url = `/api/instructor/check?email=${instructor.instructorEmail}`
  const response = await apiCall.get(url, null, null)
  if (response.result === apiCall.Response.SUCCESS) {
    idChecked.value = true
  }
}

onMounted(() => {
  const session = getStoredUserSession()
  if (session) {
    instructor.instructorEmail = session.accountId
  }
})
</script>

<template>
  <div class="container-sm mt-3 border border-2 p-1" style="max-width: 600px">
    <template v-if="isSignup">
      <p class="fs-2 fw-bold m-0 p-2 bg-secondary text-white">사용자 등록</p>
      <div class="p-3 border bg-primary-subtle" style="max-width: 620px">
        <InlineInput class="mb-2" label="사용자명" v-model="instructor.instructorName" type="text" placeholder="사용자 이름" />
        <div class="row mb-2">
          <div class="col-2 p-0 d-flex justify-content-end">
            <label class="col-form-label form-control-sm p-1">이메일</label>
          </div>
          <div class="col ps-2">
            <InlineInput v-model="instructor.instructorEmail" type="text" placeholder="사용자 이메일" />
          </div>
          <div class="col-1 me-2 pe-1">
            <button v-if="!idChecked" class="btn btn-danger btn-sm" @keydown.enter="checkId" @click="checkId"
              :disabled="isEmpty(instructor.instructorEmail)">
              <i class="bi bi-question-lg"></i>
            </button>
            <button v-else class="btn btn-success btn-sm" :disabled="true">
              <i class="bi bi-exclamation-lg"></i>
            </button>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-2 p-0 d-flex justify-content-end">
            <label class="col-form-label form-control-sm p-1">비밀번호</label>
          </div>
          <div class="col ps-2">
            <InlineInput v-model="instructor.instructorPassword" type="password" placeholder="비밀번호" />
          </div>
          <div class="col ps-2">
            <InlineInput v-model="instructor.passwordConfirm" type="password" placeholder="비밀번호 확인" />
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <i class="bi bi-box-arrow-in-right fs-4 me-3" @click="isSignup = false"></i>
          <button class="btn btn-primary btn-sm" @keydown.enter="signup" @click="signup"
            :disabled="!idChecked">회원가입</button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="bss-background p-1">
        <div class="mt-3" style="height: 220px;"></div>
        <div class="bg-info-subtle p-2 m-1" style="opacity: 90%;">
          <InlineInput class="mb-2" label="이메일" v-model="instructor.instructorEmail" type="text"
            placeholder="사용자 이메일" />
          <InlineInput class="mb-2" label="비밀번호" v-model="instructor.instructorPassword" type="password"
            placeholder="비밀번호" @inputEnterPressed="login" />
          <div class="d-flex justify-content-end">
            <i class="bi bi-person-plus-fill fs-4 me-3" @click="isSignup = true"></i>
            <button class="btn btn-primary btn-sm" @keydown.enter="login" @click="login"
              :disabled="!(instructor.instructorEmail && instructor.instructorPassword)">로그인</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.bss-background {
  width: 590px;
  height: 380px;
  background-image: url('/logo.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>