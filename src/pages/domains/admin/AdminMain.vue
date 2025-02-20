<script setup lang="ts">
import SubjectPane from './components/SubjectPane.vue';
import { useUserSession } from '@/scripts/session';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { validateAndNotify } from '@/scripts/validater'
import apiCall from '@/scripts/api-call'
import { notifySuccess } from '@/scripts/store-popups';

const user = useUserSession()
const router = useRouter()

const oldPassword = ref('')
const newPassword = ref('')
const newPasswordAgain = ref('')

const clearPassword = () => {
  oldPassword.value = ''
  newPassword.value = ''
  newPasswordAgain.value = ''
}

const changePassword = async () => {
  const inputs = [
    { label: '이전 비밀번호', value: oldPassword.value },
    { label: '신규 비밀번호', value: newPassword.value },
    { label: '비밀번호 확인', value: newPasswordAgain.value },
  ]
  if (validateAndNotify(inputs) && newPassword.value === newPasswordAgain.value) {
    const url = '/api/instructor/password'
    const requestBody = {
      accountId: user.value?.accountId,
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    }
    const { result } = await apiCall.post(url, null, requestBody)
    if (result == 0) {
      notifySuccess("비밀번호가 변경되었습니다.");
    }
  }

}

const logout = () => {
  document.cookie = "bff-access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  router.push('/')
}

</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col d-flex justify-content-center">
        <span class="fs-2 fw-bold">SKALA Quiz 관리</span>
      </div>
      <div class="col-2 d-flex justify-content-end">
        <div class="dropdown">
          <button class="btn btn-outline-primary dropdown-toggle m-1" data-bs-toggle="dropdown"
            data-bs-auto-close="outside" @click="clearPassword()">
            <i class="bi bi-person-circle me-1"></i>{{ user?.accountName }}
          </button>
          <div class="dropdown-menu dropdown-menu-end static" style="width: 270px;">
            <div class="d-flex justify-content-center mb-1">
              <label class="col-form-label form-control-sm fw-bold">비밀번호 변경</label>
            </div>
            <div class="d-flex justify-content-start">
              <input class="form-control-sm ms-2" v-model="oldPassword" type="password" style="width: 120px;"
                placeholder="이전 비밀번호" />
            </div>
            <div class="d-flex justify-content-start">
              <input class="form-control-sm m-2" v-model="newPassword" type="password" style="width: 120px;"
                placeholder="신규 비밀번호" />
              <input class="form-control-sm mt-2 mb-2 me-2" v-model="newPasswordAgain" type="password"
                style="width: 120px;" placeholder="비밀번호 확인" />
            </div>
            <div class="d-flex justify-content-center mt-1">
              <button type="submit" class="btn btn-secondary btn-sm me-2" @click="changePassword()">확인</button>
            </div>
          </div>
        </div>
        <button class="btn btn-outline-danger m-1" @click="logout()">
          <i class="bi bi-power"></i>
        </button>
      </div>
    </div>
    <div class="row mt-1 border-0 border-start ">
      <SubjectPane class="bg-success-subtle" />
    </div>
  </div>
</template>