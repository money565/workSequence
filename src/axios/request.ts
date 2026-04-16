import type { AxiosInstance } from 'axios'
import { useUserStore } from '@/stores/counter'
import axios from 'axios'
import { baseURL, HWURL, loginURL, workBaseURL } from '../webConfig'
// import { Base64 } from "js-base64"

export const request = axios.create({
  baseURL,
  responseType: 'json',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
  },
  timeout: 30000,
})

export const requestWorkBase = axios.create({
  baseURL: workBaseURL,
  responseType: 'json',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
  },
  timeout: 30000,
})

export const requestLogin = axios.create({
  baseURL: loginURL,
  responseType: 'json',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
  },
  timeout: 300000,
})

export const requestHW = axios.create({
  baseURL: HWURL,
  responseType: 'json',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
  },
  timeout: 30000,
})

function setupInterceptors(instance: AxiosInstance) {
  instance.interceptors.response.use((res) => {
    const user = useUserStore()
    const status = res.data.code || 200
    const message = res.data.msg || '未知错误'
    // eslint-disable-next-line eqeqeq
    if (status != 200) {
      return Promise.reject(message)
    }
    if (status === 401) {
    // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('无权登录')
    }
    if (user.userInfo.token === '' || user.userInfo.token === null) {
      user.loginReady = false
    }
    else {
      user.loginReady = true
    }

    return res
  }, (error) => {
    const user = useUserStore()
    user.loginReady = false
    if (error && error.response && error.response.data && error.response.data.data) {
      user.logout().then(() => {
        user.login().then(() => {
          user.loginReady = true
        })
      })
    }
    else {
    // eslint-disable-next-line no-alert
      alert(error)
      return Promise.reject(new Error(error))
    }
  })

  instance.interceptors.request.use((config) => {
    const user = useUserStore()
    config.headers.Authorization = `Bearer ${user.userInfo.token}`
    config.headers.DDingID = user.userInfo.userid
    return config
  }, (error) => {
    return Promise.reject(new Error(error))
  })
}

const requestList: AxiosInstance[] = [request, requestWorkBase]
for (const i in requestList) {
  setupInterceptors(requestList[i])
}
