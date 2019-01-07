/* eslint-disable */
import axios from '@/libs/api.request'

export const queryFence = (params,data) => {
  return axios.request({
    url: '/vcapi/fence/queryFence',
    method: 'post',
    params,
    data
  })
}

export const queryFenceUser = (params,data) => {
  return axios.request({
    url: '/vcapi/fence/queryFenceUser',
    method: 'post',
    params,
    data
  })
}

export const createFence = (data) => {
  return axios.request({
    url: '/vcapi/fence/createFence',
    method: 'post',
    data
  })
}

export const saveFence = (params,data) => {
  return axios.request({
    url: '/vcapi/fence/saveFence',
    method: 'post',
    params,
    data
  })
}
export const saveFenceUser = (params,data) => {
  return axios.request({
    url: '/vcapi/fence/saveFenceUser',
    method: 'post',
    params,
    data
  })
}
export const saveFenceRole = (params,data) => {
  return axios.request({
    url: '/vcapi/fence/saveFenceRole',
    method: 'post',
    params,
    data
  })
}
