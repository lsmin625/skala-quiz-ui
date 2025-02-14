<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { SubjectSetting } from './_interfaces'
import QuizList from './QuizList.vue';
import apiCall from '@/scripts/api-call'
import { getTimestamp } from '@/scripts/time-util';

const props = defineProps<{
    setting: SubjectSetting
}>()

const emit = defineEmits(['save', 'delete'])

const watchTargets = reactive({
    subjectName: props.setting.subjectName,
    applicantCount: 0
})

const emitSave = () => {
    const setting = {} as SubjectSetting
    setting.id = props.setting.id || 0
    setting.subjectName = watchTargets.subjectName
    emit('save', setting)
}

const emitDelete = () => {
    const setting = {} as SubjectSetting
    setting.id = props.setting.id || 0
    setting.subjectName = watchTargets.subjectName
    emit('delete', setting)
}


const scoreQuiz = async () => {
    const url = '/api/applicant-quiz/score'
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


const getApplicantCount = async () => {
    watchTargets.applicantCount = 0
    const url = `/api/applicant-quiz/applicant/count?subjectId=${props.setting.id}`
    const { body } = await apiCall.get(url, null, null)
    if (body) {
        watchTargets.applicantCount = body.applicantCount || 0
    }
}

onMounted(async () => {
    await getApplicantCount()
})

</script>

<template>
    <div class="p-1 bg-primary-subtle">
        <div class="row mt-2">
            <div class="col">
                <div class="row">
                    <div class="col">
                        <InlineInput class="mb-1" label="과정명" v-model="watchTargets.subjectName" type="text" />
                    </div>
                    <div class="col">
                        <InlineInput class="mb-1" label="응시자수" v-model="watchTargets.applicantCount" type="text"
                            :disabled="true" />
                    </div>
                </div>
            </div>
            <div class="col-3 d-flex justify-content-end">
                <button class="btn btn-sm btn-primary me-1" @click="emitSave">
                    저장
                </button>
                <button class="btn btn-sm btn-danger me-1" @click="emitDelete">
                    삭제
                </button>
                <button v-if="watchTargets.applicantCount > 0" class="btn btn-sm btn-secondary me-1" @click="scoreQuiz">
                    Quiz 채점
                </button>
                <button v-if="watchTargets.applicantCount > 0" class="btn btn-sm btn-secondary" @click="downloadScore">
                    채점 결과
                </button>
            </div>
        </div>
        <div v-if="props.setting.id > 0" class="row g-2">
            <div class="col">
                <QuizList :setting="props.setting" />
            </div>
        </div>
    </div>
</template>
