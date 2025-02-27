---
layout: post
title: 利用脚本抓取 RSS 并用票据机打印
date: 2024-10-31
hidden: true
relate: code
comments: true
license: essay
---

## 前言

记得之前咕咕机很火的时候，因为囊中羞涩，从咸鱼上淘了不少二手票据机当作平替。一开始还要折腾各种驱动什么的，不过后来才知道，只要买到的是支持 POS 协议的票据机，就可以在 Linux 系统下可以通过命令行直接向票据打印机发送文本并打印，也可以通过 POS 指令控制打印的格式，非常方便且不需要安装任何驱动。

## 需求

正好平时经常需要关注一些网站的更新，这些网站的更新频率不高，但是错过之后会很麻烦，按照四象限法则来归类的话，这些都属于重要但不紧急的信息，比如考试报名、展览征集资讯这种。就我个人的经验而言，这类信息和平时普通的订阅混在一起的话会常常会被忽略掉，我经常希望以一种对现实生活介入性更高的推送方式，来推送这些重要但是不紧急而且容易被遗忘的信息。于是就有了用票据机来打印这类信息的想法。

网上也有很多相同思路的项目比如[这篇文章](https://aschmelyun.com/blog/i-built-receipt-printer-for-github-issues/)就实现了定时抓取 Github Issues 并打印为工单的功能。

## 为什么选择 Shell 而不是 python

我一开始也用 python 写过一版，需要配置运行环境不说，有的时候还要引入[ python-escpos ](https://python-escpos.readthedocs.io/en/latest/)库。<del class="block" title="你知道的太多了" datetime="20200124" ontouchstart=''>当然也可以选择不引用</del>因此后来就想着使用 Shell 去完成这种相对简单的任务，选择 Shell 还有个好处就是即便在 NAS 上也可以相对轻松地配置。

## 信息抓取

再来说说信息抓取这块，众所周知，国内大部分官方信息发布网站不提供 RSS 功能，这时候比较流行的办法就是使用[ RSSHub ](https://rsshub.app/)编写规则抓取并生成 RSS 地址。但是考虑到 RSSHub 需要部署，对于“抓取并推送”这种相对简单的需求来说，还是过于重了，而且还涉及到远端访问，会变得很麻烦。虽然也可以本地搭建 RSSHub 但是在我看来这么做违背了 RSSHub 项目的初衷。因此我另外写了一个不需要 RSS 源的脚本，只需要提供标题和正文的`CSS Path`就行。

## XML/HTML 解析

其实在解析 HTML 的时候，需要额外引入 xmllint 来解析，xmllint 是包含在 libxml2 里的命令行工具，考虑到不是所有的 Linux 发行版都能很方便地安装各种包 例如群晖，因此请教了 AI 并换成了一个叫做 [htmlq](https://github.com/mgdm/htmlq) 的项目，只需要在脚本里调用这个二进制程序就可以解析 HTML 代码。当然，如果你使用的是一个正常的 Linux 发行版，无论是出于安全性还是便利性的考虑，建议还是调用 xmllint 来解析。

说到字符串，自然绕不开编码的问题，编码对不上的话热敏票据机输出的就是一堆乱码。因此需要调用 iconv 转换编码。这个命令行工具更为常见，即便是群晖也可以通过[ SynoCommunity ](https://synocommunity.com/)里的[ SynoCli File Tools ](https://synocommunity.com/package/synocli-file/)包来安装，记得选择合适的架构。

## 配置及使用

先从[代码库](https://git.localhost.observer/dylan/PrintWatcher)拉取代码。直接下载还是`git clone`都可以。<del class="block" title="你知道的太多了" datetime="20200124" ontouchstart=''>几个小脚本就不用较真了吧</del>

配置部分很简单，假设你需要监视 RSS 地址，则使用`escpos-rss.sh`，将`escpos-rss.sh`中的初始变量替换为你实际需要的值:
```
RSS_URL="https://www.appinn.com/feed/"  # 替换为你的RSS源地址
LAST_CHECK_FILE="/volume2/Material/last_check.txt"  # 用于存储上次检查的时间戳
PRINTER_DEVICE="/dev/usb/lp0"  # 热敏打印机设备路径
```
修改完赋予运行权限然后写个计划任务定时运行就好了。

如果需要监视的网站没有 RSS 的话，就需要下载`escpos-web.sh`和`htmlq`，`escpos-web.sh`里需要修改的变量则是：
```
URL="https://www.appinn.com/feed/"  # 替换为你的RSS源地址
LAST_CHECK_FILE="/volume2/Material/last_check.txt"  # 用于存储上次检查的时间戳
PRINTER_DEVICE="/dev/usb/lp0"  # 热敏打印机设备路径
```
另外还需要修改第26行、第27行还有第49行的`CSS Path`以及需要截取的信息的位置，我代码库里就直接以实际的例子为示范了。修改完记得两个文件都赋予运行权限然后写个计划任务定时运行就好了。

## AI 书写代码

以上的 Shell 代码其实 80% 都是由 ChatGPT 完成的，包括整体的框架、Esc 指令的书写还有遇到死胡同时替代方案的选择。这块没啥好说的，网上的教程有不少，我也是在摸索之中，这里说一些自己的心得。

AI 书写代码其实具体来说是一个将自然语言翻译为具体编程语言的过程，并不是说随便说一个需求 AI 就可以给出一个方案。比较理想的方案是自己先对如何实现有个大致的概念，让 AI 给出一个大致的框架；再拆解流程，对各个流程进行验证、完善，通过对话不停修正；最后形成一个完整的程序。其中比较让人省心的一块是类似于正则式书写、Esc 指令书写这一类，都是 AI 擅长的环节。

这段时间很少更新博客，是因为大部分时间用来使用和学习 AI 上面了，有一些关于 AI 的思考，等想明白之后另写一篇。<del class="block" title="你知道的太多了" datetime="20200124" ontouchstart=''>又给自己挖了一个坑</del>