export default {
  groupId: "son-lte",
  groupName: "LTE 기지국",
  menuList: [
    {
      menuId: "/son/lte",
      menuName: "SS기지국 e-PLDM(enhanced-PLD Mgmt)",
      path: "/son/lte/samsung/EpldManagement",
      component: () => import('@/pages/domains/lte/samsung/LteSamsung.vue')
    },
    {
      menuId: "/son/lte",
      menuName: "SS기지국 BTAL-HO 조회",
      path: "/son/lte/samsung/BtalHandover",
      component: () => import('@/pages/domains/lte/samsung/BtalHandover.vue')
    },
    {
      menuId: "/son/lte",
      menuName: "Ericsson기지국 공동망 파라미터",
      path: "/son/lte/ericsson/EpldManagement",
      component: () => import('@/pages/domains/lte/ericsson/EpldManagement.vue')
    },
    {
      menuId: "/son/lte",
      menuName: "Nokia기지국 공동망 파라미터",
      path: "/son/lte/nokia/EpldManagement",
      component: () => import('@/pages/domains/lte/nokia/EpldManagement.vue')
    }
  ]
}