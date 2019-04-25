## :cat: 通知  通知  通知 :cat:
> 小程序已经恢复 欢迎查看 需要进微信群交流群的添加微信 hackdxd
> 小程序网站 http://mzhuti.com

#### 为了方便大家更好的交流 特意建立了QQ群 欢迎大家添加 代码更新版本都会在第一时间更新
> QQ群号码:782332434
## 关于本小程序 :cat:
#### 2019年3月已经更新 :star::bowtie::earth_asia:
> 本次小程序的修改基于开源的wordpress小程序"守望轩",本着开源的精神会一直更新下去。
感谢大家的支持，希望越做越好。
![EZcLjA.jpg](https://s2.ax1x.com/2019/04/25/EZcLjA.jpg)
 [猫小镇小程序欣赏]
 </div>
 
#### 小程序展示
[![EZgSN8.png](https://s2.ax1x.com/2019/04/25/EZgSN8.png)](https://imgchr.com/i/EZgSN8)

#### 个人网站
> http://www.aihack.cn
> https://cxcat.com

#### 欢迎添加更好的体验

> 小程序ID：wxe61b785946958cc7

#### 微信群已满
> (添加微信 hackdxd )拉你进群

### WordPress版微信小程序 :book:猫小镇开源地址:octocat: QQ群:782332434
#### git下载地址
> https://github.com/webzol/cxcat
#### 码云下载地址
> https://gitee.com/izol/cxcat


#### 小程序配套wordpress插件：
> 本小程序完整使用需要配合原作者（imxjb）编写的wordpress插件wp-rest-api-for-app，才能完整使用，插件下载地址： https://github.com/iamxjb/rest-api-to-miniprogram

#  注意问题
## 2019年4月第1次更新记录

1.首页布局调整，新增了推荐栏目
>首页轮播底部新增了推荐栏目，实为置顶文章，置顶3到4篇文章效果最佳
更改了文章显示布局风格，去掉了圆角
 
2.首页文章展示修改
>去掉了圆角，改成了规矩的方角，看着更直观大气，还有增加了标题底部投影

3.文章详情页
>文章详情页布局细节优化，变化最大的就是更多里面的图标全部替换，已蓝色为主调

4.海报优化
>去掉了难看的边框，以及更改了大小，让视觉更好看

5.git上面版本如有不完整，请添加QQ群782332434更新
>添加微信hackdxd拉进微信交流群

## 2019年3月2次更新记录

1.首页标题的显示问题，解决了多余部分隐藏，用到的属性为
> overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  
2.底部添加了小程序推荐栏目
index.wxml代码
> <view class="top-item">
        <navigator target="miniProgram" open-type="navigate" app-id="需要添加小程序的Appid" path="pages/index/index" extra-data="" hover-class="none" version="release">
          <view>
            <image src="../../images/time.jpg"></image>
          </view>
          <view>
            <vpush-view>
              <text>小程序名称</text>
            </vpush-view>
          </view>
        </navigator>
      </view>
### 需要注意点的是需要小程序跳转还需要在app.json添加如下代码
>    "navigateToMiniProgramAppIdList": [
      "需要添加小程序的Appid"
    ]

## 2019年3月1次更新记录

1.首页整体界面UI优化

2.更新了新版本请求登陆问题

3.生成海报以及个人中心浏览历史收藏修复

## 2018年9月2次更新记录

1.文章首页摘要已经显示为2行

2.历史文章点进去空白问题已经解决


## 关于文章摘要跟历史文章空包我要分享一个技术点

1.用了截取的方法xx.substring(0,32)

2.32为你要截取的长度以及你要在哪里结束。需要改进的可以去看看

3.截取的代码在index.js里面，喜欢的可以随意折腾

4.{{item.id}}这个是我之前的传值因为没有定义id所以值为空，目前已改为{{item[0]}}直接数组取值就ok了

## 2018年9月更新记录

1.修复了首页轮播指示点问题,由以前的横向变为竖向

2.详情页图片变为了圆角

## 2018年8月更新记录
1.整体布局的改变以及UI的重构

2.个人中心增加了历史以及收藏功能还有好看的背景

3.详情页增加了悬浮转发的功能

4.专题做成了卡片模式

5.增加了首页文章摘要


#### 以下是wordpress小程序开源者一些更新记录

### 功能清单：

1.缩略图的方式显示文章列表（首页，分类文章），包括显示文章分类和发布时间，加载分页。

2.在首页用轮播方式显示置顶文章。

3.显示文章分类（专题），包括显示分类的封面图片。

4.显示文章内容页，包括文章站内链接跳转，站外链接复制到剪切板，显示猜你喜欢的相关文章。

5.显示文章评论，提交评论和回复评论，加载评论分页，显示微信用户评论者的头像。

6.显示文章排行

7.显示wordpress“页面”类文字（关于页面）。

8.对文章内容的全文搜索。

9.文章页面的分享、转发，复制。

10.WordPress 插件的配套功能。

11.文章浏览数显示及更新。

12.文章微信用户点赞及点赞的微信用户头像显示。

13.通过微信支付对文章赞赏。

14.赞赏后发送模版消息。

15.web-view内嵌网页跳转。

16.回复评论发送模板消息。

17.专题订阅。

18.文章海报（分享微信朋友圈的卡片）。

# 更新历史：

## 2018年2月15日

1.增加文章海报（分享微信朋友圈的卡片）功能。

2.兼容个人主体小程序的功能完善

3.文章分享加题图。

4.首页导航，提供三种方式的跳转

## 2017年12月15日

1.增加赞赏后发送模板消息。

2.增加回复评论发送模板消息。

3.调整评论和回复的显示方式及提交评论、回复发送方式。

## 2017年11月1日

1.调整“热点”板块为“排行”板块，显示按评论数、浏览数、点攒数、赞赏数的文章排行。

2.增加“我的”板块，显示我浏览、评论、点赞、赞赏过的文章。

3、加入内链的web-view嵌入网页跳转。

4、在关于中显示“赞赏”或“捐赠”人的头像，并致谢。


## 2017年9月16日
1.增加点赞功能

2.增加赞赏功能（微信支付）


## 2017年8月17日
1.增加站内链接。

2.增加猜你喜欢功能。

3.增加热点文章功能。

4、取消浏览记录功能。

## 2017年7月29日

1.完善文章的评论，按评论时间对一级评论按时间先后显示，最新发表的显示在最上面。

2.以嵌套的方式显示评论和回复，最多显示5层嵌套。

3.增加评论的回复功能，可以针对4级评论（回复）进行回复。

4.文章内容页加入一直没有引入的wxParse.wxss文件（弥补愚蠢的错误）。

## 2017年7月15日

1.完善首页列表的缩略。调整为150*150的小图，需要配合wp-rest-api-for-app插件.

2.去除侧滑菜单。增加专题分类，并完善搜索。

3.完善评论及显示。

4.优化程序性能，整理wxss，让程序代码更易懂和美观.

5.修复获取微信头像bug，当头像如果是https地址的话，不强制转换成https。

6.修复没有置顶文章，下拉刷新不显示列表的bug。

7.为评论增加分页，提供分页刷新的功能。


## 日期：2017年6月6日

内容：

1.调整列表页的显示方式。

2.增加搜索。

3.首页增加轮播图片和缩略图。

4.增加文章评论

5.增加小程序分享



## 日期：2017年5月15日

内容：

1.在主页面，加入浮动按钮，用来打开侧滑导航菜单。

2.增加侧滑导航菜单，菜单上包括页面及文章分类.侧滑菜单代码参考WechatSmallApps（https://github.com/jkgeekJack/WechatSmallApps）的代码修改。

3.优化下拉刷新数据（分页）的性能。

4.文章列表页添加发布时间。

5.升级最新的微信小程序富文本解析组件wxParse（https://github.com/icindy/wxParse）
