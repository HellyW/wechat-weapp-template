import request from './axios'

const url = {
  config: '/auth/jssdk/config'
}

const getConfig = (uri="") => {
  return new Promise((resolve, reject) => {
    try {
      request.get(url.config, {
        params:{
          uri: uri
        }
      }).then(data => {
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    } catch (err) {
      reject(err)
    }
  })
}

export const wechat = {
  getConfig
}
