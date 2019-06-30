<template>
  <div class="bg">
    <button class="authlogin" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" v-if="getusershow"> 获取头像昵称 </button>
    <img class="bgimg" src="/static/images/23.jpg">
    <div class="saoma" @click="qusaonma">
      <img src="/static/images/logo.png">
    </div>

    <div class="mall" @click="qugouwu">
      <img src="/static/images/mine-mall.png"><div class="numbers">{{numbers}}</div>
    </div>
  </div>
</template>

<script>
    import '@/assets/css/style.css';

export default {
  data () {
    return {
        getusershow:true,
        numbers:0,
    }
  },

  components: {

  },
    mounted(){
        var _this = this;

        var basket = mpvue.getStorageSync('basket') || {};
        this.numbers = 0;
        for(var i in basket){
            this.numbers = this.numbers * 1 + basket[i]*1;
        }

        wx.getSetting({
            success: function(res){
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function(res) {
                            console.log(res.userInfo)
                            //用户已经授权过
                            console.log('用户已经授权过')
                            _this.getusershow = false;
                            _this.userInfo = res.userInfo;
                            mpvue.setStorageSync('userInfo', res.userInfo)
                        }
                    })
                }else{
                    console.log('用户还未授权过')
                }
            }
        })
    },
  methods: {
      qusaonma(){
          wx.scanCode({
              success (res) {
                  wx.navigateTo({
                      url: res.result
                  });
              }
          })
      },
      qugouwu(){
          if(!this.numbers){
              return wx.showToast({
                  title: '暂无添加任何商品',
                  icon: 'none',
                  duration: 2000
              })
          }
          wx.navigateTo({
              url: '/pages/order/main'
          });
      },
      bindGetUserInfo(e) {
          var _this = this;

          if (e.mp.detail.rawData){
              //用户按了允许授权按钮
              console.log('用户按了允许授权按钮')
              console.log(e.mp.detail.userInfo);
              this.getusershow = false;
              this.userInfo = e.mp.detail.userInfo;
              mpvue.setStorageSync('userInfo', e.mp.detail.userInfo)

              _this.$net.post({
                  url: 'saveuserinfo',
                  data: e.mp.detail.userInfo
              })

          } else {
              //用户按了拒绝按钮
              console.log('用户按了拒绝按钮')
          }
      },
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style scoped>
.bg{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.bgimg{
  position: absolute;
  width: 100%;
  height: 100%;
}
.saoma{
  position: relative;
  width: 300rpx;
  height: 300rpx;
  margin-left: 50%;
  margin-top: 30%;
  left: -150rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 6rpx solid #ccc;
  background: #ffffff;
  opacity: 0.8;
}
.saoma img{
  width: 70%;
  height: 70%;
  margin: 15%;
}
.mall{
  position: relative;
  width: 100rpx;
  height: 100rpx;
  margin-left: 50%;
  margin-top: 40%;
  left: -50rpx;
  border-radius: 50%;
  opacity: 0.8;
}
.mall img{
  width: 60%;
  height: 60%;
  margin: 20%;
}
</style>
