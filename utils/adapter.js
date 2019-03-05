// 文章列表数据
function loadArticles(args, appPage, api) {
  var page = args.page;
  var pageCount = args.pageCount;
  var pageData = {};
  api.getPosts(args).then(res => {
    console.log(res)
    if (res.length && res.length > 0) {
      if (res.length < pageCount) {
        pageData.isLastPage = true;
      }
      pageData.articlesList = [].concat(appPage.data.articlesList, res)
      pageData.isList = true;
      if (appPage.data.isPull) {
        wx.stopPullDownRefresh()
      }
      pageData.page = page;
      appPage.setData(pageData);
    } else if (res.code == 'rest_post_invalid_page_number') {
      appPage.setData({
        isLastPage: true
      });
      wx.showToast({
        title: '已达最后一页',
        mask: false,
        icon: "none",
        duration: 1e3
      });
    } else {

    }

  }).catch(err => {
    appPage.setData({
      isLoading: false,
      isPull: false,
      isList: false,
      isError: true
    })
    wx.stopPullDownRefresh()
  })
}

//--------------------------------------
// 获取文章或页面详细内容
function loadArticleDetail(args, appPage, WxParse, api) {
  api.getPostOrPageById(args).then(res => {
      if (res.content.rendered) {
        WxParse.wxParse('article', 'html', res.content.rendered, appPage, 5);
        appPage.setData({
          detail: res,
          display: true,
          commentCounts: res.total_comments
        });
        if (res.mylike == "1") {
          appPage.setData({
            likeIcon: "../../images/entry-like-on.png"
          });
        }
        if (appPage.data.isPull) {
          wx.stopPullDownRefresh()
        }
        wx.setNavigationBarTitle({
          title: res.title.rendered
        });

      }
      return res;
    })
    .then(res => {

      // 调用API从本地缓存中获取阅读记录并记录
      var logs = wx.getStorageSync('readLogs') || [];
      // 过滤重复值
      if (logs.length > 0) {
        logs = logs.filter(function(log) {
          return log["id"] !== res.id;
        });
      }
      // 如果超过指定数量
      if (logs.length > 19) {
        logs.pop(); //去除最后一个
      }
      var titleRendered = {
        "rendered": res.title.rendered
      };
      var log = {
        "id": res.id,
        "date": res.date,
        "total_comments": res.total_comments,
        "pageviews": res.pageviews,
        "like_count": res.like_count,
        "title": titleRendered,
        "post_large_image": res.post_large_image,
        "post_medium_image": res.post_medium_image
      };
      logs.unshift(log);
      wx.setStorageSync('readLogs', logs);
    })
    .catch(err => {
      appPage.setData({
        display: false
      })
      wx.stopPullDownRefresh()
    })

}

function loadComments(args, appPage, api) {
  var page = args.page;
  var pageData = {};
  api.getCommentsReplay(args).then(res => {
    if (res.comments) {

      if (res.comments.length < args.limit) {
        appPage.setData({
          isLastPage: true,
          isLoading: false
        })
      }
      if (appPage.data.isPull) {
        wx.stopPullDownRefresh()
      }
      pageData.commentsList = [].concat(appPage.data.commentsList, res.comments);
      pageData.page = page + 1;
      appPage.setData(pageData);

    }
  }).catch(err => {
    appPage.setData({
      isLoading: false,
      isPull: false
    })
    wx.stopPullDownRefresh();
  })

}

function loadBBTopics(args, appPage, api) {
  var page = args.page;
  var pageCount = args.pageCount;
  var pageData = {};
  api.getBBTopics(args).then(res => {
    console.log(res);
    if (res.topics) {
      if (res.topics.length < pageCount) {
        pageData.isLastPage = true;
      }
      pageData.topicsList = [].concat(appPage.data.topicsList, res.topics);
      if (appPage.data.isPull) {
        wx.stopPullDownRefresh()
      }
      pageData.page = page;
      appPage.setData(pageData);

    } else {
      console.log(res);
    }

  }).catch(err => {
    appPage.setData({
      isLoading: false,
      isPull: false,
      isError: true
    })
    wx.stopPullDownRefresh()

  })
}

function loadBBTopic(args, appPage, WxParse, api) {
  var id = args.id;
  api.getBBTopicByID(id).then(res => {
    if (!res.code && res.id) {

      WxParse.wxParse('article', 'html', res.content, appPage, 5);
      appPage.setData({
        detail: res,
        link: res.permalink,
        repliesList: res.replies ? res.replies : [],
        display: 'block'
      })


    } else {
      console.log(res);
    }

  })

}

function postBBTopic(id, agrs, api) {
  api.postBBTopic(id, agrs).then(res => {
    if (res.success) {
      wx.showToast({
        title: res.message,
        icon: "none",
        duration: 5000,
        success: function() {
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })

          }, 1000);

        }
      })

    } else {

      wx.showToast({
        title: res.message,
        icon: "none",
        duration: 2000
      })


    }
  }).catch(err => {

    console.log(err)
    wx.showToast({
      title: "发表失败",
      icon: "none",
      duration: 2000,

    })
  })

}

function replyBBTopic(id, agrs, appPage, WxParse, api) {
  api.replyBBTopicByID(id, agrs).then(res => {
    if (res.success) {
      wx.showToast({
        title: res.message,
        icon: "none",
        duration: 2000,
        success: function() {
          appPage.setData({
            content: '',
            placeholder: "说点什么...",
            repliesList: [],
            link: '',
            detail: {}
          });


          // if(res.post_status=='publish')
          // {

          // }

          var data = {};
          data.id = id;
          loadBBTopic(data, appPage, WxParse, api);

        }
      })

    } else {

      wx.showToast({
        title: res.message,
        icon: "none",
        duration: 2000
      })


    }
  }).catch(err => {

    console.log(err)
    wx.showToast({
      title: "回复失败",
      icon: "none",
      duration: 2000,

    })
  })
}

//提交评论
function submitComment(e, appPage, app, api, util) {

  var content = e.detail.value.inputComment;
  var postId = e.detail.value.inputPostID;
  var formId = e.detail.formId;

  var parentId = appPage.data.parentId;
  var toFormId = appPage.data.toFormId; //回复的formid
  var toUserId = appPage.data.toUserId; //回复的userid
  var commentdate = appPage.data.commentdate;

  if (formId == 'the formId is a mock one') {
    formId = '';

  }

  var userId = appPage.data.userSession.userId; //当前用户的userid
  var sessionId = appPage.data.userSession.sessionId; //当前用户的sessionid
  if (content.length === 0) {
    appPage.setData({
      'dialog.hidden': false,
      'dialog.title': '提示',
      'dialog.content': '没有填写评论内容。'

    });
  } else if (content.length > 1000) {
    appPage.setData({
      'dialog.hidden': false,
      'dialog.title': '提示',
      'dialog.content': '评论内容太多了。'

    });

  } else {

    if (appPage.data.userSession) {
      var authorName = appPage.data.userInfo.nickName;
      var authorUrl = appPage.data.userInfo.avatarUrl;
      var authorEmail = appPage.data.userSession.sessionId + "@qq.com";
      var sessionId = appPage.data.userSession.sessionId;
      var fromUser = appPage.data.userInfo.nickName;
      var data = {
        postid: postId,
        authorname: authorName,
        authoremail: authorEmail,
        content: content,
        authorurl: authorUrl,
        parentid: parentId,
        sessionid: sessionId,
        userid: userId,
        formid: formId
      };

      api.postCommentsReplay(data).then(res => {
        if (res.success) {
          appPage.setData({
            content: '',
            parentId: "0",
            placeholder: "评论...",
            focus: false,
            commentsList: [],
            page: 1,
            isLastPage: false

          });

          console.log(res.message);
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 3000,
            success: function() {
              if (res.comment_approved == "1") {
                appPage.onReachBottom();
              }

              appPage.hiddenBar();
            }
          })
          if (content.length > 100) {
            content = content.substr(0, 100) + "...";

          }
          if (parentId != "0" && !util.getDateOut(commentdate) && toFormId != null && toFormId != "" && toFormId != "the formId is a mock one") {
            var data = {
              touserid: toUserId,
              extid: postId,
              toformid: toFormId,
              content: content,
              fromuser: authorName,
              sessionid: sessionId,
              extype: 'replycomment'
            };

            api.sentMessage(data).then(res => {
              console.log(res);
            });

          }

          var commentCounts = parseInt(appPage.data.commentCounts) + 1;
          appPage.setData({
            commentCounts: commentCounts

          });
        } else {
          //console.log(res.code);
          // appPage.setData({
          //     'dialog.hidden': false,
          //     'dialog.title': '提示',
          //     'dialog.content': res.message

          // });
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 1e3,
            success: function() {

            }
          })


        }

      })


    }

  }

}

// 跳转至查看文章详情
function redictDetail(e, posttype) {
  // console.log('查看文章');
  var id = e.currentTarget.id;
  var url = "";
  if (posttype == "post") {

    url = '../detail/detail?id=' + id;
  }
  wx.navigateTo({
    url: url
  })
}

function postLike(appPage, app, api) {

  var userId = appPage.data.userSession.userId; //当前用户的userid
  var sessionId = appPage.data.userSession.sessionId; //当前用户的sessionid
  var postId = appPage.data.postId;

  var data = {
    userid: userId,
    postid: postId,
    sessionid: sessionId
  };

  api.postLike(data).then(res => {
    if (res.success) {
      console.log(res.message);
      wx.showToast({
        title: '谢谢点赞',
        icon: "none",
        duration: 1e3,
        success: function() {

          var myLikeList = [];
          var myLike = appPage.data.userInfo.avatarUrl;
          myLikeList.push(myLike);
          var avatarurls = myLikeList.concat(appPage.data.detail.avatarurls);
          var likeCount = parseInt(appPage.data.detail.like_count) + 1;
          var detail = appPage.data.detail;
          detail.avatarurls = avatarurls;
          detail.like_count = likeCount;
          appPage.setData({
            detail: detail
          });

        }
      })
      appPage.setData({
        likeIcon: "../../images/entry-like-on.png"
      })

    } else {
      //console.log(res.code);
      // appPage.setData({
      //     'dialog.hidden': false,
      //     'dialog.title': '提示',
      //     'dialog.content': res.message

      // });
      //  wx.showToast({
      //     title: res.message,
      //     icon: 'success',
      //     duration: 900,
      //     success: function () {

      //     }
      // })
      // 
      toast(res.message, 2000);

      if (res.message == "已点赞") {
        appPage.setData({
          likeIcon: "../../images/entry-like-on.png"
        });

      }


    }

  });

}


function toast(message, duration) {
  wx.showToast({
    title: message,
    icon: "none",
    duration: duration
  });
}

function copyLink(url, message) {
  //this.ShowHideMenu();
  wx.setClipboardData({
    data: url,
    success: function(res) {
      wx.getClipboardData({
        success: function(res) {
          // toast('链接已复制')
          toast(message, 3000);

        }
      })
    }
  })
}

function gotoWebpage(enterpriseMinapp, url) {
  var link = '../webpage/webpage';
  if (enterpriseMinapp == "1") {

    wx.navigateTo({
      url: link + '?url=' + url
    })
  } else {
    copyLink(url, "无法使用此功能,链接已复制,粘贴到浏览器里打开。");

  }

}

function creatPoster(appPage, app, api, util, modalView) {
  var postId = appPage.data.detail.id;
  var title = appPage.data.detail.title.rendered;
  var excerpt = util.removeHTML(appPage.data.detail.excerpt.rendered);
  var postImageUrl = "";
  var posterImagePath = "";
  var qrcodeImagePath = "";
  var flag = false;
  var imageInlocalFlag = false;
  var domain = appPage.data.domain;
  var downloadFileDomain = appPage.data.downloadFileDomain;
  var logo = appPage.data.logo;
  var defaultPostImageUrl = appPage.data.postImageUrl;



  var postImageUrl = appPage.data.detail.post_full_image;

  //获取文章首图临时地址，若没有就用默认的图片,如果图片不是request域名，使用本地图片
  if (postImageUrl) {
    var n = 0;
    for (var i = 0; i < downloadFileDomain.length; i++) {

      if (postImageUrl.indexOf(downloadFileDomain[i].domain) != -1) {
        n++;
        break;
      }
    }
    if (n == 0) {
      imageInlocalFlag = true;
      postImageUrl = defaultPostImageUrl;

    }

  } else {
    postImageUrl = defaultPostImageUrl;
  }
  var posterQrcodeUrl = 'https://' + domain + "/wp-content/plugins/rest-api-to-wechat/images/qrcode/qrcode-" + postId + ".png";;
  //生成二维码

  api.creatPoster(postId).then(res => {
    if (res.success) {
      //下载二维码
      const downloadTaskQrcodeImage = wx.downloadFile({
        url: res.qrcodeurl,
        success: res => {
          if (res.statusCode === 200) {
            qrcodeImagePath = res.tempFilePath;
            console.log("二维码图片本地位置：" + res.tempFilePath);
            if (imageInlocalFlag) {
              createPosterLocal(appPage, postImageUrl, qrcodeImagePath, title, excerpt, logo, modalView)
            } else {
              const downloadTaskForPostImage = wx.downloadFile({
                url: postImageUrl,
                success: res => {
                  if (res.statusCode === 200) {
                    posterImagePath = res.tempFilePath;
                    console.log("文章图片本地位置：" + res.tempFilePath);
                    flag = true;
                    if (posterImagePath && qrcodeImagePath) {
                      createPosterLocal(appPage, posterImagePath, qrcodeImagePath, title, excerpt, logo, modalView);
                    } else {
                      console.log(res);
                      wx.hideLoading();
                      toast("文章或二维码图片下载失败", 2000);

                    }
                  } else {
                    console.log(res);
                    wx.hideLoading();
                    toast("下载文章图片失败" + res, 2000);


                  }
                }

              });
              downloadTaskForPostImage.onProgressUpdate((res) => {
                console.log('下载文章图片进度：' + res.progress)

              })
            }
          } else {

            toast(res.message, 2000);

          }

        }
      });
      downloadTaskQrcodeImage.onProgressUpdate((res) => {
        console.log('下载二维码进度', res.progress)
      })


    } else {
      toast(res.message, 2000);
    }
  })


}

//将canvas转换为图片保存到本地，然后将路径传给image图片的src
function createPosterLocal(appPage, postImageLocal, qrcodeLoal, title, excerpt, logo, modalView) {

  wx.showLoading({
    title: "正在生成海报",
    mask: true,
  });
  var context = wx.createCanvasContext('mycanvas');
  context.setFillStyle('#ffffff'); //填充背景色
  context.fillRect(0, 0, 600, 970);
  context.drawImage(postImageLocal, 0, 0, 600, 400); //绘制首图
  context.drawImage(qrcodeLoal, 210, 670, 180, 180); //绘制二维码
  // context.drawImage(logo, 350, 740, 130, 130); //画logo 
  //const grd = context.createLinearGradient(30, 690, 570, 690)//定义一个线性渐变的颜色
  //grd.addColorStop(0, 'black')
  //grd.addColorStop(1, '#118fff')
  //context.setFillStyle(grd)
  context.setFillStyle("##959595");
  context.setFontSize(20);
  context.setTextAlign('center');
  context.fillText("长按识别小程序码，立即阅读", 300, 900);
  //context.setStrokeStyle(grd)
  context.setFillStyle("#959595");
  //分割线 context.beginPath()
  // context.moveTo(30, 690)
  // context.lineTo(570, 690)
  // context.stroke();
  // this.setUserInfo(context);//用户信息        
  drawTitleExcerpt(context, title, excerpt); //文章标题
  context.draw();
  //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
  setTimeout(function() {
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function(res) {
        var tempFilePath = res.tempFilePath;
        wx.hideLoading();
        console.log("海报图片路径：" + res.tempFilePath);
        appPage.showModal(res.tempFilePath);
      },
      fail: function(res) {
        console.log(res);

      }
    });
  }, 900);
}







//绘制文字：文章题目、摘要、扫码阅读
function drawTitleExcerpt(context, title, excerpt) {
  context.setFillStyle("#333");
  context.setTextAlign('left');
  if (getStrLength(title) <= 14) {
    //14字以内绘制成一行，美观一点
    context.font = "bold 36rpx arial";
    context.fillText(title, 60, 480);
  } else {
    //   //题目字数很多的，只绘制前36个字（如果题目字数在15到18个字则也是一行，不怎么好看）
    context.font = "bold 36rpx arial";
    context.fillText(title.substring(0, 14), 60, 460);
    context.fillText(title.substring(14, 26)+"...", 60, 510);
  }

  context.setFontSize(22);
  context.setTextAlign('left');
  context.setGlobalAlpha(0.6);
  for (var i = 0; i <= 30; i += 23) {
    //摘要只绘制前50个字，这里是用截取字符串
    if (getStrLength(excerpt) > 30) {
      if (i == 40) {
        context.fillText(excerpt.substring(i, i + 23), 60, 570 + i * 2);

      } else {
        context.fillText(excerpt.substring(i, i + 23), 60, 570 + i * 2);
      }

    } 
    else {
      context.fillText(excerpt.substring(i, i + 22) , 60, 570 + i * 2);
    }
  }

  context.stroke();
  context.save();
}

function getStrLength(str) {
  return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
}

function postPayment(appPage, app, api) {
  var args = {};
  args.sessionid = appPage.data.userSession.sessionId;
  args.userid = appPage.data.userSession.userId;
  args.totalfee = appPage.data.totalfee;
  args.extid = appPage.data.postId;
  args.extype = 'postpraise';


  api.postPayment(args).then(res => {
    if (res.success) {
      var toFormId = res.package;
      var noncestr = res.nonceStr
      toFormId = toFormId.substring(10);
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': res.package,
        'signType': res.signType,
        'paySign': res.paySign,
        'success': function(res) {
          wx.showToast({
            title: '谢谢鼓励！',
            uration: 2000,
            success: function() {
              var data = {
                userid: args.userid,
                sessionid: args.sessionid,
                noncestr: noncestr
              };
              api.updateOrderStatus(data).then(res => {
                console.log(res);
              }).then(res => {
                var toUserId = args.userid;
                var extId = args.extid;
                var fromUser = appPage.data.userInfo.nickName;
                var sessionId = appPage.data.userSession.sessionId;
                var extype = 'postpraise';
                var data = {
                  touserid: toUserId,
                  extid: extId,
                  toformid: toFormId,
                  fromuser: fromUser,
                  sessionid: sessionId,
                  extype: extype,
                  noncestr: noncestr,
                  totalfee: args.totalfee
                };
                api.sentMessage(data).then(res => {
                  console.log(res);
                  wx.navigateBack({
                    delta: 1
                  })
                });
              });

            }
          });
        },
        'fail': function(res) {
          toast(res.errMsg, 2000);
        },
        complete: function(res) {

          if (res.errMsg == 'requestPayment:fail cancel') {

            toast("你取消了支付", 2000);

          }

        }
      });
    } else {
      wx.showToast({
        title: res.message,
        icon: "none",
        duration: 1e3,
        success: function() {

        }
      })
    }

  });


}

function prodcutPayment(appPage, app, api) {
  var args = {};
  args.sessionid = appPage.data.userSession.sessionId;
  args.userid = appPage.data.userSession.userId;
  args.totalfee = appPage.data.totalfee;
  args.extid = appPage.data.productId;
  args.extype = appPage.data.productype;
  var content = appPage.data.productName;



  api.postPayment(args).then(res => {
    if (res.success) {
      var toFormId = res.package;
      var noncestr = res.nonceStr
      toFormId = toFormId.substring(10);
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': res.package,
        'signType': res.signType,
        'paySign': res.paySign,
        'success': function(res) {
          wx.showToast({
            title: '谢谢支持！',
            uration: 2000,
            success: function() {
              var data = {
                userid: args.userid,
                sessionid: args.sessionid,
                noncestr: noncestr,
                extname: content
              };
              api.updateOrderStatus(data).then(res => {
                console.log(res);
              }).then(res => {
                var toUserId = args.userid;
                var extId = args.extid;
                var fromUser = appPage.data.userInfo.nickName;
                var sessionId = appPage.data.userSession.sessionId;
                var extype = appPage.data.productype;
                var data = {
                  touserid: toUserId,
                  extid: extId,
                  content: content,
                  toformid: toFormId,
                  fromuser: fromUser,
                  sessionid: sessionId,
                  extype: extype,
                  noncestr: noncestr,
                  totalfee: args.totalfee
                };
                api.sentMessage(data).then(res => {
                  console.log(res);
                  wx.navigateBack({
                    delta: 1
                  })
                });
              });

            }
          });
        },
        'fail': function(res) {
          toast(res.errMsg, 2000);
        },
        complete: function(res) {

          if (res.errMsg == 'requestPayment:fail cancel') {

            toast("你取消了支付", 2000);

          }

        }
      });
    } else {
      wx.showToast({
        title: res.message,
        icon: "none",
        duration: 1e3,
        success: function() {

        }
      })
    }

  });


}


function upLoadImage(count, callback, nodeIndex, sourceType, app, api, appPage) {
  var that = this;
  nodeIndex = typeof(nodeIndex) == 'undefined' ? 0 : parseInt(nodeIndex);
  sourceType = typeof(sourceType) != 'object' ? ['album', 'camera'] : sourceType;
  wx.chooseImage({
    count: count,
    sourceType: sourceType,
    success: function(res) {
      var filePath = res.tempFilePaths;
      var tempFileSize = Math.ceil((res.tempFiles[0].size) / 1024);
      if (tempFileSize > 2048) {
        wx.showToast({
          title: "上传的图片大于2M",
          mask: false,
          icon: "none",
          duration: 3000
        });
        return;

      }
      if (filePath.length > count) {
        wx.showToast({
          title: '选择的图片多于' + count + "张",
          icon: "none",
          duration: 1e3,
          success: function() {

          }
        })
        return;
      }

      if (filePath.length > 0) {
        for (let k in filePath) {
          var imgfile = filePath[k];
          // 1、默认返回本地图片
          //callback_page(appPage,callback, { code: 0, data: { id: 0, src: imgfile, nodeIndex: nodeIndex, islode: nodeIndex } }, 'local');
          var data = {
            code: 0,
            data: {
              id: 0,
              src: imgfile,
              nodeIndex: nodeIndex,
              islode: nodeIndex
            }
          };
          callback(data, 'local');
          // 2、上传至服务器
          upLoadImageToServer(imgfile, callback, nodeIndex, app, api, appPage);
          // 节点自增
          nodeIndex++;
        }

      }
    }
  })

}

function upLoadImageToServer(imgfile, callback, nodeIndex, app, api, appPage) {
  var sessionId = appPage.data.userSession.sessionId;
  var userId = appPage.data.userSession.userId;

  if (!sessionId || !userId) {
    toast('请先授权登录', 3000);
    return
  }

  var formData = {
    'sessionid': sessionId,
    'userid': userId
  };
  var args = {};
  args.imgfile = imgfile;
  args.formData = formData;
  api.uploadFile(args).then(res => {
    var jsonData = JSON.parse(res);
    if (jsonData.success) {
      var data = {
        code: 0,
        data: {
          id: nodeIndex,
          src: jsonData.imageurl,
          nodeIndex: nodeIndex,
          text: "<img src='" + jsonData.imageurl + "' />",
          islode: -1,
          alt: ''
        }
      };
      callback(data, 'server');

    } else {

      var data = {
        code: 0,
        data: {
          id: nodeIndex,
          src: jsonData.imageurl,
          nodeIndex: nodeIndex,
          text: "<img src='" + jsonData.imageurl + "' />",
          islode: -2,
          alt: ''
        }
      };
      callback(data, 'server');

    }

    toast(jsonData.message, 2000);
  })

}

function callback_page(appPage, func, res, opt) {
  var that = this;
  if (func && typeof(that.page[func]) == 'function') {
    console.log('wxapi callback function: ' + func + ' success');
    if (opt && typeof(opt) != 'undefined') {
      that.page[func](res, opt);
    } else {
      that.page[func](res);
    }
  } else if (typeof(that[func]) == 'function') {
    if (opt && typeof(opt) != 'undefined') {
      that[func](res, opt);
    } else {
      that[func](res);
    }
  }
}

function upLoadFile(filePath, app, appPage, api) {
  var sessionId = appPage.data.userSession.sessionId;
  var userId = appPage.data.userSession.userId;
  var jsonData = {};
  if (!sessionId || !userId) {
    toast('请先授权登录', 3000);
    return
  }

  var formData = {
    'sessionid': sessionId,
    'userid': userId
  };

  var data = {};
  data.imgfile = filePath;
  data.formData = formData;
  api.uploadFile(data).then(res => {
    if (res.code) {
      toast(res.message, 3000);
    } else {
      var jsonData = JSON.parse(res);
      var imageurl = jsonData.imageurl;
      console.log(res);
      appPage.setData({
        imageObject: appPage.data.imageObject.concat('<img src="' + imageurl + '"/><br/>')
      });
    }

  })

}


module.exports = {
  loadArticles: loadArticles,
  loadArticleDetail: loadArticleDetail,
  loadBBTopics: loadBBTopics,
  loadBBTopic: loadBBTopic,
  postBBTopic: postBBTopic,
  replyBBTopic: replyBBTopic,
  loadComments: loadComments,
  submitComment: submitComment,
  postPayment: postPayment,
  prodcutPayment: prodcutPayment,
  redictDetail: redictDetail,
  postLike: postLike,
  toast: toast,
  copyLink: copyLink,
  gotoWebpage: gotoWebpage,
  creatPoster: creatPoster,
  upLoadImage: upLoadImage,
  upLoadFile: upLoadFile
}