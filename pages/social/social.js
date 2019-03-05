const API = require('../../utils/api.js')
const Auth = require('../../utils/auth.js')
const Adapter = require('../../utils/adapter.js')
const util = require('../../utils/util.js');
const NC = require('../../utils/notificationcenter.js')
import config from '../../utils/config.js'

var WxParse = require('../../wxParse/wxParse.js');
const pageCount = config.getPageCount;
var app = getApp()

Page({
  data: {
    title: '动态列表',
    topicsList: [],
		userInfo: {}, // 存放用户信息
		isLastPage:false,
    isError:false,
    isLoading: false,
    isPull: false,
    page: 1,
    forumId:108,
    currentColumn:0,
    forums:[],
    forum:{},    
    copyright: app.globalData.copyright,
    listStyle: '',
    userInfo:{},
    userSession:{},
    wxLoginInfo:{},
    memberUserInfo:{},
    shareTitle: config.getWebsiteName+'-动态',
    pageTitle: config.getWebsiteName+'-动态列表',
    showAddbtn:false

  },
  onLoad: function (e) {
    var self =this;
    Auth.setUserMemberInfoData(self);
    this.loadBBForums();
    Auth.checkLogin(self); 
  },
  onReady:function()
  {

    let self=this;
    Auth.setUserMemberInfoData(self);
    Auth.checkSession(app,API,this,'isLoginLater',util);
  },

  switchColumn:function(t)
    {
        this.setData({
            isPull: true,
            isError: false,
            isLastPage:false,
            topicsList:[]          
            
        })

        var e = t.currentTarget.dataset.idx;
        var forumId= t.currentTarget.dataset.forumid;
        var forums=this.data.forums;
        var forum =forums[e]
        this.setData({
            currentColumn: e,            
            forumId:forumId,
            forum:forum

        });
        WxParse.wxParse('article', 'html', forum.content, this, 5);
       // Adapter.loadArticles(args, this, API);
        var data={};
        data.page = 1;
        data.forumId=forumId;
        data.pageCount=pageCount;
        Adapter.loadBBTopics(data,this,API); 

        
    },

   loadBBForums: function() { 
    var self = this;   
    var forums=[];    
    var currentColumn = self.data.currentColumn;
    if(!currentColumn)
    {
      currentColumn=0;

    }
    self.setData({
            isPull: true,
            isError: false,
            topicsList:[],
            forums:[],
            currentColumn:currentColumn
            
        })
    API.getBBForums().then(res => {
        console.log(res)
        var raw_enable_newtopic_option ='0';
        var raw_enable_newtopic_integral =0;
        if (res.length && res.length > 0) {
            forums = forums.concat(res);
            WxParse.wxParse('article', 'html', res[currentColumn].content, self, 5),
            self.setData({ 
                forums: forums,
                forum:res[currentColumn],
                forumId: res[currentColumn].id
                
            });
            raw_enable_newtopic_option=res[currentColumn].raw_enable_newtopic_option;
            raw_enable_newtopic_integral=parseInt(res[currentColumn].raw_enable_newtopic_integral);
            let data = {};
            data.page=self.data.page;
            data.pageCount=pageCount;
            data.forumId= res[currentColumn].id;
            Adapter.loadBBTopics(data,self,API); 

            if(raw_enable_newtopic_option =="1")
            {

              if(parseInt(self.data.memberUserInfo.integral)>=raw_enable_newtopic_integral && self.data.memberUserInfo.forumslevel !="0" )
              {
                  self.setData({showAddbtn:true}); 

              }
              else
              {
                self.setData({showAddbtn:false}); 
              }
            }
            else
            {
              self.setData({showAddbtn:false}); 
            }
                      
        }            
        else {
            wx.showToast({
                title: res,
                duration: 1500
            })
        }           
    }).catch(err => {            
        wx.stopPullDownRefresh()
    });



},

  onShow: function (options) {
		let self=this;    
    var showAddbtn =false;
    Auth.setUserMemberInfoData(self);   

  }, 
  agreeGetUser:function(e)
    {
        let self= this;
        Auth.checkAgreeGetUser(e,app,self,API,'0');        
        
    },

  onShareAppMessage: function () {
    return {
      title: shareTitle,
      path: 'pages/social/social',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  // 跳转至查看文章详情
  TopicDetail: function (e) {
    //console.log(url);
    var sid = e.currentTarget.id,
        url = '../topicdetail/topicdetail?id=' + sid;
    wx.navigateTo({
      url: url
    })
  },

  onReachBottom: function () {
    
    let args = {};
    if (!this.data.isLastPage) {            
        args.page = this.data.page+1;
        args.forumId=this.data.forumId;
        args.pageCount=pageCount;
        this.setData({isLoading:true});
        Adapter.loadBBTopics(args, this, API); 
        this.setData({ isLoading:false});         
    }
    else {
        console.log("最后一页了");
        
    }
   
  },

	//下拉刷新
  onPullDownRefresh:function(){
    //var forums=this.data.forums;
    var self = this;
    Auth.setUserMemberInfoData(self);  
    this.loadBBForums();
    // let data = {};
    // data.page = 1;
    // data.forumId=this.data.forumId;
    // data.pageCount=pageCount;
    // self.setData({
    //   topicsList:[],
    //   isPull:true
    // })
      
    // Adapter.loadBBTopics(data,self,API);
   
  },


  sendPost: function(){// 跳转
    var self = this
    if (!self.data.userSession.sessionId) {

        self.setData({ isLoginPopup: true });
        
    }
    else
    {
        var forumId=self.data.forumId;
        var url='../../pages/postopic/postopic?forumid='+forumId
        wx.navigateTo({
            url: url
          })

    }
        
    
  }




})

