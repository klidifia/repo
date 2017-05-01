/**
 * MTS Custom plugin for preroll videos.
 */
videojs.plugin('mtsCustom', function() {
  // Exit if we are playing a playlist.
  var player = this;
  var options = player.options();
  if (options.hasOwnProperty('data-videos')){
    return;
  }

  var myPlayer = this,
      preroll = true,
      prerollVideo,
      mainVideo;

  function loadPreroll() {
    prerollVideo = prerollVideo || player.options()['data-preroll-video-id'];
    if (prerollVideo == null) {
      preroll = false;
      return;
    }
    mainVideo = mainVideo || player.options()['data-main-video-id'];
    myPlayer.catalog.getVideo(prerollVideo, function (error, video) {
      if (!error) {
        myPlayer.catalog.load(video);
        myPlayer.poster(null);
        // Set the poster image of the main video.
        myPlayer.catalog.getVideo(mainVideo, function (error, video) {
          if (!error) {
            myPlayer.poster(video.poster);
          }
        });
      }
    });
  }

  myPlayer.on('pause', function() {
    myPlayer.bigPlayButton.show();
  });

  function playVideo() {
    myPlayer.bigPlayButton.hide();
    mainVideo = mainVideo || player.options()['data-main-video-id'];
    myPlayer.catalog.getVideo(mainVideo, function (error, video) {
      if (!error) {
        myPlayer.catalog.load(video);
        window.setTimeout(function() {
          myPlayer.play();
        }, 800);
      }
    });
  }

  myPlayer.on('ended', function () {
    if (preroll) {
      preroll = false;
      playVideo();
    }
    else {
      if (jQuery('#' + myPlayer.id_ + '.mts-endscreen').length) {
        return;
      }
      var share = 'Direct link<br /><input class="endscreen-direct-link" tabindex="7" readonly="true" value="' + window.location.href + '" type="text">';
      jQuery('#' + myPlayer.id_).append('<div class="mts-endscreen vjs-social-overlay vjs-modal-dialog" tabindex="-1" aria-describedby="video-player_endscreen" aria-hidden="false" aria-label="End screen" role="dialog"><div class="vjs-close-button vjs-control vjs-button" tabindex="0" role="button" aria-live="polite" aria-disabled="false" title="Close Modal Dialog" onclick="jQuery(\'#' + myPlayer.id_ + ' .mts-endscreen\').hide();"><span class="vjs-control-text">Close Modal Dialog</span></div><p class="vjs-modal-dialog-description vjs-offscreen" id="video-player_endscreen">This is a modal window. This modal can be closed by activating the close button.</p><div class="vjs-modal-dialog-content" role="document"><img class="endscreen-header" src="/sites/all/themes/mts/images/endscreen-header-thanks.png" /><div class="vjs-social-share-links"><a href="https://www.facebook.com/sharer/sharer.php?u=' + window.location.href + '" class="vjs-social-share-link vjs-icon-facebook" aria-role="link" aria-label="Share on Facebook" tabindex="1" title="Facebook" target="_blank"><span class="vjs-control-text">Facebook</span></a><a href="https://plus.google.com/share?url=' + window.location.href + '" class="vjs-social-share-link vjs-icon-gplus" aria-role="link" aria-label="Share on Google Plus" tabindex="2" title="Google+" target="_blank"><span class="vjs-control-text">Google+</span></a><a href="https://www.linkedin.com/shareArticle?mini=true&amp;url=' + window.location.href + '&amp;summary=&amp;source=Classic" class="vjs-social-share-link vjs-icon-linkedin" aria-role="link" aria-label="Share on LinkedIn" tabindex="3" title="LinkedIn" target="_blank"><span class="vjs-control-text">LinkedIn</span></a><a href="https://pinterest.com/pin/create/button/?url=' + window.location.href + '&amp;is_video=true" class="vjs-social-share-link vjs-icon-pinterest" aria-role="link" aria-label="Share on Pinterest" tabindex="4" title="Pinterest" target="_blank"><span class="vjs-control-text">Pinterest</span></a><a href="http://www.tumblr.com/share?v=3&amp;u=' + window.location.href + '" class="vjs-social-share-link vjs-icon-tumblr" aria-role="link" aria-label="Share on Tumblr" tabindex="5" title="Tumblr" target="_blank"><span class="vjs-control-text">Tumblr</span></a><a href="https://twitter.com/intent/tweet?original_referer=' + window.location.href + '&amp;tw_p=tweetbutton&amp;url=' + window.location.href + '" class="vjs-social-share-link vjs-icon-twitter" aria-role="link" aria-label="Share on Twitter" tabindex="6" title="Twitter" target="_blank"><span class="vjs-control-text">Twitter</span></a></div><p class="endscreen-text">' + share + '</p><img class="endscreen-footer" src="/sites/all/themes/mts/images/endscreen-footer-logo.jpg" /></div></div>');
    }
  });

  loadPreroll();
});
