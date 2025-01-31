
import { ref, toRaw, toRef } from 'vue'
import { encodeToBase64, decodeFromBase64 } from '@/scripts/utils'

const SESSION_USER = 'skala-quiz-ui'
interface UserSession {
    instructorId: number,
    accountId: string,
    accountName: string,
    accountRole: number,
    subjectIds: number[]
}

const userSession = ref<UserSession | null>(null)

export const accountRole = { none: 0, reader: 1, writer: 2, admin: 3 }

export const useUserSession = () => {
    if (!userSession.value) {
        const storedSession = getStoredUserSession()
        if (storedSession) {
            userSession.value = storedSession
        }
    }
    return toRef(userSession)
}

export const setUserSession = (session: UserSession | any) => {
    userSession.value = session
    localStorage.setItem(SESSION_USER, encodeToBase64(toRaw(userSession.value)))
}

export const updateUserSession = (session: UserSession | any) => {
    if (userSession.value) {
        userSession.value.instructorId = session.instructorId
        userSession.value.accountId = session.accountId
        userSession.value.accountName = session.accountName
        userSession.value.accountRole = session.accountRole
        userSession.value.subjectIds = session.subjectIds
    }
}
export const getStoredUserSession = () => {
    const item = localStorage.getItem(SESSION_USER)
    return item ? decodeFromBase64(item) : null
}

export const clearUserSession = () => {
    userSession.value = null
}

export const isReader = () => {
    if (userSession.value) {
        return userSession.value.accountRole > accountRole.none ? true : false
    }
    else {
        return false
    }
}

export const isWriter = () => {
    if (userSession.value) {
        return userSession.value.accountRole > accountRole.reader ? true : false
    }
    else {
        return false
    }
}

export const isAdmin = () => {
    if (userSession.value) {
        return userSession.value.accountRole > accountRole.writer ? true : false
    }
    else {
        return false
    }
}

