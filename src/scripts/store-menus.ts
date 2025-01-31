import { reactive, toRef, toRaw } from "vue";

import sonLte from "@/menus/son-lte";
import son5g from "@/menus/son-5g";
import sonAdmin from "@/menus/son-admin";

import { Router } from "vue-router";

const MAIN_PATH = '/main'

// add all menus to menuGroups
export const menuGroups = [] as MenuGroup[];
menuGroups.push(sonLte as MenuGroup);
menuGroups.push(son5g as MenuGroup);
menuGroups.push(sonAdmin as MenuGroup);

interface Menu {
  menuId: string,
  menuName: string,
  hidden?: boolean,
  path: string,
  component?: any,
  url?: string,
  authLevel?: number
}

interface MenuGroup {
  groupId: string,
  groupName: string,
  menuList: Menu[]
}

const authMenuGroups = reactive<MenuGroup[]>([]);

export const buildAuthMenuGroups = (authMenus: Menu[]) => {
  authMenuGroups.length = 0;

  menuGroups.forEach(menuGroup => {
    const filteredMenuList = menuGroup.menuList.filter((menu: Menu) => {
      if (import.meta.env.MODE === 'dev' && menu.authLevel === -1) {
        // return menus which authLevel equals -1 in development
        return menu;
      }
      const authMenu = authMenus.find((auth: any) => auth.systemId === import.meta.env.VITE_USER_SYSTEM_ID && auth.menuId === menu.menuId);
      menu.authLevel = authMenu?.authLevel || 0;
      return menu && menu.authLevel > 0;
    });

    if (filteredMenuList.length > 0) {
      authMenuGroups.push({ ...menuGroup, menuList: filteredMenuList });
    }
  })
}

export const useAuthMenuGroups = () => {
  return toRef(authMenuGroups)
}

export const getAuthMenuGroups = () => {
  return toRaw(authMenuGroups)
}

export const buildAuthMenuRoutes = (router: Router) => {
  authMenuGroups.forEach((menuGroup: any) => {
    menuGroup.menuList.forEach((menu: Menu) => {
      try {
        const route = {
          path: menu.path,
          name: menu.path,
          component: menu.component || null
        }
        router.addRoute(MAIN_PATH, route)
      }
      catch (error) {
        console.error(`Failed to add route for ${menu.path}:`, error);
      }
    });
  })
}

export const getAllAuthMenus = () => {
  const allAuthMenus = [] as Menu[]

  menuGroups.forEach(menuGroup => {
    menuGroup.menuList.forEach(menu => {
      allAuthMenus.push({ ...menu, authLevel: 3 })
    })
  });

  return allAuthMenus;
}

const currentMenu = reactive({
  groupId: '',
  groupName: '',
  menuId: '',
  menuName: '',
  hidden: false,
  path: '',
  url: '',
  authLevel: 0
})

export const setCurrentMenu = (menuGroup: MenuGroup, menu: Menu) => {
  currentMenu.groupId = menuGroup.groupId
  currentMenu.groupName = menuGroup.groupName
  currentMenu.menuId = menu.menuId
  currentMenu.menuName = menu.menuName
  currentMenu.hidden = menu.hidden || false
  currentMenu.path = menu.path
  currentMenu.url = menu.url || ''
  currentMenu.authLevel = menu.authLevel || 0
}

export const getCurrentMenu = () => {
  return currentMenu
}