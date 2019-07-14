$(function(){
  $(".nehan-book").nehanBook({
    height:"40%",
    callback:{
      onProgress : function(tree, stream){
	// hook when first page is generated.
	if(stream.getPageCount() === 1){
	  var is_vertical = stream.isVertical();
	  var next_key = is_vertical? "left" : "right";
	  var prev_key = is_vertical? "right" : "left";
	  Mousetrap.reset();
	  Mousetrap.bind("ctrl+" + prev_key, function(){ stream.rewindPageNo(); });
	  Mousetrap.bind(next_key, function(){ stream.incPageNo(); });
	  Mousetrap.bind(prev_key, function(){ stream.decPageNo(); });
	  Mousetrap.bind("j", function(){ stream.incPageNo(); });
	  Mousetrap.bind("k", function(){ stream.decPageNo(); });
	  // ges
	  var myTouch = util.toucher(document.getElementById('f'));
	  if(next_key == left){
		myTouch.on('swipeLeft',function(){ stream.incPageNo(); });
		myTouch.on('swipeRight',function(){ stream.decPageNo(); });
	  }
	  else
      {
		myTouch.on('swipeRight',function(){ stream.incPageNo(); });
		myTouch.on('swipeLeft',function(){ stream.decPageNo(); });
	  };
	}
      }
    }
  });
});
