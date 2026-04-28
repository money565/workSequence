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

export function getActionTargets() {
  return requestWorkBase({
    url: `/getActionTargets`,
    method: 'get',
  })
}

export function createActionTarget(config: any) {
  return requestWorkBase({
    url: `/createActionTarget`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function deleteActionTarget(t_id: number) {
  return requestWorkBase({
    url: `/deleteActionTarget/${t_id}`,
    method: 'get',
  })
}

export function getActionTargetsWithOutTypes() {
  return requestWorkBase({
    url: `/getActionTargetsWithOutTypes`,
    method: 'get',
  })
}

export function deleteSequenceBySid(s_id: number) {
  return requestWorkBase({
    url: `/deleteSequenceBySid/${s_id}`,
    method: 'get',
  })
}

export function deactivateSequenceBySid(s_id: number) {
  return requestWorkBase({
    url: `/deactivateSequenceBySid/${s_id}`,
    method: 'get',
  })
}

export function getSequenceByTime(p_id: number, start: number) {
  return requestWorkBase({
    url: `/getSequenceByTime/${p_id}/${start}`,
    method: 'get',
  })
}

export function getObjectsTreeTypes() {
  return requestWorkBase({
    url: `/getObjectsTreeTypes`,
    method: 'get',
  })
}

export function getToolsTree() {
  return requestWorkBase({
    url: `/getToolsTree`,
    method: 'get',
  })
}

export function getToolsTreeWithTypes() {
  return requestWorkBase({
    url: `/getToolsTreeWithTypes`,
    method: 'get',
  })
}

export function treeChange(config: any) {
  return requestWorkBase({
    url: `/treeChange`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function getObjectTypesTree() {
  return requestWorkBase({
    url: `/getObjectTypesTree`,
    method: 'get',
  })
}

export function getInspectionItemsWithTypes() {
  return requestWorkBase({
    url: `/getInspectionItemsWithTypes`,
    method: 'get',
  })
}

export function createPlant(config: any) {
  return requestWorkBase({
    url: `/createPlant`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function getPlantKinds() {
  return requestWorkBase({
    url: `/getPlantKinds`,
    method: 'get',
  })
}

export function createPlantKinds(config: any) {
  return requestWorkBase({
    url: `/createPlantKinds`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function getPlantByKind(kid: number) {
  return requestWorkBase({
    url: `/getPlantByKind/${kid}`,
    method: 'get',
  })
}

export function deletePlant(kid: number) {
  return requestWorkBase({
    url: `/deletePlant/${kid}`,
    method: 'get',
  })
}

export function pausePlant(kid: number) {
  return requestWorkBase({
    url: `/pausePlant/${kid}`,
    method: 'get',
  })
}

export function getPlantTree() {
  return requestWorkBase({
    url: `/getPlantTree`,
    method: 'get',
  })
}

export function getSequenceObjToolsTarget(pl_id: number, sid: number) {
  return requestWorkBase({
    url: `/getSequenceObjToolsTarget/${pl_id}/${sid}`,
    method: 'get',
  })
}

export function searchManager(config: any) {
  return requestWorkBase({
    url: `/searchManager`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function createCheckResult(config: any) {
  return requestWorkBase({
    url: `/createCheckResult`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function getCheckResult(pid: number, year: number, month: number, day: number) {
  return requestWorkBase({
    url: `/getCheckResult/${pid}/${year}/${month}/${day}`,
    method: 'get',
  })
}

export function getSequenceByProject(pid: number, today: number) {
  return requestWorkBase({
    url: `/getSequenceByProject/${pid}/${today}`,
    method: 'get',
  })
}

export function getObjectsByPosit(pos_id: number) {
  return requestWorkBase({
    url: `/getObjectsByPosit/${pos_id}`,
    method: 'get',
  })
}

export function getTodaySequencesByProject(pid: number, year: number, month: number, day: number, page: number, perpage: number) {
  return requestWorkBase({
    url: `/getTodaySequencesByProject/${pid}/${year}/${month}/${day}/${page}/${perpage}`,
    method: 'get',
  })
}

export function getStatisticalData(pid: number, year: number, month: number, day: number) {
  return requestWorkBase({
    url: `/getStatisticalData/${pid}/${year}/${month}/${day}`,
    method: 'get',
  })
}

