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
    if (!req.query.openid) return res.redirect(`/auth?url=` + decodeURIComponent(`${req.protocol}://${req.get('host')}${req.originalUrl}`))
    res.redirect(CONFIG.page)
  } catch (err) {
    res.send(err)
  }
})