---
layout: post
title: moe-counter-cf 安装手记
date: 2023-12-04
hidden: true
relate: code
comments: true
license: essay
---

## 前言

目前我能找到的教程基本上都是照搬官方文档那几行少得可怜的部署方法，并不是非常明确，第一次接触 Cloudflare Worker 项目部署的人未必能成功。所幸在[吕楪](https://toot.irithys.com/@thy)推荐了一篇比较全面的[安装指南](https://champhoon.xyz/note/moe-counter-cf/)，配置文件这块可以参考一下。关于获取 KV 的 preview_ids 可以参考[这里](https://stackoverflow.com/questions/63332306/what-are-cloudflare-kv-preview-ids-and-how-to-get-one)。

## 一些小问题

虽然上面提到的文章很全面，但是由于 Cloudflare Workers 的命令行部署工具 Wrangler-CLI 的迭代更新，在实际部署这一块还是有些小问题需要注意。

首先，并不建议将项目 fork 之后在自己的仓库里修改，我在 GitHub 上搜索的时候经常会看到有人把自己的参数公开，会有一些隐患。建议还是将项目拖到本地之后修改参数、编译发布。

另外在文章里提到的`npm i @cloudflare/wrangler -g`之前，还需要再跑一句`pnpm install`来安装依赖，这些依赖里还包括了 wrangler 的旧版本。

## 运行项目内指定版本的 wrangler

截至目前 wrangler 的版本是`3.17.1`，与项目内自带的`1.19.12`已经有了很大区别，如果强行用新版本编译发布的话就会出现各种报错。所以我们需要使用`npx wrangler publish`这行命令来进行部署。至于登录验证这块，笔者没有实际试验过，理论上讲，只要将命令替换为`npx wrangler login`就可以了。各位读者可以尝试一下，将结果留言在评论区。

## 其它

各种`moe-counter-cf`的实现，我附在最后面大家都可以试试。

- [moe-counter-cf：将萌萌计数器部署到 Cloudflare Workers](https://champhoon.xyz/note/moe-counter-cf/#%E9%85%8D%E7%BD%AE-moe-counter-cf)
- [What are cloudflare KV preview_ids and how to get one?](https://stackoverflow.com/questions/63332306/what-are-cloudflare-kv-preview-ids-and-how-to-get-one)
- [D1 作为数据库的 moe-counter-cf](https://github.com/SunDoge/moe-counter-cf/)
- [Upstash 作为数据库的 moe-counter-cf](https://github.com/kotx/moco/)
- [神圣时间线上的 moe-counter](https://github.com/journey-ad/Moe-Counter)
- [Python 版 moe-counter](https://github.com/RTAkland/MoeCounter)