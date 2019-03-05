import config from '../../utils/config.js'
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var auth = require('../../utils/auth.js');
var WxParse = require('../../wxParse/wxParse.js');
var wxApi = require('../../utils/wxApi.js');
var wxRequest = require('../../utils/wxRequest.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        url: null,
        title: "",
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var self = this;
        console.log(decodeURIComponent(options.url));
        console.log(options);
        if (options.url != null) {
            var url = decodeURIComponent(options.url);
            if (url.indexOf('*') != -1) {
                url = url.replace("*", "?");
            }
            self.setData({
                url: url
            });
        }
        else {
            self.setData({
                url: 'https://' + config.getDomain
            });
        }
    },
    onShareAppMessage: function (options) {
        var self = this;
        var url = options.webViewUrl;
        if (url.indexOf("?") != -1) {
            url = url.replace("?", "*");
        }
        url = 'pages/webpage/webpage?url=' + url;
        console.log(options.webViewUrl);
        return {
            title: '分享"' + config.getWebsiteName + '"的文章' + self.data.title,
            path: url,
            success: function (res) {
                // 转发成功
                console.log(url);
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})