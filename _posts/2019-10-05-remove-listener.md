---
layout: post
title: JavaScript 事件解绑的坑
date: 2019-10-05
hidden: true
relate: code
comments: true
license: essay
---

**首先，必须承认这是我没有好好看文档的结果，赖不得别人。**  

## 起因

在移动端左右滑动来翻阅文章的时候，发现越滑越快越滑越快，到最后轻轻一碰文章就从头滚动到尾。起初以为是评论脚本加载过于耗费系统资源，导致一开始的滑动比较慢。于是我试着等页面全部加载完成再来测试，结果还是那样。

## 揪虫

一开始以为是变量没有清空，在结尾增加了一行变量归零的代码，无果。没办法，在执行滚动代码的后面加了`console.log()`输出变量来看看到底怎么回事，结果发现，随着触屏次数的增加，同一时间内返回的元素滚动变量的次数也在增加。也就是说触屏十次往上之后，会同时返回十个相同数值的变量，于是页面元素就会十倍速的滚动。<del class="block" title="你知道的太多了" datetime="20191005" ontouchstart=''>しにたい X﹏X</del>这样基本上把问题定位在了事件侦听上了，应该是最后事件解绑失败，然后重复增加事件侦听，怪不得后来的滚动在起飞中带着一丝卡顿……一个页面元素绑定了几十个事件。  

## 解决

以“JavaScript 事件解绑”为关键词搜索， Google 第一个结果就是这篇[《 javascript - js取消事件綁定 - SegmentFault 思否 》](https://segmentfault.com/q/1010000009057541s)，***原来匿名函数是不可以被解绑的,所以只能解除具名函数***。<del class="block" title="你知道的太多了" datetime="20191005" ontouchstart=''>想想也是，要是能解绑匿名函数，天知道你要解绑哪个函数。</del>多话不说，直接上代码更清楚明了。  

**这是一开始的错误代码**
```
reader.addEventListener('touchstart',function(event){
    reader.addEventListener('touchmove',function(event){
        ………………
    });
    reader.addEventListener('touchend',function(event){
        reader.removeEventListener('touchmove', null);
        reader.removeEventListener('touchend', null);
    })
});
```
**这是后来参照标准文档改过的代码**
```
reader.addEventListener('touchstart',touchMove, false);
function touchMove (event) {
    reader.addEventListener('touchmove',touchScroll, false);
    function touchScroll(event) {
        ………………
    };
    reader.addEventListener('touchend',cleanListener, false);
    function cleanListener(event) {
        reader.removeEventListener('touchmove',touchScroll, false);
        reader.removeEventListener('touchend',cleanListener, false)
    }
};
```
  
## 吐槽

近期应该不会再去修改相关代码了<del class="block" title="你知道的太多了" datetime="20191005" ontouchstart=''>flag</del>，新的代码片段随后会放在 Gist Github 上供大家吐槽。  
最后在这里还是想吐槽一下 JavaScript 代码的调试，事件解绑失败你好歹也给个 Warning 什么的，啥都没有就也若无其事地跑起来了。(ノ｀Д)ノ<del class="block" title="你知道的太多了" datetime="20191005" ontouchstart=''>强行甩锅</del>  

## 参考

下面这些文章虽然没有直接帮到我，但是也或多或少地对我有些启发，在此表示感谢。
- [事件绑定及解除事件绑定 - 掘金](https://juejin.im/post/5ae289faf265da0b80707524)
- [关于IOS设备window.onscroll滚动条滚动事件不触发的问题 – 赵昊鹏的博客](http://blog.hooperui.com/%E5%85%B3%E4%BA%8Eios%E8%AE%BE%E5%A4%87window-onscroll%E6%BB%9A%E5%8A%A8%E6%9D%A1%E6%BB%9A%E5%8A%A8%E4%BA%8B%E4%BB%B6%E4%B8%8D%E8%A7%A6%E5%8F%91%E7%9A%84%E9%97%AE%E9%A2%98/)
- [10-移动端开发教程-移动端事件 - FlyDragon - 博客园](https://www.cnblogs.com/fly_dragon/p/8663609.html)
