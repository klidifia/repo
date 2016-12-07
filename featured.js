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
      console.log('Preroll function: 11:11')
      if (featuredItem || player.options()['data-featured-video-id']) {
        featuredItem = featuredItem || player.options()['data-featured-video-id'];
        player.catalog.getVideo(featuredItem, function (error, video) {
          if (!error) {
            window.setTimeout(function() {
              player.catalog.load(video);
            }, 100);
          }
        });
      }
    }

    player.one('loadstart', function() {
      console.log('Load function: 11:11')
      preRoll();
    });

    player.one('ended', function() {
      console.log('Ended function: 11:11')

      player.catalog.getVideo('5231288516001', function(error, video) {
        if (!error) {
          window.setTimeout(function() {
            player.catalog.load(video);
            $('.vjs-social-overlay').addClass('vjs-hidden');
          }, 100);
          window.setTimeout(function() {
            player.play();
          }, 500);

        }
      });
    });
  }

  videojs.plugin('featured', featured);
})(window, document, videojs);
