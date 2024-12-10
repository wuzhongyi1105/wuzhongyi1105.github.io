---
layout: post
title: Jekyll 更改 RSS 模版文件以验证 follow 阅读器
date: 2024-12-09
hidden: true
relate: code
comments: true
license: essay
---

## 前言

最近在 [Patrick](https://www.pengqiqi.com/) 的邀请下尝试了一下 [follow 阅读器](https://follow.is/)，除了浓浓的 Web3 气息外，其它各方面都算得上相当优秀的产品。阅读器还支持验证订阅源的所有权，不过需要在 RSS 输出上进行操作，这里就写一篇粗浅的教程。

## 所有权验证

follow 阅读器验证博客的所有权是需要在 RSS 源里额外增加用于验证的`<follow_challenge>`标签，这个标签里包含`<feedId>``<userId>`两个元素。

Jekyll 可以通过更改 RSS 模版文件来实现。Jekyll 的 RSS 模版文件一般在根目录，文件名是`feed.xml`。我这边是在`<description>`和`<link>`之间添加了`<follow_challenge>`标签。修改完成之后的代码如下：
```
  <description>{{ site.description | xml_escape }}</description>
    <follow_challenge>
      <feedId>*****************</feedId>
      <userId>*****************</userId>
    </follow_challenge>
  <link>{{ site.url }}{{ site.baseurl }}/</link>
```

修改完成后生成并更新网站，就可以在 follow 阅读器里右击自己的订阅选择验证。其它一些类似的静态博客生成器应该也可以这样操作。

## 写在最后

好久没有翻博客的评论了，今天一看，在之前一篇简述 RSS 协议的[文章里](https://blog.dylanwu.space/2021/11/30/myth-of-rss.html)有很多评论还是在列举 RSS 协议的“缺点”，我觉得应该是我那篇文章写得不够清楚，因为当时想得也不够清晰。

但是在使用 follow 阅读器后，我的看法越来越明晰了——RSS 协议作为一个文本输出的接口本身并没有什么问题，问题是围绕这个接口的实现极度匮乏。而 follow 阅读器可以说极大弥补了这种匮乏。

注意，这里说的“匮乏”并不是协议本身功能上的问题，而是围绕这个协议的开发实现的匮乏。打算后面有空再写一篇关于 RSS 协议的文章，这里先把观点摆出来。