---
layout: post
title: Soapbox-fe 安装手记
date: 2022-10-10
hidden: true
relate: code
comments: true
license: essay
---

## 前言

目前我能找到的[安装指南](https://kwaa.dev/pleroma)都是基于 [Rebase（Soapbox-be）](https://gitlab.com/soapbox-pub/rebased) + [Soapbox-fe](https://gitlab.com/soapbox-pub/soapbox) 去部署的，而且都是通过源码 Source 部署，比较麻烦不说，Rebased 这个分支往后的开发能不能跟进也是一个问题。还有一些教程需要通过 nginx 新增一个虚拟主机去托管前端，依然比较麻烦，还不如托管到 Vercel 上。看起来 OTP 部署这块鲜有人提到，想通过 Admin-fe （Pleroma 的后台管理界面）里 Fontend 配置项进行安装就有些无从下手了。
正好趁着这段时间更换域名、重建实例的时候，琢磨了一个可以通过 Admin-fe 来配置前端的方法。

**目前因为 Admin-fe 还有一个无法下载前端的 [Bug](https://git.pleroma.social/pleroma/pleroma/-/issues/2920) 所以还是要跑一下命令行，等到这个 Bug 修复之后，我再来补全文章，到时候可以直接在后台界面里安装前端。**

## 步骤

首先是安装前端，进入命令行之后切到 Pleroma 的文件夹，如果按照官方 OTP 安装教程的话，路径应该是`/opt/pleroma`

```
su pleroma -s $SHELL -lc "./bin/pleroma_ctl frontend install soapbox-fe --ref dev --build-url https://gitlab.com/soapbox-pub/soapbox/-/jobs/artifacts/develop/download?job=build-production"
```

具体参数解释，请参考[官方文档](https://docs-develop.pleroma.social/backend/administration/CLI_tasks/frontend/)。

这里需要注意的是`--ref`参数，这里是标记同一个前端的不同版本，让开发人员能够便利地更新前端代码，这个参数决定着前端文件的存储位置，按照`${instance_static}/frontends/${name}/${ref}`这个路径存储。比如上面这个命令里，Soapbox-fe 将会存储在`${instance_static}/frontends/soapbpx-fe/dev`这个文件夹里。
运行命令时，就算不需要区分版本也一定要有这个参数，不然不会下载成功且不会报错，需要注意。

然后进入 Admin-fe 后台，Settings-Frontend-Primary，然后`name`填`soapbox-fe`、`Reference`填`dev`，提交完，重新打开实例网站就可以看到已经切换成功了。

## 其它

另外几个 Pleroma 官方提到的 Frontends 安装方式应该跟上面提到的差不多，有的看上去也很不错，不过开发进度堪忧就是了。另外，Primary 下面还有个 Available 块，有兴趣的朋友可以配置试试看。

## 参考

下面这些文章虽然没有直接帮到我，但是也或多或少地对我有些启发，在此表示感谢。
- [Managing frontends - Pleroma Documentation](https://docs-develop.pleroma.social/backend/administration/CLI_tasks/frontend/)
- [Installing Soapbox - Soapbox](https://soapbox.pub/install/)
