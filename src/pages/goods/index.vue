<template>
  <div class="myContainer" style=" margin: 10rpx;">
    <div style=" display: block; overflow: hidden; text-align: center;">
      <img :src="image" style=" margin: 0 auto; display: block" mode="widthFix"/>
    </div>
    <ul>
      <li><span>Description：</span>{{name}}</li>
      <li v-for="(item, index) in attr" :index="index" :key="key"><span>{{item.name}}：</span>{{intro["'"+item.id+"'"]}}</li>
      <li><textarea v-model="remark" style="border: 1px solid #eee; margin: 0 auto; border-radius: 5rpx; width: 90%;" placeholder="Remark"></textarea></li>
    </ul>

    <div style="margin-top: 40rpx;">
      <input type="number" v-model="number" placeholder="QTY" style="margin-bottom: 10rpx; border: 1px solid #ccc;border-radius: 8rpx; text-align: center; width: 300rpx; margin: 0 auto;" />
      <div style="height: 5rpx;"></div>
      <button style="margin: 10rpx auto; width: 150rpx; font-size: 30rpx; height: 80rpx; line-height: 80rpx;" @click="ininin">+Add to Cart</button>
    </div>
  </div>
</template>
<style scoped>
  li{
    margin: 20rpx 0;
  }

  li span{
    display: inline-block;
    width:250rpx;
    text-align: right;
  }
</style>
<script>
    import '@/assets/css/style.css';
    export default {
        data: {
            id: 0,
            image: null,
            name: null,
            attr: null,
            intro: null,
            remark: null,
            number:null
        },
        mounted(){
            var _this = this;

            this.id = this.getQuery().id;//接收这个参数 jq mpvue接收的方式不一样

            var remark = mpvue.getStorageSync('remark') || {};
            this.remark = remark[this.id] || '';

            var basket = mpvue.getStorageSync('basket') || {};
            this.number = basket[this.id] || '';

            _this.$net.post({
                url: 'goods/'+_this.id,
                data: {}
            }).then(res => {
                _this.image = res.data.image;
                _this.name = res.data.name;
                _this.attr = res.data.attr;
                _this.intro = res.data.intro;
            })

        },
        methods: {
            getQuery() {
                /* 获取当前路由栈数组 */
                const pages = getCurrentPages()
                const currentPage = pages[pages.length - 1]
                const options = currentPage.options
                return options
            },
            ininin(){

                var basket = mpvue.getStorageSync('basket') || {};
                basket[this.id] = this.number;
                mpvue.setStorageSync('basket', basket)

                var remark = mpvue.getStorageSync('remark') || {};
                remark[this.id] = this.remark;
                mpvue.setStorageSync('remark', remark)
                wx.reLaunch({
                    url: '/pages/index/main'
                })
            }
        }
    }
</script>