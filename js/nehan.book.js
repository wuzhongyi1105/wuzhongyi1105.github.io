// nehan.book.js
// (c) 2014 - all rights reserved by Watanabe Masaki.
// url: http://github.com/tategakibunko/nehan-book
// license: MIT
;
if(typeof Nehan === "undefined"){
  Nehan = {};
}
if(typeof Nehan.Book === "undefined"){
  Nehan.Book = {};
}
if(typeof Nehan.Book.View === "undefined"){
  Nehan.Book.View = {};
}
if(typeof Nehan.Book.Model === "undefined"){
  Nehan.Book.Model = {};
}
if(typeof Nehan.Book.Template === "undefined"){
  Nehan.Book.Template = {};
}
if(typeof Nehan.Book.Template.Snipet === "undefined"){
  Nehan.Book.Template.Snipet = {};
}

Nehan.Book.version = "0.1.0";

Nehan.Book.Template.Snipet = {
  // [pageStatus]
  // @param {Int} pageNo
  // @param {Int} pageCount
  pageStatus:[
    "<span class='page-status'>",
    "<span class='page-no'><%= pageNo + 1 %></span> / <span class='page-count'><%= pageCount %></span>",
    "</span>",
  ].join("")
};

Nehan.Book.Template = {
  // [menu]
  // @param {Int} pageNo
  // @param {Int} pageCount
  menu:{
    vert:[
      "<button class='next action-button blue'><i class='fa fa-arrow-left'></i> NEXT</button>",
      Nehan.Book.Template.Snipet.pageStatus,
      "<button class='prev action-button red'>PREV <i class='fa fa-arrow-right'></i></button>"
    ].join(""),
    hori:[
      "<button class='prev action-button red'><i class='fa fa-arrow-left'></i> PREV</button>",
      Nehan.Book.Template.Snipet.pageStatus,
      "<button class='next action-button blue'>NEXT <i class='fa fa-arrow-right'></i></button>"
    ].join("")
  }
};

Nehan.Book.Model.PageStream = Backbone.Model.extend({
  defaults:{
    text:"",
    textMode:"html", // plain, html
    direction:"vert",
    fontSize:16,
    seekPercent:0,
    seekPageNo:0,
    layoutWidth:screen.width,
    pageWidth:"100%",
    pageNo:0,
    pageCount:0,
    pageFinish:false,
    timeElapsed:-1
  },
  initialize : function(){
    this.engine = Nehan.setup({
      style:{
	body:{
	  flow:(this.get("direction") === "vert"? "tb-rl" : "lr-tb"),
	  fontSize:this.get("fontSize"),
	  width:this.get("pageWidth"),
	  height:this.get("pageHeight")
	}
      }
    });
    this.stream = this.engine.createPageStream(this.getText());
  },
  isValidPagePos : function(page_pos){
    return 0 <= page_pos && page_pos < this.get("pageCount");
  },
  isVertical : function(){
    return this.get("direction") === "vert";
  },
  incPageCount : function(){
    this.set("pageCount", this.get("pageCount") + 1); // -> change:pageCount
  },
  getText : function(){
    var text = this.get("text");
    switch(this.get("textMode")){
    case "plain": return text.replace(/\n/g, "<br />");
    case "html": return text;
    default: return text;
    }
  },
  getPage : function(page_no){
    return this.stream.getPage(page_no);
  },
  getPageElement : function(page_no){
    var page = this.getPage(page_no);
    return page? page.element : null;
  },
  getCurrentPageNo : function(){
    return this.get("pageNo");
  },
  getPageCount : function(){
    return this.get("pageCount");
  },
  setPagePos : function(page_pos){
    if(this.get("pageNo") != page_pos && this.isValidPagePos(page_pos)){
      this.set("pageNo", page_pos); // -> change:pageNo
    }
  },
  rewindPageNo : function(){
    this.set("pageNo", 0);
  },
  incPageNo : function(){
    var page_pos = this.get("pageNo");
    if(this.isValidPagePos(page_pos + 1)){
      this.set("pageNo", page_pos + 1); // -> change:pageNo
    }
  },
  decPageNo : function(){
    var page_pos = this.get("pageNo");
    if(this.isValidPagePos(page_pos - 1)){
      this.set("pageNo", page_pos - 1); // -> change:pageNo
    }
  },
  asyncGet : function(callback){
    var self = this;
    this.stream.asyncGet({
      onProgress : function(tree, stream){
	self.incPageCount();
	self.set("seekPageNo", tree.pageNo);
	self.set("seekPercent", tree.percent);

	// initial pageNo is 0, so force trigger change:pageNo at zero,
	// to display first page to screen.
	if(tree.pageNo === 0){
	  self.trigger("change:pageNo");
	}
	if(callback.onProgress){
	  callback.onProgress(tree, self);
	}
      },
      onComplete : function(time, stream){
	//console.log("stream parsing finished: %f msec", time);
	self.outlineElement = self.engine.createOutlineElement({
	  onClickLink : function(toc){
	    self.set("pageNo", toc.pageNo);
	    return false;
	  }
	});
	self.set("pageFinish", true); // -> change:pageFinish
	self.set("timeElapsed", time);
	if(callback.onComplete){
	  callback.onComplete(time, self);
	}
      }
    });
  },
  getOutlineElement : function(){
    return this.outlineElement || null;
  }
});

Nehan.Book.View.Screen = Backbone.View.extend({
  className:"nb-screen",
  initialize : function(){
    this.listenTo(this.model.pageStream, "change:pageNo", this.onChangePageNo);
  },
  onChangePageNo : function(){
    var page_no = this.model.pageStream.get("pageNo");
    this.renderPage(page_no);
  },
  renderPage : function(page_no){
    var element = this.model.pageStream.getPageElement(page_no);
    this.$el.empty().append(element);
  },
  render : function(){
    return this.$el;
  }
});

Nehan.Book.View.Menu = Backbone.View.extend({
  className:"nb-menu",
  events:{
    "click .next":"onClickNext",
    "click .prev":"onClickPrev"
  },
  initialize : function(){
    var direction = this.model.pageStream.get("direction");
    this.template = _.template(Nehan.Book.Template.menu[direction]);
    this.listenTo(this.model.pageStream, "change:pageNo", this.onChangePageNo);
    this.listenTo(this.model.pageStream, "change:pageCount", this.onChangePageCount);
    this.$el.addClass(direction);
  },
  onChangePageNo : function(){
    var page_no = this.model.pageStream.get("pageNo");
    this.$el.find(".page-no").html(page_no + 1);
  },
  onChangePageCount : function(){
    var page_count = this.model.pageStream.get("pageCount");
    this.$el.find(".page-count").html(page_count);
  },
  onClickNext : function(){
    this.model.pageStream.incPageNo();
  },
  onClickPrev : function(){
    this.model.pageStream.decPageNo();
  },
  render : function(){
    return this.$el.html(
      this.template({
	pageNo:this.model.pageStream.get("pageNo"),
	pageCount:this.model.pageStream.get("pageCount")
      })
    );
  }
});

Nehan.Book.View.Reader = Backbone.View.extend({
  className:"nb-reader",
  initialize : function(){
    this.listenTo(this.model.pageStream, "change:pageFinish", this.onPageFinish);
  },
  onPageFinish : function(){
    if(!this.model.enableOutline){
      return;
    }
    var outline_element = this.model.pageStream.getOutlineElement();
    if(outline_element){
      $(outline_element).width(this.$el.width()).insertAfter(this.model.parentNode);
    }
  },
  render : function(){
    return this.$el.append(
      new Nehan.Book.View.Screen({model:this.model}).render()
    ).append(
      new Nehan.Book.View.Menu({model:this.model}).render()
    );
  }
});

Nehan.Book.NehanConfig = {
  kerning:true,
  justify:true,
  maxPageCount:999
};

Nehan.Book.App = (function(){
  function App(opt){
    opt = opt || {};
    this.$el = opt.$el || $(opt.el);
    this.model = {
      parentNode:this.$el,
      enableOutline:(opt.enableOutline || false),
      pageStream:new Nehan.Book.Model.PageStream({
	direction:(opt.direction || "vert"),
	text:(opt.text || this.$el.html()),
	layoutWidth:this.$el.width(), // body max width
	pageWidth:(opt.width || this.$el.width()), // body width
	pageHeight:(opt.height || Math.floor(screen.height * 55 / 100)), // body height
	fontSize:(opt.fontSize || 16)
      })
    };
    this.readerView = new Nehan.Book.View.Reader({model:this.model});
    this.$el.empty().append(this.readerView.render()).show();
    this.model.pageStream.asyncGet(opt.callback || {});
  }

  return App;
})();

// jQuery plugin
(function($){
  $.fn.nehanBook = function(opt){
    opt = opt || {};
    this.each(function(){
      var $target = $(this);
      var target_width = $target.data("width") || opt.width || $target.parent().width();
      $target.css("width",  target_width);
      new Nehan.Book.App({
	$el:$target,
	text:$target.html(),
	enableOutline:($target.data("enableOutline") || opt.enableOutline || false),
	fontSize:($target.data("fontSize") || opt.fontSize || 16),
	direction:($target.data("direction") || opt.direction || "vert"),
	width:target_width,
	height:($target.data("height") || opt.height || "45%"),
	callback:(opt.callback || {})
      });
    });
  };
})(jQuery);

