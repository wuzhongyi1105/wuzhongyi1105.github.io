---
layout: page
title: Links
permalink: /links/
comments: true
---

##  友善的邻居们


- [Patrick@NUA](http://pengqiqi.com)
- [曹说春秋](https://chunqiu.bighu.cn)
- [マネーのブログ](https://orewa.money)


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
    function setTime() {
        var create_time = Math.round(new Date(Date.UTC(2019, 06, 28, 0, 0, 0)).getTime() / 1000);
        var timestamp = Math.round((new Date().getTime() + 8 * 60 * 60 * 1000) / 1000);
        currentTime = secondToDate((timestamp - create_time));
        currentTimeHtml = '本站已安全运行' + currentTime[0] + '年' + currentTime[1] + '天' + currentTime[2] + '时' + currentTime[3] + '分' + currentTime[4] + '秒';
        document.getElementById("htmer_time").innerHTML = currentTimeHtml;
    }
    function setTime2() {
        var create_time = Math.round(new Date(Date.UTC(2011, 05, 15, 0, 0, 0)).getTime() / 1000);
        var timestamp = Math.round((new Date().getTime() + 8 * 60 * 60 * 1000) / 1000);
        currentTime = secondToDate((timestamp - create_time));
        currentTimeHtml = '距离第一篇文章发布' + currentTime[0] + '年' + currentTime[1] + '天' + currentTime[2] + '时' + currentTime[3] + '分' + currentTime[4] + '秒';
        document.getElementById("htmer_time2").innerHTML = currentTimeHtml;
    }
    setInterval(setTime, 1000);
    setInterval(setTime2, 1000);

</script>

<span id="htmer_time" style="color: #656c7a;display: flex;align-items: center;justify-content: center;">  </span>
<span id="htmer_time2" style="color: #656c7a;display: flex;align-items: center;justify-content: center;">  </span>