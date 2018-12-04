/* eslint-disable */
import axios from '@/libs/api.request'

export const queryPrisonSecRole = (params) => {
  return axios.request({
    url: '/vcapi/sec/querySecRole',
    method: 'get',
    params
  })
}

export const saveOrUpdSecRole = (params) => {
  return axios.request({
    url: '/vcapi/sec/saveOrUpdSecRole',
    method: 'get',
    params
  })
}

export const delSecRole = (params) => {
  return axios.request({
    url: '/vcapi/sec/delSecRole',
    method: 'get',
    params
  })
}

export const getTree = (params) => {
  return axios.request({
    url: '/vcapi/sec/secZTree',
    method: 'get',
    params
  })
}

export const saveSecRoleFunction = (params) => {
  return axios.request({
    url: '/vcapi/sec/saveSecRoleFunction',
    method: 'post',
    data:params
  })
}

export const querySecRoleFunctionByRoid = (params) => {
  return axios.request({
    url: '/vcapi/sec/querySecRoleFunctionByRoid',
    method: 'get',
    params
  })
}