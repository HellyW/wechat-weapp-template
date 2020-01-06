let _ret_msg = function (status=0,data={},errMsg="成功") {
  return {
    'ret':status,
    'data':data,
    'errMsg':errMsg.message || errMsg
  }
}

module.exports = {
  OK : function (data,err) {
    return _ret_msg(0,data,err)
  },
  ERR : function (data,err,code=201) {
    return _ret_msg(code,data,err)
  }
}