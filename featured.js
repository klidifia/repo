(function(window, document, videojs) {

  // map and indexOf polyfills for obsolete browsers
  Array.prototype.map||(Array.prototype.map=function(r,t){var n,e,o;if(null==this)throw new TypeError(" this is null or not defined");var i=Object(this),a=i.length>>>0;if("function"!=typeof r)throw new TypeError(r+" is not a function");for(arguments.length>1&&(n=t),e=new Array(a),o=0;a>o;){var f,p;o in i&&(f=i[o],p=r.call(n,f,o,i),e[o]=p),o++}return e});
  Array.prototype.indexOf||(Array.prototype.indexOf=function(r,t){var n;if(null==this)throw new TypeError('"this" is null or not defined');var e=Object(this),i=e.length>>>0;if(0===i)return-1;var a=+t||0;if(1/0===Math.abs(a)&&(a=0),a>=i)return-1;for(n=Math.max(a>=0?a:i-Math.abs(a),0);i>n;){if(n in e&&e[n]===r)return n;n++}return-1});

  var featured = function(settings) {
    var player = this;
    var featuredItem, mainItem, index, query, i;
    var preRoll, mainVideo, selectWhenReady, iterations = 0;
    var mergeOptions = videojs.mergeOptions || videojs.util.mergeOptions;

    options = mergeOptions(options,settings);

    preRoll = function() {
      if (featuredItem || player.options()['data-featured-video-id']) {
        featuredItem = featuredItem || player.options()['data-featured-video-id'];
        player.catalog.getVideo(featuredItem, function (error, video) {
          if (!error) {
            player.catalog.load(video);
          }
        });
      }
    }

    player.one('loadstart', function() {
      console.log('Thu 8 Dec @ 15:24')
      preRoll();
    });

    player.one('ended', function() {
      // jQuery('.vjs-close-button').trigger('click');
      // jQuery('.html5-video-player').removeClass('vjs-controls-disabled');
      jQuery('.vjs-social-overlay').addClass('vjs-hidden');

      player.trigger('loadstart');

      // @TODO: We probably want to do something about the .vjs-big-play-button.

      player.catalog.getVideo('5231307785001', function(error, video) {
        if (!error) {
          player.catalog.load(video);
          player.play();
        }
      });
    });
  }

  videojs.plugin('featured', featured);
})(window, document, videojs);
