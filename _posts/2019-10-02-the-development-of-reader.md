---
layout: post
title: 记两个竖排模式下的坑
date: 2019-10-02
hide: Y
relate: code
comments: true
license: essay
---

## 开发笔记

其实这根本称不上什么开发，只是参考一些现成的案例，结合 JavaScript 的一些现成的函数以一种很拙劣的方式拼凑在一起了而已，更主要的是解决自己的一些需求。更何况现在 TypeScript 才是显学，之前开发[我在用的这款主题](https://github.com/tategakibunko/jekyll-nehan)的[日本开发者](https://github.com/tategakibunko)也早就转用 TypeScript 了。我由于并不想花太多时间去学一个需要编译的前端语言，所以就秉持着“又不是不能用”的开发哲学来重写这个竖排阅读器，尽管如此也还是被一些前端的坑坑到了，连续熬夜两天才完成，现在就把这些坑记录下来，以示后来者。  

### Element.scrollLeft

Element.scrollLeft 属性可以读取或设置元素滚动条到元素左边的距离，理论上的兼容性非常好。<del class="block" title="你知道的太多了" datetime="20191002" ontouchstart=''>其实并不</del>然而，单这一个属性就带出来两个坑。  
首先，在除了 Chrome 的所有浏览器里，如果文字阅读顺序是从左到右的话，要想拖动滚动条，`Element.scrollLeft`的值应该是负值。换句话说，你如果想通过给`Element.scrollLeft`赋值来滚动视图呢，在 Chrome 里应该赋正值，而其他的浏览器都应该赋负值，这其实都还好，用函数判断一下是不是 Chrome 就好。  

但是呢，如果你想通过取值来获取剩余的滚动宽度呢，问题就来了， Safari 的逻辑是，负值统统记零，MDN里也确实提到了这个，这就导致 Safari 里一个`writing-mode: vertical-rl;`的`<div>`，其`Element.scrollLeft`始终为`0`对，跟网上说的`overflow`的属性是`hidden`还是`scroll`没有任何关系。<del class="block" title="你知道的太多了" datetime="20191002" ontouchstart=''>本当お可愛いこと</del>  

另外值得一提的是，根据国外网友的反馈，jQuery 似乎同样也会被受这个因素的影响，不过反正我也不用 jQuery ，那就留待别人去验证吧。

因此，虽然兼容性列表里这个属性是全兼容，但是由于这个原因，基本上这个的取值是不可信的。这样的话，就无法通过`Element.scrollLeft`得知剩余的文章宽度。  

要正常获取这个值的话，只能再在`<article>`里再套一个`<div>`，然后计算这个两个元素左边框的距离，我这里用的办法是去两个元素左边框到屏幕左边的值，然后相减就可以得到还剩余滚动条的宽度。

### 浏览器内核识别

上文提到需要判断浏览器版本，其实这也是个蛮麻烦的事情，网上流传较广的一些文章的思路大体都是通过获取`User Agent`来判断浏览器内核版本，然而在实际运用中这种方法局限性很大且不靠谱，<del class="block" title="你知道的太多了" datetime="20191002" ontouchstart=''>比如跑着 Webkit 内核的 iOS 版 Chrome </del>由于上文提到的原因，浏览器的内核直接关系到这个阅读器能否正常工作，所以我需要一种非常靠谱的方法来识别内核。好在我只需要判断是否为 Chromium 内核即可，以此为关键字搜索之后了解到可以用`window.chrome`来判断。

### 总结

前端的工作是真的辛苦，特别是要兼顾一些属性完全相悖的浏览器内核，以及同名不同内核的浏览器。我以前不是很理解为什么连做一个像博客这样的小项目都要用框架和库，现在我多多少少能理解了，因为这里面很多工作完全是没有必要而且不可理喻的。<del class="block" title="你知道的太多了" datetime="20191002" ontouchstart=''>当初不走这条路果然是对的</del>不过呢，根据自己的需求解决了这些问题之后的感觉还真的是有点儿小开心呢。  

前面也说过了，这根本称不上什么开发，只是参考 MDN 的文档，以一种很拙劣的方式拼凑代码而已，网上的文章对我的帮助非常之大，我把这些文章都附在了[ About 页面 ](https://blog.dylanwu.space/#articles)的结尾，大家如果有兴趣可以留意一下，原创且有用的的文章还是值得记录下来的。