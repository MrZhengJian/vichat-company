/* eslint-disable */
import axios from '@/libs/api.request'

export const queryEdposUsers = (params) => {
  return axios.request({
    url: '/vcapi/queryUsers',
    method: 'get',
    params
  })
}

export const batchQueryUsers = (params) => {
  return axios.request({
    url: '/vcapi/batchQueryUsers',
    method: 'get',
    params
  })
}


export const saveEdposUser = (params) => {
  return axios.request({
    url: '/vcapi/saveUser',
    method: 'post',
    params
  })
}

export const deleteEdposUser = (params) => {
  return axios.request({
    url: '/vcapi/deleteUser',
    method: 'post',
    params
  })
}

export const stopUser = (params) => {
  return axios.request({
    url: '/vcapi/stopUser',
    method: 'get',
    params
  })
}

export const startUser = (params) => {
  return axios.request({
    url: '/vcapi/startUser',
    method: 'get',
    params
  })
}

export const batchDeleteUser = (params) => {
  return axios.request({
    url: '/vcapi/batchDelUser',
    method: 'post',
    data:params
  })
}
export const chgEdposUserOrg = (params) => {
  return axios.request({
    url: '/vcapi/batchUpdateUserOrg',
    method: 'post',
    params
  })
}

export const chgUserPassword = (params) => {
  return axios.request({
    url: '/vcapi/updateUserPwd',
    method: 'post',
    params
  })
}

export const imsPush = (params) => {
  return axios.request({
    url: '/vcapi/setLocation',
    method: 'get',
    params
  })
}

export const orgZTree = (params) => {
  return axios.request({
    url: '/vcapi/orgZTree',
    method: 'get',
    params
  })
}

export const loadSysStaticData = (params) => {
  return axios.request({
    url: '/vcapi/loadSysStaticData',
    method: 'get'
  })
}

export const batchUpdateUserRole = (params) => {
  return axios.request({
    url: '/vcapi/batchUpdateUserRole',
    method: 'get',
    params
  })
}

export const batchUpdateUserExpiredDate = (params) => {
  return axios.request({
    url: '/vcapi/batchUpdateUserExpiredDate',
    method: 'get',
    params
  })
}

export const getSecRoleByUid = (params) => {
  return axios.request({
    url: '/vcapi/getSecRoleByUid',
    method: 'get',
    params
  })
}

export const batchCheckUsers = (params) => {
  return axios.request({
    url: 'vcapi/batchCheckUsers',
    method: 'post',
    data:params
  })
}

export const batchSaveUserBasic = (params) => {
  return axios.request({
    url: '/vcapi/batchSaveUserBasic',
    method: 'post',
    data:params
  })
}