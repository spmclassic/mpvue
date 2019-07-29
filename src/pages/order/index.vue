<template>
  <div>
    <div class="myContainer">

      <!-- 最新视频 -->
      <h1 class="myTitle">List</h1>
      <ul class="zt-box zt-box-img" v-for="(item, index) in lists" :index="index" :key="key">
        <li @click="toson(item.id)">
          <span><img :src="item.image" alt="" ></span>
        </li>
        <li>
          <p @click="toson(item.id)" class="mmmmm">{{item.name}}</p>
          <dl class="zt-money gray">
            <dt></dt>
            <dd></dd>
          </dl>
          <dl class="zt-money gray">
            <dt></dt>
            <dd><span>{{item.number}}</span>pc</dd>
          </dl>
          <dl class="zt-money red">
            <dt></dt>
            <dd @click="shanchu(item.id)">Delete</dd>
          </dl>
        </li>
      </ul>

        <div>
            Email：<input v-model="mail" style="border: 1px solid #eee; border-radius: 5rpx; width: 100%;" type="tel">
        </div>
        <div>
            Remark：<textarea v-model="mark" style="border: 1px solid #eee; border-radius: 5rpx; width: 100%;"></textarea>
        </div>

    </div>

    <div class="h130"></div>
    <dl class="weixin">
      <dt>Total：<span>{{numbers}}</span>pc</dt>
      <dd @click="topay">Confirm</dd>
    </dl>

  </div>

</template>

<script>
  import '@/assets/css/style2.css';
  export default {
    data: {
        lists : [],
        numbers:0,
        mail:null,
        mark:null,
    },
    mounted(){
      var _this = this;

      _this.$net.post({
          url: 'basket',
          data:mpvue.getStorageSync('basket')
       }).then(res => {
          _this.lists = res.data;
          _this.numbers = 0;
          for(var i in _this.lists){
              _this.numbers = _this.numbers *1 + _this.lists[i].number*1;
          }

      })
    },
    methods: {
        shanchu(id){
            var basket = mpvue.getStorageSync('basket') || {};
            basket[id] = 0;
            mpvue.setStorageSync('basket', basket)

            var _this = this;

            _this.$net.post({
                url: 'basket',
                data:mpvue.getStorageSync('basket')
            }).then(res => {
                _this.lists = res.data;
                _this.numbers = 0;
                for(var i in _this.lists){
                    _this.numbers = _this.numbers *1 + _this.lists[i].number*1;
                }

            })
            return false;
        },
        toson(id){
            wx.navigateTo({
                url: '/pages/goods/main?id='+id
            });
        },
        topay(){
            var _this = this;

            _this.$net.post({
                url: 'savedata',
                data: {
                    data : mpvue.getStorageSync('basket'),
                    remark : mpvue.getStorageSync('remark'),
                    mail : _this.mail,
                    mark : _this.mark,
                }
            }).then(res => {
                if(!res.status){
                    return wx.showToast({
                        title: res.info,
                        icon: 'none',
                        duration: 2000
                    })
                }

                mpvue.setStorageSync('basket', {});
                mpvue.setStorageSync('remark', {});

                wx.showToast({
                    title: res.info,
                    icon: 'none',
                    duration: 2000
                })

                setTimeout(function () {
                    wx.reLaunch({
                        url: '/pages/index/main'
                    })
                },2000);


            })
        }
    }
  }
</script>
<style>
  .mmmmm{
    min-height: 87rpx;
  }
</style>
