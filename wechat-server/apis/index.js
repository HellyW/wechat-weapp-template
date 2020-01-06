const express = require('express')
const api = express.Router()
const retMsg = require('../functions/retMsg')

api.use((req,res)=>{
  return res.json(retMsg.ERR({},'访问不存在'))
})

module.exports = api