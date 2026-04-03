import { requestLogin } from './request'

export function getUserBycode(code: string) {
  return requestLogin({
    url: `/getUserByCode/${code}`,
    method: 'get',
  })
}

export function refreshEmpList() {
  return requestLogin({
    url: `/refreshEmpList`,
    method: 'get',
  })
}

export function getCosTempToken() {
  return requestLogin({
    url: `/getCosTempToken`,
    method: 'get',
  })
}
