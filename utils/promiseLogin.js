import {request} from './request'
let resultData = {
  session_key: null,
  openid: null
}
const getOpenId = (code) => {
  return request({ url: '/o2o/miniProgram/code2Session', data: { code } }).then(res => {
    const {openid, session_key} = JSON.parse(res.data.data)
    return resultData = { openid, session_key }
  })
}
export const asyncLogin = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        getOpenId(res.code).then(res => resolve(resultData))
      },
      complete: (res) => {},
      error(err){
        reject(err)
      }
    })
  })
}

export const getUserMsg = () =>{}
