---
layout: post
title: 靜態博客的『阿喀琉斯之踵』
date: 2025-01-16
comments: true
license: essay
---

最近終於下定決心遷移博客的評論系統，實際操作過後我的建議是***早換，別偷懶***

## 問題

六年前部署博客的時候，為了穩定和偷懶，就選擇了 Disqus 和 Disqus PHP API 的組合，當時使用起來體驗很不錯，國內國外的訪問和留言都無縫銜接。但是後來事情很快開始起變化，一開始是別人在 Disqus 里的評論我開始接收不到郵件提醒了，通過 Disqus PHP API 評論的郵件提醒是正常的，因為是我單獨配置的。然後很多 Spam 開始陸陸續續通過 Disqus PHP API 進入評論列表，可能是 Disqus 對這塊沒有審核。

再說說這個 Disqus 的 Spam 算法，我在這次遷移中發現，有很多正常評論被扔在 Spam 里，這就更離譜了。我仔細看了一下被判定為 Spam 的評論，發現 Disqus 算法其實很偷懶（甚至不知道有沒有上算法），只要評論裡面帶超鏈接🔗就會被扔進 Spam 里，關鍵的是進了 Spam 也沒有提示，到後來更過分，連有新評論都不發郵件了。這裡得對過去留言沒有得到回復的讀者說聲抱歉。

Disqus 雖然說支持數據導出，但是數據導出的時候並不帶`email`字段，這就相當於在遷移評論系統之後就跟留下評論的人失聯了，當然這也是出於用戶的隱私考量，沒什麼好詬病的，如果對訪客互動這塊比在意，建議還是盡早遷出，及時止損。缺失`email`字段還會導致另一個後果：大部分評論系統都是通過郵箱地址從 gavatar 來獲取用戶頭像，沒有郵箱地址，不僅和以往的訪客失聯，而且評論頁都是清一色的默認頭像，觀感上很不好。

Disqus 還有一些其它問題我沒發現，可以參照[這裡](https://blog.einverne.info/post/2021/10/replace-disqus-with-remark42.html#问题)

對於email字段缺失導致的這兩個問題，我現在的解決方案就是，回復評論的同時也在 Disqus 上回復一遍，順便附上更新評論系統的通知（希望不要被判定成 Spam ），有條件通過別的聯繫方式聯繫上的就挨個通知。至於頭像獲取，這篇具體的部署記錄有一個[折衷方案](https://blog.dylanwu.space/2025/01/22/deploy-artalk-comment-system.html#小撇步)可以供參考。總體的思路就是通過獲取用戶名相關字段，並提交給[Multiavatar](https://multiavatar.com/)的API接口，為每個用戶生成獨特的頭像。同時還可以判斷用戶名來指定頭像，我給互換了友鏈的筆友們都設置了固定的頭像。

## 替代

對於靜態博客的原教旨主義者來說，評論系統這種簡直就是對“靜態”的反動。當然也有 [Staticman](https://staticman.net/) 這種將評論系統的評論拆分成純文本的數據，提交到靜態博客的項目中，當用戶發起評論後會自動提交一個 commit，或者發起一個 Pull Request 將內容保存下來。但是這個項目目前只支持 Github 和 Gitlab 的登錄驗證，一來不符合國情，二來我也不願意過於依賴商業公司的項目。另外還有一點，[Staticman](https://staticman.net/) 的郵件通知只支持 [Mailgun](https://www.mailgun.com/) 服務，這也是我不太能接受的點。說不定等到以後他能支持自建的 Git 倉庫和郵件接口我會再考慮一下。也許有可能通過兼容 Github 和 Mailgun 的接口的開源實現，但是並不太想去搞了，等到以後放棄 Github Page 再研究吧。最關鍵的一點是， [Staticman](https://staticman.net/) 雖然號稱純靜態，但是依然需要在服務器上跑一個進程，這就和一般的評論系統沒什麼區別了。

其他的幾個項目大同小異可以參照[這裡](https://blog.einverne.info/post/2021/10/replace-disqus-with-remark42.html#disqus-代替品)。我最後選擇了 [Artalk](https://artalk.js.org/) ，沒有什麼特別的原因，純粹是我對於單一 Go 語言程序 + SQLite 這種易於維護的架構有好感而已，當然文檔詳盡也是原因之一。部署記錄放在[另一篇文章](https://blog.dylanwu.space/2025/01/22/deploy-artalk-comment-system.html)里了。

## 總結

總之，還是再一次地要對過去留言沒有得到及時回復的讀者道個歉，用心的留言卻沒有得到回復這種事想想都覺得難受。這篇文章也算是評論系統遷移的一個公告，也希望曾經訪問過、留言過的讀者可以在这里留言聯繫我，更改一下郵箱地址。

## reference

- <a href="https://blog.einverne.info/post/2021/10/replace-disqus-with-remark42.html" target="_blank">使用 Remark42 替换博客的 Disqus 评论系统</a>
- <a href="https://darekkay.com/blog/static-site-comments/" target="_blank">Various ways to include comments on your static site</a>