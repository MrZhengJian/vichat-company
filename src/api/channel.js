/* eslint-disable */
import axios from '@/libs/api.request'

export const queryChannels = (params) => {
  return axios.request({
    url: '/vcapi/room/queryRooms',
    method: 'get',
    params
  })
}
export const saveChannel = (params) => {
  return axios.request({
    url: '/vcapi/room/saveRoom',
    method: 'post',
    data:params
  })
}
export const deleteChannel = (params) => {
  console.log(params)
  return axios.request({
    url: '/vcapi/room/deleteRoom',
    method: 'post',
    params
  })
}

export const queryRoomMembers = (params) => {
  return axios.request({
    url: '/vcapi/room/queryRoomMembers',
    method: 'get',
    params
  })
}

export const saveRoomMembers = (params) => {
  return axios.request({
    url: '/vcapi/room/saveRoomMembers',
    method: 'post',
    data:params
  })
}
export const deleteRoomMember = (params) => {
  return axios.request({
    url: '/vcapi/room/deleteRoomMember',
    method: 'post',
    params
  })
}
export const loadRoomCache = (params) => {
  return axios.request({
    url: '/vcapi/room/loadRoomCache',
    method: 'get',
    params
  })
}

export const batchDeleteRoomMember = (params) => {
  return axios.request({
    url: '/vcapi/room/batchDeleteRoomMember',
    method: 'post',
    data:params
  })
}

export const switchRec = (params) => {
  return axios.request({
    url: '/vcapi/switchRec',
    method: 'post',
    params
  })
}

export const setRoomMemberAdminGrade = (params) => {
  return axios.request({
    url: '/vcapi/room/setRoomMemberAdminGrade',
    method: 'get',
    params
  })
}