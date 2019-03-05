function t() {
  this.setData({
    maskDisplay: "block"
  });
}

function e() {
  this.setData({
    maskDisplay: "none"
  });
}

var n = require("../../utils/util.js"), i = getApp();

Page({
  data: {
    userInfo: {
      nickName: "点击授权登录",
      avatarUrl: "https://cxcat.com/wp-content/uploads/2018/04/%E5%B0%81%E9%9D%A2.jpg"
    },
    readLogs: [],
    commentLogs: [],
    keepLogs: [],
    maskDisplay: "none",
    ijiRead: !0,
    ijiComment: !1,
    ijiKeep: !1
  },
  ijiRead: function (t) {
    this.setData({
      ijiRead: !0,
      ijiComment: !1,
      ijiKeep: !1
    });
  },
  ijiComment: function (t) {
    this.setData({
      ijiRead: !1,
      ijiComment: !0,
      ijiKeep: !1
    });
  },
  ijiKeep: function (t) {
    this.setData({
      ijiRead: !1,
      ijiComment: !1,
      ijiKeep: !0
    });
  },
  userMain: function () {
    null != response.data.total_comments && "" != response.data.total_comments ? self.setData({
      userName: "321"
    }) : self.setData({
      userName: "555"
    });
  },
  settingStatuClickEvent: function () {
    this.checkSettingStatu();
  },
  checkSettingStatu: function (t) {
    var e = this;
    wx.getSetting({
      success: function (t) {
        console.log(t.authSetting);
        var a = t.authSetting;
        n.isEmptyObject(a) ? console.log("首次授权") : (console.log("不是第一次授权", a), !1 === a["scope.userInfo"] && wx.showModal({
          title: "授权登录",
          content: "如需正常使用收藏，历史记录，请授权管理中选中“用户信息”，记录信息仅保存在设备。",
          showCancel: !1,
          success: function (t) {
            t.confirm && (console.log("用户点击确定"), wx.openSetting({
              success: function (t) {
                console.log("openSetting success", t.authSetting);
                var n = t.authSetting;
                for (var a in n) n[a] && i.getUserInfo(function (t) {
                  e.setData({
                    userInfo: t,
                    isGetUserInfo: !0
                  });
                });
              }
            }));
          }
        }));
      }
    });
  },
  onLoad: function (t) {
    var e = this;
    i.getUserInfo(function (t) {
      e.setData({
        userInfo: t
      });
    });
  },
  onShareAppMessage: function () {
    return {
      title: "留下你的猫爪",
      path: "pages/readlog/readlog",
      success: function (t) { },
      fail: function (t) { }
    };
  },
  onShow: function (t) {
    this.setData({
      readLogs: (wx.getStorageSync("readLogs") || []).map(function (t) {
        return t;
      }),
      commentLogs: (wx.getStorageSync("commentLogs") || []).map(function (t) {
        return t;
      }),
      keepLogs: (wx.getStorageSync("keepLogs") || []).map(function (t) {
        return t;
      })
    });
  },
  goAbout: function () {
    wx.navigateTo({
      url: "../about/about"
    });
  },
  redictDetail: function (t) {
    var e = "../detail/detail?id=" + t.currentTarget.id;
    wx.navigateTo({
      url: e
    });
  },
  feedbackClickEvent: function () {
    t.call(this);
  },
  feedbackCloseEvent: function () {
    e.call(this);
  }
});