const express = require('express')
const auth = express.Router()

auth.use('/', require('../wechat').router, (req, res) => {
  try {
    if (!req.openid) throw 'openid参数丢失'
    if (!req.query.url) throw '未指定定向url'
    res.redirect(`${req.query.url}${req.query.url.indexOf('?') === -1 ? '?' : '&'}openid=${req.openid}&_t=${(new Date().getTime())}`)
  } catch (err) {
    return res.send(err)
  }
})

module.exports = auth
