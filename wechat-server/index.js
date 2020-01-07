const express = require('express')
const CONFIG = require('./config')

const app = express()

app.listen(8081,()=>{
  console.log("server start on 8081")
})


app.use('/api', require('./apis'))

app.use('/auth', require('./auth'))

app.get('/', (req, res) => {
  try {
    if (!req.query.openid) return res.redirect(`${CONFIG.nginxPath}/auth?url=` + decodeURIComponent(`${req.protocol}://${req.get('host')}${CONFIG.nginxPath}${req.originalUrl}`))
    res.redirect(`${CONFIG.page}${CONFIG.page.indexOf('?')===-1?'?':'&'}openid=${req.query.openid}&st=${new Date().getTime()}`)
  } catch (err) {
    res.send(err)
  }
})