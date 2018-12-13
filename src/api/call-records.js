/* eslint-disable */
import axios from '@/libs/api.request'

export const queryRoomMicRecord = (params,data) => {
  return axios.request({
    url: '/vcapi/queryRoomMicRecord',
    method: 'post',
    params,
    data
  })
}