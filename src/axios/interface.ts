import { request } from './request'

export function authentication(config: any) {
  return request({
    url: `/authentication`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function getProjectList() {
  return request({
    url: `/getProjectList`,
    method: 'get',
  })
}