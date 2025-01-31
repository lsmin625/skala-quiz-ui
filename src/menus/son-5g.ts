export default {
  groupId: "son-5g",
  groupName: "5G 기지국",
  menuList: [
    {
      menuId: "/son/5g",
      menuName: "SS기지국 운용 파라미터 관리",
      path: "/son/5g/samsung/EpldManagement",
      component: () => import('@/pages/domains/5g/samsung/PldManagement.vue')
    },
    {
      menuId: "/son/5g",
      menuName: "Ericsson기지국 운용 파라미터 관리",
      path: "/son/5g/ericsson/EpldManagement",
      component: () => import('@/pages/domains/5g/ericsson/PldManagement.vue')
    }
  ]
}