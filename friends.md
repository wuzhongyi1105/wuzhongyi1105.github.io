---
layout: social
title: Friends
permalink: /friends/
---

<div>
            下面這些友情連結是來自<a href="http://storeweb.cn" target="_blank" class="site-friend-link-project">个站商店</a>站長所開發的的一個子项目 <a href="http://storeweb.cn" target="_blank" class="site-friend-link-project">『小红帽友链』</a>這是<a href="" target="_blank" class="site-friend-link-homepage"> 我的主頁 </a>歡迎大家訪問<br>
			說實話能想到做一個博客站長的聚合平臺並做到如此地步，實在是令人佩服，非常感謝<a href="https://storeweb.cn/member/one/1" target="_blank">小彦</a>站長為此做出的努力<br>
			PS：因為也有不少朋友也在這個平臺上，所以下面的連結可能和上方的連接有重複。
</div>
<script src='https://libs.baidu.com/jquery/1.11.1/jquery.min.js'></script>
<style type="text/css">
    .hide {
        display: none;
    }
    .clear {
        clear: both;
    }
    .site-friend-link {
        margin-bottom: 20px;
        overflow: hidden;
    }
    .site-friend-link div {
        position: relative;
        float: left;
        width: 200px;
        margin: 8px 8px;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid rgba(0,0,0,.05);
        box-shadow: 0 1px 4px rgba(0,0,0,.04);
        overflow: visible;
        min-height: 65px;
    }
    .site-friend-link-image {
        float: left;
        width: 50px;
        border-radius: 25px;
    }
    .site-friend-link-name {
        width: calc(100% - 50px);
        text-align: left;
        padding-left: 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .site-friend-link-into {
        width: calc(100% - 50px);
        text-align: left;
        padding-left: 10px;
        color: #999;
        margin-top: 4px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 12px;
    }
    .site-friend-link-count {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 16px;
        height: 16px;
        border-radius: 8px;
        background-color: #ff7d1e;
        color: white !important;
        font-size: 10px;
        padding-left: 5px;
    }
</style>
<script data-no-instant>
    // ----------------------------------- 配置 ---------------------------------------
    var url = "https://storeweb.cn/api/friend_link";  // 如果你的网站是HTTPS，则用这一行代码
    //var url = "http://storeweb.cn/api/friend_link";     // 如果你的网站是HTTP
    var logo_size = 1; // 1 == 小图 2 ==大图
    // ----------------------------------- 配置 ---------------------------------------
    function get_friend_link_api(timeout) {
        $.ajax({
            type: 'get',
            url: url,
            async: true,
            dataType: 'jsonp',
            data: {
                size: logo_size
            },
            timeout : 3000,
            success: function (success) {
                if (success['success'] == 1) {
                    //console.log(success['data']);
                    template_make(success['data']);
                    set_storeweb_info(success['information']);
                } else {
                    $('.site-friend-link').html(success['info']);
                }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                if(status=='timeout'){//超时,status还有success,error等值的情况
                    if(timeout==1){
                        $('.site-friend-link').html('获取数据超时……请联系个站商店小彦');
                    }else {
                        url = "http://storeweb.cn/api/friend_link";
                        $('.site-friend-link').html('https 获取数据超时……尝试http获取……');
                        get_friend_link_api(1);
                    }
                }
            }
        });
    }
    $(function () {
        $('.site-friend-link').html('正在向『个站商店』请求友链数据……');
        get_friend_link_api(0);
    })
    function template_make(data) {
        //console.log(data)
        $('.site-friend-link').html('');
        $.each(data, function (key, value) {
            //console.log(value.name);
            var template = $('#links-template').text();
            template = template.replace('%%name%%', value.name);
            template = template.replace('%%logo_cn%%', value.logo_cn);
            template = template.replace('%%intro_link%%', value.intro_link);
            template = template.replace('%%domain%%', 'http://' + value.domain);
            template = template.replace('%%update_count%%', value.update_count);
            if (value.update_count == 0) {
                template = template.replace('%%update_hide%%', 'hide');
            } else {
                template = template.replace('%%update_hide%%', 'F');
            }
            var template_id = $(template);
            $('.site-friend-link').prepend(template_id);
        })
    }
    function set_storeweb_info(information) {
        $('.site-friend-link-homepage').attr('href', information['homepage']);
        $('.site-friend-link-project').attr('href', information['project']);
        //$('.site-friend-link-storeweb').attr('href',information['storeweb']);
    }
</script>
<div class="clear"></div>
<div class="site-friend-link">
</div>
<script type="text/html" id="links-template" data-no-instant>
    <div>
        <a class="site-friend-link-count %%update_hide%%">
            %%update_count%%
        </a>
        <img class="site-friend-link-image"
             src="%%logo_cn%%"/>
        <a class="site-friend-link-name"
           href="%%domain%%" target="_blank">
            %%name%%
        </a>
        <span class="site-friend-link-into">%%intro_link%%</span>
    </div>
</script>
<div class="clear"></div>
		
<hr style="margin: 2em 0 2em 0;border: 0;border-top: 1px solid rgba(0,0,0,.1);">