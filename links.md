---
layout: page
title: Links
permalink: /links/
comments: true
---

##  友善的邻居们


- <a href="http://pengqiqi.com" target="_blank">Patrick@NUA</a> by @PatrickPeng
- <a href="https://chunqiu.bighu.cn" target="_blank">曹说春秋</a>
- <a href="https://orewa.money" target="_blank">マネーのブログ</a>
<div style = "text-align:center">
Author | Website
:----: | :-----:
@PatrickPeng | <a href="http://pengqiqi.com" target="_blank">Patrick@NUA</a>
BigHu | <a href="https://chunqiu.bighu.cn" target="_blank">曹说春秋</a>
Money | <a href="https://orewa.money" target="_blank">マネーのブログ</a>
<a href="https://hesay.me/about/" target="_blank">indes</a> | <a href="https://hesay.me" target="_blank">缄默泄漏</a>
</div>
<h3 style="text-align: right"> 互勉 </h3>

<!-- 动态显示网站运行时间 -->
<script type="text/javascript" language="javascript">
	function secondToDate(second) {
		if (!second) {
		return 0;
		}
		var time = new Array(0, 0, 0, 0, 0);
		if (second >= 365 * 24 * 3600) {
		 time[0] = parseInt(second / (365 * 24 * 3600));
		 second %= 365 * 24 * 3600;
		}
		if (second >= 24 * 3600) {
		 time[1] = parseInt(second / (24 * 3600));
		 second %= 24 * 3600;
		}
		if (second >= 3600) {
		 time[2] = parseInt(second / 3600);
		 second %= 3600;
		}
		if (second >= 60) {
		 time[3] = parseInt(second / 60);
		 second %= 60;
		}
		if (second > 0) {
		 time[4] = second;
		}
		return time;
	}
    function setTime2() {
        var create_time2 = Math.round(new Date(Date.UTC(2011, 05, 15, 21, 40, 0)).getTime() / 1000);
        var timestamp2 = Math.round((new Date().getTime() + 8 * 60 * 60 * 1000) / 1000);
        currentTime2 = secondToDate((timestamp2 - create_time2));
        currentTimeHtml2 = '距离第一篇文章发布' + currentTime2[0] + '年' + currentTime2[1] + '天' + currentTime2[2] + '时' + currentTime2[3] + '分' + currentTime2[4] + '秒';
        document.getElementById("htmer_time2").innerHTML = currentTimeHtml2;
    }
    function setTime() {
        var create_time = Math.round(new Date(Date.UTC(2019, 05, 28, 0, 0, 0)).getTime() / 1000);
        var timestamp = Math.round((new Date().getTime() + 8 * 60 * 60 * 1000) / 1000);
        currentTime = secondToDate((timestamp - create_time));
        currentTimeHtml = '本站已运行' + currentTime[0] + '年' + currentTime[1] + '天' + currentTime[2] + '时' + currentTime[3] + '分' + currentTime[4] + '秒';
        document.getElementById("htmer_time").innerHTML = currentTimeHtml;
    }
    setInterval(setTime, 1000);
    setInterval(setTime2, 1000);

</script>

<span id="htmer_time" style="color: #656c7a;display: flex;align-items: center;justify-content: center;">  </span>
<span id="htmer_time2" style="color: #656c7a;display: flex;align-items: center;justify-content: center;">  </span>