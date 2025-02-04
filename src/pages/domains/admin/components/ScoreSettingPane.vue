<script setup lang="ts">
import { reactive } from 'vue'
import { SubjectSetting } from './_interfaces'
import QuizList from './QuizList.vue';

const props = defineProps<{
    setting: SubjectSetting
}>()

const emit = defineEmits(['save', 'delete'])

const watchTargets = reactive({
    subjectName: props.setting.subjectName,
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

</script>

<template>
    <div class="p-1 bg-primary-subtle">
        <div class="row mt-2">
            <div class="col">
                <InlineInput class="mb-1" label="과정명" v-model="watchTargets.subjectName" type="text" />
            </div>
            <div class="col-2 d-flex justify-content-end">
                <button class="btn btn-sm btn-primary me-1" @click="emitSave">
                    저장
                </button>
                <button class="btn btn-sm btn-danger me-1" @click="emitDelete">
                    삭제
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
