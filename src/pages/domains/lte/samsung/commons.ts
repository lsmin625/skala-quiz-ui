import { reactive, ref, toRef } from 'vue'
import { notifyConfirm } from '@/scripts/store-popups'

export interface PldPara {
  paraName: string,
  paraValue: any,
  selected: boolean
}

export interface PldInfo {
  id: number,
  pldName: string,
  pldParas: string,
  pldParaList: PldPara[],
  selected: boolean
}

export interface PldGroup {
  id: number,
  regionCode: string,
  serviceType: string,
  groupName: string,
  pldList: PldInfo[],
}

export const getPldListWithParaList = (pldList: PldInfo[]) => {
  const list = [] as PldInfo[]
  pldList.forEach(pld => {
    pld.pldParas ? pld.pldParaList = JSON.parse(pld.pldParas) : []
    list.push(pld)
  })
  return list
}

export const getPldListWithParas = (pldList: PldInfo[]) => {
  const list = [] as PldInfo[]
  pldList.forEach(pld => {
    pld.pldParas = pld.pldParaList ? JSON.stringify(pld.pldParaList.filter(para => para.selected)) : '[]'
    list.push(pld)
  })
  return list
}

export const serviceTypes = reactive([
  { label: 'SERVICE', value: 'S' }
])

export const getServiceTypeName = (code: string) => {
  return serviceTypes.find(type => type.value === code)?.label || '';
}

const currentPldGroup = ref<any>(null)

export const setCurrentPldGroup = (pldGroup: PldGroup | null) => {
  currentPldGroup.value = pldGroup
}

export const useCurrentPldGroup = () => {
  return toRef(currentPldGroup)
}

export const isPldInCurrentPldGroup = (pldName: string) => {
  if (currentPldGroup.value && currentPldGroup.value.pldList) {
    return currentPldGroup.value.pldList.find((pld: PldInfo) => pld.pldName === pldName) ? true : false
  }
  return false
}

export const setPldToCurrentPldGroup = (item: PldInfo) => {
  if (currentPldGroup.value) {
    if (!currentPldGroup.value.pldList) {
      currentPldGroup.value.pldList = []
    }
    const index = currentPldGroup.value.pldList.findIndex((pld: PldInfo) => pld.pldName === item.pldName)
    if (index >= 0) {
      if (!item.selected) {
        notifyConfirm(`${currentPldGroup.value.groupName} 그룹에서 ${item.pldName} 항목을 제외 할까요?`, (confirmed: boolean) => {
          confirmed ? currentPldGroup.value.pldList.splice(index, 1) : item.selected = true
        })
      }
    } else {
      if (item.selected) {
        item.pldParaList.forEach(para => para.selected = true)
        currentPldGroup.value.pldList.push({ ...item })
      }
    }
  }
}

export const isPldParaInCurrentPldGroup = (pldName: string, paraName: string) => {
  if (currentPldGroup.value && currentPldGroup.value.pldList) {
    const pld = currentPldGroup.value.pldList.find((pld: PldInfo) => pld.pldName === pldName)
    return pld?.pldParaList.find((para: PldPara) => para.paraName === paraName) ? true : false
  }
  return false
}

export const setPldParaToCurrentPldGroup = (pldName: string, pldPara: PldPara) => {
  if (currentPldGroup.value) {
    const pld = currentPldGroup.value.pldList.find((pld: PldInfo) => pld.pldName === pldName)
    const index = pld.pldParaList.findIndex((para: PldPara) => para.paraName === pldPara.paraName)
    if (index >= 0) {
      pld.pldParaList.splice(index, 1)
    }
    if (pldPara.selected) {
      pld.pldParaList.push({ ...pldPara })
    }
    console.log('setPldParaToCurrentPldGroup', pld)
  }
}