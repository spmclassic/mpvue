const host = 'https://api.spmclassic.com/'

function request (url, method, data = {},sign = true) {
    wx.showLoading({
        title: '加载中' // 数据请求前loading
    })
    return new Promise((resolve, reject) => {
        wx.request({
            url: host + url, // 仅为示例，并非真实的接口地址
            method: method,
            data: data,
            header: {
                'content-type': 'application/json', // 默认值
                'Authorization': 'Bearer '+ mpvue.getStorageSync("token") //读取信息
            },
            success: function (res) {
                if(res.statusCode == 401 && sign){
                    return request ('refresh', 'POST', {},false).then(res => {
                        res.data.access_token && (mpvue.setStorageSync('token', res.data.access_token) || 1) && request (url, method, data,false).then(res => {
                            resolve(res)
                        }).catch((res) => {
                            reject(res);
                        }) || tologin();
                    });
                }
                //判断没有权限做对应的处理
                resolve(res.data)
            },
            fail: function (res) {
                reject(res.data)
            },
            complete: function () {
                wx.hideLoading()
            }
        })
    })
}
function tologin() {
    console.log('令牌时间过期 重新启动小程序');
}

function get (obj) {
    return request(obj.url, 'GET', obj.data)
}

function post (obj) {
    return request(obj.url, 'POST', obj.data)
}

export default {
    request,
    get,
    post,
    host
}