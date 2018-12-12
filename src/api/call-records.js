/* eslint-disable */
import axios from '@/libs/api.request'

export const queryRoomMicRecord = (params) => {
  return axios.request({
    url: '/vcapi/queryRoomMicRecord',
    method: 'get',
    params
  })
}