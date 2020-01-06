const request = require('request')
const crypto = require('crypto')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')
const qs = require('qs')

const CONFIG = require('../../config')

const base = require('./base')


const _getJsapiTicket = ()=>{
  return new Promise((resolve,reject)=>{
    try{
      base.getAccessToken().then(ac=>{
        base.wxRequest.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi',{}).then(data=>{
          data.expires = (new Date().getTime()) + data.expires_in * 1000
          fs.writeFile(path.join(__dirname,'../../jsapiTicket.txt'), JSON.stringify(data), 'utf-8', ()=>{
            resolve(data.ticket)
          })
        }).catch(err=>{
          reject(err)
        })
      }).catch(err=>{
        reject(err)
      })
    }catch(err){
      reject(err)
    }
  })
}

const getJsapiTicket = ()=>{
  // get jsapiTicket 
  return new Promise((resolve,reject)=>{
    try{
      if(!fs.existsSync(path.join(__dirname,'../../jsapiTicket.txt'))){
        fs.writeFileSync(path.join(__dirname,'../../jsapiTicket.txt'), '', 'utf-8');
      }

      fs.readFile(path.join(__dirname,'../../jsapiTicket.txt'), 'utf-8', (err,data)=>{
        if(err){
          return reject(err)
        }
        if(data===''){
          // refresh jsapiTicket
          return _getJsapiTicket().then(_jst=>{
            resolve(_jst)
          }).catch(err=>{
            reject(err)
          })
        }
        // format data
        if(typeof data === 'string') data = JSON.parse(data)
        // check jsapiTicket valida
        const _dt = new Date().getTime()
        if(data.expires <= _dt){
          // Invalid
          // refresh jsapiTicket
          return _getJsapiTicket().then(_jst=>{
            resolve(_jst)
          }).catch(err=>{
            reject(err)
          })
        }
        return resolve(data.ticket)
      })
    }catch(err){
      reject(err)
    }
  })
}



const getConfig = (uri)=>{
  return new Promise((resolve,reject)=>{
    try{
      getJsapiTicket().then(_jst=>{
        let _initData = {
          jsapi_ticket:_jst,
          noncestr:uuid.v1().replace(/-/g,''),
          timestamp:Math.round(new Date().getTime()/1000) ,
          url:uri
        }
        let _signature = crypto.createHash('sha1').update(decodeURIComponent(qs.stringify(_initData))).digest('hex')
        resolve({
          appId: CONFIG.APPID,
          timestamp: _initData.timestamp,
          nonceStr: _initData.noncestr,
          signature: _signature
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
  getConfig
}