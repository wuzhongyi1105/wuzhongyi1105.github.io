---
layout: post
title: 部署 Artalk 評論系統
date: 2025-01-22
hidden: true
relate: code
comments: true
license: essay
---

## 前言

要說的東西都在[這裡](https://blog.dylanwu.space/2025/01/22/the-achilles-heel-of-static-blogs.html)了

## 部署

Artalk 的[📦 部署文檔](https://artalk.js.org/zh/guide/deploy.html)說得夠詳細了，不贅述。

## 遷移

Artalk 的[🛬 遷移文檔](https://artalk.js.org/zh/guide/transfer.html)同樣的，很詳盡，不贅述。

## 小撇步

這裡著重要說的是 [avatarURLBuilder](https://artalk.js.org/zh/guide/frontend/config.html#avatarurlbuilder)
 是用於頭像鏈接的，可以玩很多個性化的設置。靈感來自於[這篇博文](https://www.richarvin.com/artalk-zi-tuo-guan-ping-lun-xi-tong-da-jian-yu-pei-zhi/#博客引入组件)

```
avatarURLBuilder: (c) => {  // 自定义头像URL生成器函数
    if (c.is_admin) {
      return "管理员头像 URL";  // 如果是管理员，使用指定的管理员头像URL
    }
    return `https://cravatar.cn/avatar/${c.email_encrypted}`;  // 否则，使用加密的邮箱生成Gravatar头像URL
  }
})
```
`https://cravatar.cn/avatar/${c.email_encrypted}`这里可以换成固定链接，就可以为自己设置头像而无需从 Gravatar 获取头像。也可以通过比对`{{nick}}`来为特定用户比如交换了友链的笔友们指定头像。
```
if (c.nick == "山月") {
  return `https://uploads.disquscdn.com/images/2412160f720b88e8e7fd35fb12e799de5ad521d86b164683d3ff79a20b233d78.png`;
}
```

由於 Disqus 導出數據時不包含`email`字段，在導入 Artlak 時就默認是`anonymous@example.org`也就是說可以根據這個郵箱地址篩選出所有的丟失郵箱信息的用戶。但是不知道為什麼明明有`{{email}}`這個變量，卻無法判定，懶得去深究，直接通過獲取`{{email_encrypted}}`來替代，因為二者一一對應。
```
if (c.email_encrypted == "fc8474cbaab2d6405ad637fd26c600da949f772781d75d53f310543acda36ba2") {
  return `https://api.multiavatar.com/${c.nick}.png`;
}
```
這裡的`fc8474cbaab2d6405ad637fd26c600da949f772781d75d53f310543acda36ba2`就是`anonymous@example.org`對應的`{{email_encrypted}}`。

[Multiavatar](https://multiavatar.com/) 則是一個隨機頭像生成器，免費開源，總共可生成 120 億個密碼學上獨一無二的頭像。打開 [Multiavatar](https://multiavatar.com/) 網站，就會隨機生成一個頭像，如果在網址後面加上內容，就會生成固定的頭像。也有 API 可以調用，類似於這樣`https://api.multiavatar.com/${c.nick}.png`。但是需要注意 Multiavatar API 限制為 20 次/分鐘，有概率評論列表用戶頭像獲取不全。<del class="block" title="你知道的太多了" datetime="20250122" ontouchstart=''>但是總比一片默認頭像好吧</del>

通過 [avatarURLBuilder](https://artalk.js.org/zh/guide/frontend/config.html#avatarurlbuilder) 結合不同的變量，可以有很多玩法，大家可以發揮想象力，變量可以參考[這裡。]
(https://github.com/ArtalkJS/Artalk/blob/64a2adbe1a421ffb018bde93ffb16e4070decf42/docs/docs/zh/guide/backend/email.md?plain=1#L127)

## reference
- <a href="https://artalk.js.org/zh/guide/intro.html" target="_blank">Artalk 官方文檔</a>
- <a href="https://www.richarvin.com/artalk-zi-tuo-guan-ping-lun-xi-tong-da-jian-yu-pei-zhi/" target="_blank">Artalk 自托管评论系统搭建与配置</a>
- <a href="https://kunkunyu.com/archives/1694944308388" target="_blank">安装配置 Artalk 评论</a>