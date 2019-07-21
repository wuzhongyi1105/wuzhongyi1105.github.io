---
layout: page
title: Gallery
permalink: /gallery/
comments: true
---

<script src="{{ site.baseurl }}/js/jquery.instagramFeed.min.js"></script>
<script>
    (function($){
        $(window).on('load', function(){
            $.instagramFeed({
                'username': 'instagram',
                'container': "#instagram-feed1",
                'display_profile': true,
                'display_biography': true,
                'display_gallery': true,
                'callback': null,
                'styling': true,
                'items': 8,
                'items_per_row': 4,
                'margin': 1 
            });
        });
    })(jQuery);
</script>

