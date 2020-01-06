const request = require('request')
const base = require('./base')


const getUserInfo = (openid)=>{
  return new Promise((resolve,reject)=>{
    try{
      if(!openid) return reject('openid is null')
      base.getAccessToken().then(ac=>{
        request.get(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${ac}&openid=${openid}&lang=zh_CN`,{},(error,response,data)=>{
          if(error) return reject(error)
          if(typeof data === 'string') data = JSON.parse(data)
          if(data.errcode) return reject(data.errmsg)
          resolve(data)
        })
      }).catch(err=>{
        reject(err)
      })
    }catch(err){
      reject(err)
    }
  })
}



module.exports = {
  getUserInfo
}