import { createRouter, createWebHistory } from 'vue-router';
import LoginMain from '@/pages/domains/login/LoginMain.vue'
import LogoutMain from '@/pages/domains/login/LogoutMain.vue'
import AdminMain from '@/pages/domains/admin/AdminMain.vue'
import ApplicantMain from '@/pages/domains/applicant/ApplicantMain.vue'
import ApplicantBye from '@/pages/domains/applicant/ApplicantBye.vue'
import WrongRoutingPage from './components/WrongRoutingPage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: '/',
            component: LoginMain
        },
        {
            path: '/login',
            name: '/login',
            component: LoginMain
        },
        {
            path: '/logout',
            name: '/logout',
            component: LogoutMain
        },
        {
            path: '/main',
            name: '/main',
            component: AdminMain,
            children: [],
        },
        {
            path: '/quiz',
            name: '/quiz',
            component: ApplicantMain,
        },
        {
            path: '/quiz-bye',
            name: '/quiz-bye',
            component: ApplicantBye,
        },
        {
            path: '/wrong',
            name: '/wrong',
            component: WrongRoutingPage,
        },
        {
            path: "/:pathMatch(.*)*",
            redirect: "/wrong",
        }
    ]
})

export default router