const request = require('request')
const path = require('path')
const fs = require('fs')
const _ = require('underscore')

const CONFIG = require('../../config')

const _getAccessToken = ()=>{
  // get access_token online
  return new Promise((resolve,reject)=>{
    try{
      request.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${CONFIG.APPID}&secret=${CONFIG.APPSERECT}`,{},(error,response,data)=>{
        if(error) return reject(error)
        if(typeof data === 'string') data = JSON.parse(data)
        if(data.errcode) return reject(data.errmsg)
        data.expires = (new Date().getTime()) + data.expires_in * 1000
        fs.writeFile(path.join(__dirname,'../../accessToken.txt'), JSON.stringify(data), 'utf-8', ()=>{
          resolve(data.access_token)
        }) 
      })
    }catch(err){
      reject(err)
    }
  })
}

const getAccessToken = ()=>{
  // get access_token 
  return new Promise((resolve,reject)=>{
    try{
      if(!fs.existsSync(path.join(__dirname,'../../accessToken.txt'))){
        fs.writeFileSync(path.join(__dirname,'../../accessToken.txt'), '', 'utf-8');
      }
      fs.readFile(path.join(__dirname,'../../accessToken.txt'), 'utf-8', (err,data)=>{
        if(err){
          return reject(err)
        }
        if(data===''){
          // refresh access_token
          return _getAccessToken().then(_ac=>{
            resolve(_ac)
          }).catch(err=>{
            reject(err)
          })
        }
        // format data
        if(typeof data === 'string') data = JSON.parse(data)
        // check accessToken valida
        const _dt = new Date().getTime()
        if(data.expires <= _dt){
          // Invalid
          // refresh access_token
          return _getAccessToken().then(_ac=>{
            resolve(_ac)
          }).catch(err=>{
            reject(err)
          })
        }
        return resolve(data.access_token)
      })
    }catch(err){
      reject(err)
    }
  })
}


const _request = (uri,data={},method='GET')=>{
  return new Promise((resolve,reject)=>{
    try{
      // access_token
      getAccessToken().then(ac=>{
        if(!uri) throw 'uri is empty'
        request({
          method:method,
          form:JSON.stringify(data),
          uri:`${uri}${uri.indexOf("?")===-1?'?':'&'}access_token=${ac}`
        },(error,response,data)=>{
          if(error) return reject(error)
          if(typeof data === 'string' ) data = JSON.parse(data)
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


const wxRequest = {
  post:(url,data={})=>{
    return new Promise((resolve,reject)=>{
      try{
        _request(url,data,'POST').then(data=>{
          resolve(data)
        }).catch(err=>{
          reject(err)
        })
      }catch(err){
        reject(err)
      }
    })
  },
  get:(url,data={})=>{
    return new Promise((resolve,reject)=>{
      try{
        _request(url,data,'GET').then(data=>{
          resolve(data)
        }).catch(err=>{
          reject(err)
        })
      }catch(err){
        reject(err)
      }
    })
  }
}

module.exports = {
  getAccessToken,
  wxRequest
}