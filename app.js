App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    openid:'',
    isGetUserInfo:false,
    isGetOpenid:false

  },
  //获取BBPress话题列表
  getBBTopics: function (agrs) {
    var url = HOST_URI_MINAPPER;
    url += 'forums/' + agrs.forumId + '?page=' + agrs.page + '&per_page=' + agrs.pageCount;
    return API.get(url);
  },

  // 获取BBPress话题详情
  getBBTopicByID: function (id) {
    var url = HOST_URI_MINAPPER;
    url += 'topics/' + id;
    return API.get(url);
  },

  // 发布BBPress话题
  postBBTopic: function (id, agrs) {
    var url = HOST_URI_MINAPPER;
    url += 'forums/' + id;
    return API.post(url, agrs);
  },
})