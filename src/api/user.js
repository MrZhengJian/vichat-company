/* eslint-disable */
import axios from '@/libs/api.request'

export const login = ({ userName, password,code }) => {
  const data = {
    account:userName,
    password:password,
    code:code
  }

  return axios.request({
    url:'/vc/doLogin',
    params: {
      account:userName,
      password:password,
      code:code
    },
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/vcapi/getSession',
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const querySecPrivilege = (token) => {
  return axios.request({
    url: '/vcapi/sec/querySecPrivilege',
    method: 'get'
  })
}

export const platForm = (token) => {
  return axios.request({
    url: '/vc/platform',
    method: 'get'
  })
}
