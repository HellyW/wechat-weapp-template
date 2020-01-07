<style lang='less' scoped>
  
</style>
<template>
  <div class="index-container">
    
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
    }
  },
  mounted(){
    let self = this
    this.$wx.ready(()=>{
      // 当前页面JSSDK配置
      console.log('[page] wechat jssdk is ready')
      self.demo()
    })
    this.$wx.error(function(res){
      console.log(`[page] wechat jssdk init is error [${res}]`)
    })
  },
  methods: {
    demo(){
      this.$wx.getLocation({
        type: 'wgs84', 
        success: function (res) {
          console.log(res)
        }
      })
    }
  }
}
</script>