/**
 * MTS Custom plugin for playing videos in the Tamariki section.
 * custom.js must be loaded first.
 */

registerPlugin('mtsTamariki', function() {
  var player = this;
  var options = player.options_;
  // Exit if we are not in the Tamariki section.
  if (!options.hasOwnProperty('data-tamariki-videos')){
    return;
  }

  var videos = JSON.parse(options['data-tamariki-videos']);
  var myPlayer = this;
  var videoIndex;

  // Listen for the 'ended' event and play the next video.
  myPlayer.on('ended', function() {
    videoIndex = jQuery('#videoindex').val();

    var keysArray = Object.keys(videos);
    var index = keysArray.indexOf(String(videoIndex));
    index++;
    var objectKey = keysArray[index];

    // If we are at the end then show the custom endscreen.
    if (objectKey === undefined) {
      jQuery('#' + myPlayer.id_).append('<div class="mts-endscreen vjs-social-overlay vjs-modal-dialog" tabindex="-1" aria-describedby="video-player_endscreen" aria-hidden="false" aria-label="End screen" role="dialog"><button class="vjs-close-button vjs-control vjs-button" tabindex="0" role="button" aria-live="polite" aria-disabled="false" title="Close Modal Dialog" onclick="jQuery(\'#' + myPlayer.id_ + ' .mts-endscreen\').hide();"><span aria-hidden="true" class="vjs-icon-placeholder"></span><span class="vjs-control-text">Close Modal Dialog</span></button><p class="vjs-modal-dialog-description vjs-offscreen" id="video-player_endscreen">This is a modal window. This modal can be closed by activating the close button.</p><div class="vjs-modal-dialog-content" role="document"><img class="endscreen-header" src="/sites/all/themes/mts/images/endscreen-header-thanks.png" /><p class="endscreen-text"><a href="/tamariki">Back to Tamariki</a></p><img class="endscreen-footer" src="/sites/all/themes/mts/images/endscreen-footer-logo.jpg" /></div></div>');
    }
    else {
      // Record the video being played so we can continue with the next one.
      jQuery('#videoindex').val(objectKey);

      // Play the next video.
      playVideo(objectKey);
    }
  });

  function playVideo (videoIndex) {
    // Hide the big play button since we are auto-playing.
    myPlayer.bigPlayButton.hide();

    // Determine what the next video ID is.
    var currentVideo = videos[videoIndex];

    // Load and play the next video.
    myPlayer.catalog.getVideo(currentVideo.video_id, function (error, video) {
      if (!error) {
        // Add/remove video overlay depending if ingested via dynamic delivery.
        if (currentVideo.dynamic_delivery) {
          jQuery('.vjs-overlay-top-right').show();
        }
        else {
          jQuery('.vjs-overlay-top-right').hide();
        }

        myPlayer.catalog.load(video);
        window.setTimeout(function () {
          myPlayer.play();
        }, 800);
      }
    });
  }

  // When a video is clicked on, enter fullscreen and play the video.
  jQuery( document ).on( "click", ".tamariki-video", function() {
    jQuery('.mts-endscreen').remove();
    jQuery('.video-js').show();
    myPlayer.requestFullscreen();
    videoIndex = jQuery(this).attr('id');

    // If the same video was exited and entered again - resume the playback.
    if (videoIndex === jQuery('#videoindex').val()) {
      myPlayer.play();
    }
    else {
      playVideo(videoIndex);
      // Record the video being played so we can continue with the next one.
      jQuery('#videoindex').val(videoIndex);
    }
  });

  // When fullscreen is exited, pause and hide the video player.
  myPlayer.on('fullscreenchange', function() {
    if (!(myPlayer.isFullscreen())) {
      myPlayer.pause();
      jQuery('.video-js').hide();
    }
  });
});
