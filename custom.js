/**
 * MTS Custom plugin for preroll videos.
 */

// Cross-compatibility for Video.js 5 and 6.
var registerPlugin = videojs.registerPlugin || videojs.plugin;

registerPlugin('mtsCustom', function() {
  var player = this;
  var options = player.options_;
  // Exit if we are playing a playlist, or a Tamariki list.
  if ((options.hasOwnProperty('data-videos') || options.hasOwnProperty('data-tamariki-videos'))) {
    return;
  }

  var myPlayer = this,
    preroll = true,
    prerollVideo,
    mainVideo,
    dynamicDelivery;

  function loadPreroll() {
    prerollVideo = prerollVideo || options['data-preroll-video-id'];
    if (prerollVideo == null) {
      preroll = false;
      return;
    }
    mainVideo = mainVideo || options['data-main-video-id'];
    myPlayer.catalog.getVideo(prerollVideo, function (error, video) {
      if (!error) {
        // Add/remove video overlay depending if ingested via dynamic delivery.
        dynamicDelivery = dynamicDelivery || options['data-dynamic-delivery'];
        if (dynamicDelivery === '1') {
          jQuery('.vjs-overlay-top-right').show();
        }
        else {
          jQuery('.vjs-overlay-top-right').hide();
        }

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
    mainVideo = mainVideo || options['data-main-video-id'];
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
      if (jQuery('#' + myPlayer.id_ + ' .mts-endscreen').length) {
        return;
      }
      // WR#282109: Bail out if player has .no-endscreen class.
      if (jQuery('#' + myPlayer.id_).hasClass('.no-endscreen')) {
        return;
      }
      var share = 'Direct link<br /><input class="endscreen-direct-link" tabindex="7" readonly="true" value="' + window.location.href + '" type="text">';
      jQuery('#' + myPlayer.id_).append('<div class="mts-endscreen vjs-social-overlay vjs-modal-dialog" tabindex="-1" aria-describedby="video-player_endscreen" aria-hidden="false" aria-label="End screen" role="dialog"><button class="vjs-close-button vjs-control vjs-button" tabindex="0" role="button" aria-live="polite" aria-disabled="false" title="Close Modal Dialog" onclick="jQuery(\'#' + myPlayer.id_ + ' .mts-endscreen\').hide();"><span aria-hidden="true" class="vjs-icon-placeholder"></span><span class="vjs-control-text">Close Modal Dialog</span></button><p class="vjs-modal-dialog-description vjs-offscreen" id="video-player_endscreen">This is a modal window. This modal can be closed by activating the close button.</p><div class="vjs-modal-dialog-content" role="document"><img class="endscreen-header" src="/sites/all/themes/mts/images/endscreen-header-thanks.png" /><p class="endscreen-text">' + share + '</p><img class="endscreen-footer" src="/sites/all/themes/mts/images/endscreen-footer-logo.jpg" /></div></div>');
    }
  });

  loadPreroll();
});
