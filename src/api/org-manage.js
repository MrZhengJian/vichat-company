/* eslint-disable */
import axios from '@/libs/api.request'

export const queryEdposOrgByParentId = (params) => {
  return axios.request({
    url: '/vcapi/queryOrgsByParentId',
    method: 'get',
    params
  })
}
export const saveOrg = (params) => {
  return axios.request({
    url: '/vcapi/saveOrg',
    method: 'post',
    params
  })
}
export const delOrg = (params) => {
  return axios.request({
    url: '/vcapi/delOrg',
    method: 'get',
    params
  })
}
