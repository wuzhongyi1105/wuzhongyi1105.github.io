---
layout: social
title: Gallery
comments: false
permalink: /gallery/
---

<div class="social-feed-container"></div>

<script>
    $(document).ready(function(){
        $('.social-feed-container').socialfeed({
        	// PINTEREST
   			pinterest:{
       		    accounts: ['@teslamotors/model-s','@me'],   //Array: Specify a list of accounts from which to pull posts
                                                    //@me to pull your pins
                                                    //@user/board to pull pins from a user board
                limit: 3,                                   //Integer: max number of posts to load
                access_token: 'YOUR_PINTEREST_ACCESS_TOKEN' //String: Pinterest client id
              },
            // INSTAGRAM
            instagram:{
                accounts: ['@wuzhongyi1105',''],  //Array: Specify a list of accounts from which to pull posts
                limit: 3,                                    //Integer: max number of posts to load
                client_id: '4d5894f48c5d4ad08315488a67bb08af',       //String: Instagram client id (optional if using access token)
                access_token: '1291703100.4d5894f.aa376b91d5f1485fa494f8e04b6c5973' //String: Instagram access token
            },
            // GENERAL SETTINGS
            length:400                                      //Integer: For posts with text longer than this length, show an ellipsis.
        });
    });
</script>