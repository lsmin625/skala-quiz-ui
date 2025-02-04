import { ref, toRaw, toRef } from 'vue'
import { encodeToBase64, decodeFromBase64 } from '@/scripts/utils'

const QUIZ_QUESTION = 'skala-quiz-question'
const QUIZ_ANSWER = 'skala-quiz-answer'

export interface QuizQuestion {
    id: number,
    quizQuestion: string,
    quizDifficulty: number,
    quizType: number,
    quizAnswer: string,
    quizScore: number,
    quizOptionList: string[]
}

export interface QuizAnswer {
    quizId: number,
    quizQuestion: string,
    quizAnswer: string,
    applicantAnswer: string
}

const quizQuestionList = ref<QuizQuestion[]>([])

export const useQuizQuestionList = () => {
    if (!quizQuestionList.value) {
        const data = getStoredQuizQuestions()
        if (data) {
            quizQuestionList.value = data
        }
    }
    return toRef(quizQuestionList)
}

export const storeQuizQuestionList = (questions: QuizQuestion[]) => {
    quizQuestionList.value = questions
    localStorage.setItem(QUIZ_QUESTION, encodeToBase64(toRaw(quizQuestionList.value)))
}

const getStoredQuizQuestions = () => {
    const item = localStorage.getItem(QUIZ_QUESTION)
    return item ? decodeFromBase64(item) : null
}

const quizAnswerList = ref<QuizAnswer[]>([])

export const useQuizAnswerList = () => {
    if (!quizAnswerList.value) {
        const data = getStoredQuizAnswers()
        if (data) {
            quizAnswerList.value = data
        }
    }
    return toRef(quizAnswerList.value)
}

export const addQuizAnswer = (answer: QuizAnswer) => {
    quizAnswerList.value.push(toRaw(answer))
}

export const storeQuizAnswerList = (answers: QuizAnswer[]) => {
    quizAnswerList.value = answers
    localStorage.setItem(QUIZ_ANSWER, encodeToBase64(toRaw(quizAnswerList.value)))
}

const getStoredQuizAnswers = () => {
    const item = localStorage.getItem(QUIZ_ANSWER)
    return item ? decodeFromBase64(item) : null
}
