const express = require('express')
const crypto = require('crypto')
const request = require('request')
const wechatRouter = express.Router()
const jssdk = require('./jssdk')
const CONFIG = require('../../config')

const checkSignature = (query) => {
  var arr = [CONFIG.TOKEN, query.timestamp, query.nonce].sort()
  return crypto.createHash('sha1').update(arr.join('')).digest('hex') === query.signature
}





wechatRouter.get('/wechat',(req,res)=>{
  try{
    let getData = req.query || {}
    if(checkSignature(getData)) return res.send(getData.echostr)
    res.send('init error')
  }catch(err){
    return res.send(err)
  }
})


wechatRouter.post('/wechat',(req,res,next)=>{
  try{
    const data = req.body || {}
    req.wechat = (data&&data.xml)||{}
    // 接收普通消息
    return next()
  }catch(err){
    return res.send()
  }
})


wechatRouter.get('/jssdk/config',(req,res)=>{
  try{
    if(!req.query.uri) throw 'uri is empty'
    jssdk.getConfig(req.query.uri).then(config=>{
      res.json(config)
    }).catch(err=>{
      return res.json({"errcode":1,"errmsg":err})
    })
  }catch(err){
    return res.json({"errcode":2,"errmsg":err})
  }
})

// 获取openid
wechatRouter.get('/',(req,res,next)=>{
  try{
    if(req.openid) return next()
    const queryData = req.query || {}
    const fullURL =  `${req.protocol}://${req.get('host')}${CONFIG.nginxPath}${req.originalUrl}`
    if(!queryData.code) return res.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${CONFIG.APPID}&redirect_uri=${decodeURIComponent(fullURL)}&response_type=code&scope=snsapi_base&state=${fullURL.split('#')[1]||""}#wechat_redirect`)
    request.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${CONFIG.APPID}&secret=${CONFIG.APPSERECT}&code=${queryData.code}&grant_type=authorization_code`,{},(error,response,data)=>{
      if(error) return res.send(err)
      if(typeof data === 'string') data = JSON.parse(data) || {}
      if(data.errcode) return res.send(data.errmsg)
      req.openid = data.openid
      next()
    })
    }catch(err){
    return res.send(err)
  }
})





module.exports = wechatRouter