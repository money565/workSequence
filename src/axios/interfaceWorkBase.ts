import { requestWorkBase } from './request'

export function getFloor(pid: number) {
  return requestWorkBase({
    url: `/getFloor/${pid}`,
    method: 'get',
  })
}

export function createFloor(config: any) {
  return requestWorkBase({
    url: `/createFloor`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function modifyFloor(config: any) {
  return requestWorkBase({
    url: `/modifyFloor`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function deleteFloor(fid: number) {
  return requestWorkBase({
    url: `/deleteFloor/${fid}`,
    method: 'get',
  })
}

export function getAllPositWithFloor(pid: number) {
  return requestWorkBase({
    url: `/getAllPositWithFloor/${pid}`,
    method: 'get',
  })
}

export function createPosit(config: any) {
  return requestWorkBase({
    url: `/createPosit`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function deletePosit(pos_id: number) {
  return requestWorkBase({
    url: `/deletePosit/${pos_id}`,
    method: 'get',
  })
}

export function getAllObjectsWithFloor(pid: number) {
  return requestWorkBase({
    url: `/getAllObjectsWithFloor/${pid}`,
    method: 'get',
  })
}

export function getObjectsTypes() {
  return requestWorkBase({
    url: `/getObjectsTypes`,
    method: 'get',
  })
}

export function createObject(config: any) {
  return requestWorkBase({
    url: `/createObject`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function deleteObject(obj_id: number) {
  return requestWorkBase({
    url: `/deleteObject/${obj_id}`,
    method: 'get',
  })
}

export function getToolsTypes() {
  return requestWorkBase({
    url: `/getToolsTypes`,
    method: 'get',
  })
}

export function getCurrentTools() {
  return requestWorkBase({
    url: `/getCurrentTools`,
    method: 'get',
  })
}

export function createTools(config: any) {
  return requestWorkBase({
    url: `/createTools`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function getInspectionItems() {
  return requestWorkBase({
    url: `/getInspectionItems`,
    method: 'get',
  })
}

export function getInspectionChoices() {
  return requestWorkBase({
    url: `/getInspectionChoices`,
    method: 'get',
  })
}

export function createInspection(config: any) {
  return requestWorkBase({
    url: `/createInspection`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function getPositWithFloor(fid: number) {
  return requestWorkBase({
    url: `/getPositWithFloor/${fid}`,
    method: 'get',
  })
}

export function getObjsWithPosit(pos_id: number) {
  return requestWorkBase({
    url: `/getObjsWithPosit/${pos_id}`,
    method: 'get',
  })
}

export function getInspectionItemsGroup() {
  return requestWorkBase({
    url: `/getInspectionItemsGroup`,
    method: 'get',
  })
}

export function getEmpByProject(pid: number) {
  return requestWorkBase({
    url: `/getEmpByProject/${pid}`,
    method: 'get',
  })
}

export function createSequence(config: any) {
  return requestWorkBase({
    url: `/createSequence`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function getSequence(pid: number) {
  return requestWorkBase({
    url: `/getSequence/${pid}`,
    method: 'get',
  })
}

export function getAllIcons() {
  return requestWorkBase({
    url: `/getAllIcons`,
    method: 'get',
  })
}

export function createTypeIcon(config: any) {
  return requestWorkBase({
    url: `/createTypeIcon`,
    method: 'post',
    data: {
      ...config,
    },
  })
}
