export default {
  groupId: "son-admin",
  groupName: "시스템 관리",
  menuList: [
    {
      menuId: "/admin/user",
      menuName: "사용자 그룹 설정 (e-PLDM)",
      path: "/admin/user/PldUserGroups",
      component: () => import('@/pages/domains/lte/samsung/components/PldUserGroups.vue')
    },
    {
      menuId: "/admin/user",
      menuName: "사용자 권한 관리",
      path: "/admin/user",
      component: () => import('@/pages/domains/admin/AdminMain.vue'),
    },
    {
      menuId: "/admin/status",
      menuName: "시스템 현황 관리",
      path: "/admin/status",
      component: () => import('@/pages/domains/admin/StatusMain.vue'),
    },
    {
      menuId: "/admin/batch",
      menuName: "배치(Batch) 관리",
      path: "/admin/batch",
      component: () => import('@/pages/domains/batch/BatchMain.vue'),
    },
    {
      menuId: "/admin/saga",
      menuName: "분산 트랜잭션 관리",
      path: "/admin/saga",
      component: () => import('@/pages/domains/saga/SagaMain.vue'),
    },
  ]
}