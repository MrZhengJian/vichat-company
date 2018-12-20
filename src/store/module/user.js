import { login, getUserInfo, platForm } from '@/api/user'
import { setToken, getToken } from '@/libs/util'
import { loadSysStaticData } from '@/api/user-manage'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    userObj: {},
    userOrg: {},
    funcObj: {},
    userPartyCompany: {},
    sysStaticData: {},
    record: null
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setUserObj (state, obj) {
      state.userObj = obj
    },
    setFuncObj (state, arr) {
      let obj = {}
      for (let i = 0; i < arr.length; i++) {
        obj[arr[i]] = true
      }
      state.funcObj = obj
    },
    setUserOrg (state, obj) {
      state.userOrg = obj
    },
    setUserPartyCompany (state, obj) {
      state.userPartyCompany = obj
    },
    setRecord (state, obj) {
      state.record = obj
    },
    setSysStaticData (state, obj) {
      state.sysStaticData = obj
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, {userName, password, code}) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password,
          code
        }).then(res => {
          if (res) {
            const data = res.data
            if (data.code == 0) {
              commit('setToken', data.obj.access_token)
            }
            resolve(data)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        //   commit('setToken', '')
        //   commit('setAccess', [])
        //   resolve()
        // }).catch(err => {
        //   reject(err)
        // })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        commit('setToken', '')
        commit('setAccess', [])
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(res => {
          const data = res.data
          localStorage.setItem('company_account_uname', data.obj.user.userName)
          localStorage.setItem('company_account_uid', data.obj.user.uid)
          commit('setUserObj', data.obj.user)
          commit('setUserOrg', data.obj.userOrg)
          commit('setUserPartyCompany', data.obj.userPartyCompany)
          commit('setRecord', data.obj.userPartyCompany.record)

          commit('setFuncObj', data.obj.functions)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
        loadSysStaticData().then(res => {
          const data = res.data
          // console.log(data)
          commit('setSysStaticData', data.obj)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
        platForm().then(res => {
          for (let key in res.data.obj) {
            localStorage.setItem(key, res.data.obj[key])
          }
        })
      })
    }
  }
}
