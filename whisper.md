---
layout: social
title: Whisper
permalink: /whisper/
hide: Y
---
<!-- 晴天说说_v1.11 2019-05-18 星球彦 http://storeweb.cn -->
<br>
这些说说是来自<a href="http://storeweb.cn" target="_blank" class="site-friend-link-homepage">个站商店</a>的一个子项目 <a
        href="http://storeweb.cn" target="_blank" class="site-friend-link-project">『天晴说说』</a>，点<a href=""
                                                                                                  target="_blank"
                                                                                                  class="site-friend-link-homepage">
    这里 </a>访问我在个站商店上的主页
<br>
<br>
<br>
<!-- ----------------------------------- 配置 --------------------------------------- -->
<!-- HTTPS 加载此jquery：-->
<script src='https://libs.baidu.com/jquery/1.11.1/jquery.min.js'></script>
<!-- ----------------------------------- 配置 --------------------------------------- -->
<style type="text/css">
    .hide {
        display: none !important;
    }
    .clear {
        clear: both;
    }
    .storeweb-say>div.say-container {
        margin-top: 10px;
        margin-bottom: 25px;
        padding: 10px 20px;
        background-color: #fafafa;    /*#bed742*/
        border-radius: 6px;
        font-size: 15px;
        color: #d93a49 !important;    /*#2e3a1f*/
        line-height: 200%;
        border: 1px #ccc solid;
    }
    .storeweb-say-month {
        font-size: 30px;
    }
    .storeweb-say-day {
        font-size: 18px;
    }
    .storeweb-say-name {
        font-size: 18px;
        margin-left: 20px;
        color: #333 !important;
    }
    .say-container>img {
        margin-top: 16px;
    }
    .storeweb-say-name:hover {
        color: #0074d9 !important;
        text-decoration: underline;
    }
    .is_member_others{
        color: #d71345 !important;
    }
    .primary {
        border: none;
        background-color: #467B96 !important;
        cursor: pointer;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
        border-radius: 2px;
        color: #FFF !important;
    }
    .btn {
        border: none;
        background-color: #E9E9E6 !important;
        cursor: pointer;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
        border-radius: 2px;
        display: inline-block;
        padding: 4px 12px;
        height: 34px;
        color: #666 !important;
        vertical-align: middle;
        zoom: 1;
    }
    .btn:hover {
        background-color: #666 !important;
        color: #E9E9E6 !important;
    }
</style>
<script data-no-instant>
    // ----------------------------------- 配置 ---------------------------------------
    //var url = "https://storeweb.cn/api/say";  // 如果你的网站是HTTPS，则用这一行代码
    var url = "https://storeweb.cn/api/say";     // 如果你的网站是HTTP
    // ----------------------------------- 配置 ---------------------------------------
    function get_say_api(timeout) {
        $.ajax({
            type: 'get',
            url: url,
            async: true,
            dataType: 'jsonp',
            data: {},
            timeout: 3000,
            success: function (result) {
                if (result.success == 1) {
                    //console.log(success['data']);
                    template_make(result.data, result.information);
                    set_storeweb_info(result.information);
                    set_pagiation_button(result.pagination);
                } else {
                    $('.site-friend-link').html(result.info);
                }
            },
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                    if (timeout == 1) {
                        $('.storeweb-say').html('获取数据超时……请联系个站商店小彦');
                    } else {
                        url = "http://storeweb.cn/api/say";
                        $('.storeweb-say').html('https 获取数据超时……尝试http获取……');
                        get_say_api(1);
                    }
                }
            }
        });
    }
    $(function () {
        $('.storeweb-say').html('正在向『个站商店』请求友链数据……');
        get_say_api(0);
    })
    function template_make(data, information) {
        //console.log(data)
        $('.storeweb-say').html('');
        $.each(data, function (key, value) {
            //console.log(value.name);
            var template = $('#say-template').text();
            template = template.replace('%%content%%', value.content);
            template = template.replace('%%name%%', value.member.name);
            template = template.replace('%%month%%', value.create_at_month);
            template = template.replace('%%day%%', value.create_at_day);
            template = template.replace('%%is_member_others%%', value.is_member_others);
            template = template.replace('%%image_cn%%', value.image_cn);
            if(value.url == ""){
                template = template.replace('%%url%%', '');
                template = template.replace('%%say-url%%', 'hide');
            }else{
                template = template.replace('%%url%%', value.url);
                template = template.replace('%%url%%', value.url);
                template = template.replace('%%say-url%%', '');
            }
            var template_id = $(template);
            $('.storeweb-say').append(template_id);
        })
    }
    function set_storeweb_info(information) {
        $('.site-friend-link-homepage').attr('href', information['homepage']);
        $('.site-friend-link-project').attr('href', information['project']);
        //$('.site-friend-link-storeweb').attr('href',information['storeweb']);
    }
    function submit_pagination(url_button) {
        $('.storeweb-say').html('正在向『个站商店』请求友链数据……');
        url = url_button;
        get_say_api(0);
    }
    function set_pagiation_button(pagination){
        var template = $('#say-pagination-template').text();
        if(pagination.prev_page_url){
            template = template.replace('%%prev_page_url%%', pagination.prev_page_url);
            template = template.replace('%%say-button-prev%%', '');
        }else{
            template = template.replace('%%prev_page_url%%', '');
            template = template.replace('%%say-button-prev%%', 'hide');
        }
        if(pagination.next_page_url){
            template = template.replace('%%next_page_url%%', pagination.next_page_url);   
            template = template.replace('%%say-button-next%%', '');
        }else{
            template = template.replace('%%next_page_url%%', '');
            template = template.replace('%%say-button-next%%', 'hide');
        }
        var template_id = $(template);
        $('.storeweb-say').append(template_id);
    }
</script>
<div class="clear"></div>
<div class="storeweb-say">
</div>

<script type="text/html" id="say-template" data-no-instant>
    <span class="storeweb-say-month">%%month%%</span> <span class="storeweb-say-day">%%day%%</span> <span class="storeweb-say-name %%is_member_others%%">%%name%%</span>
    <div class="say-container">
        <div class="say-contant">%%content%%</div>
        <a href="%%url%%" target="_blank" class="%%say-url%%">%%url%%</a>
        <img src="%%image_cn%%">
    </div>
</script>

<script type="text/html" id="say-pagination-template" data-no-instant>
    <div class="say-pagination">
        <a href="Javascript:submit_pagination('%%prev_page_url%%')" class="btn primary left %%say-button-prev%%"><< 较新的一页</a>
        <a href="Javascript:submit_pagination('%%next_page_url%%')" class="btn primary right %%say-button-next%%">之前的一页 >></a>
    </div>
</script>
<div class="clear"></div>