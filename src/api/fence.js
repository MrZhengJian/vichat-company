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
