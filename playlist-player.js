/**
 * MTS Custom plugin for continuous playing of videos in a playlist.
 * custom.js must be loaded first.
 */

registerPlugin('mtsPlaylists', function() {
  var player = this;
  var options = player.options_;
  if (!options.hasOwnProperty('data-videos')){
    return;
  }

  function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  var videoid = getParameterByName('id');
  var videoIndex = (videoid !== null ? jQuery('ol[data-video-id="' + videoid + '"]').attr('id') : 0);
  var videos = JSON.parse(options['data-videos']);
  var myPlayer = this;

  // Listen for the 'ended' event and play the next video.
  myPlayer.on('ended', function() {
    // Cycle to the next video.
    videoIndex++;
    if (videoIndex >= videos.length) {
      // WR#282109: Bail out here if the player has .no-endscreen
      if (jQuery('#' + myPlayer.id).hasClass('no-endscreen')) {
        return;
      }
      jQuery('#' + myPlayer.id_).append('<div class="mts-endscreen vjs-social-overlay vjs-modal-dialog" tabindex="-1" aria-describedby="video-player_endscreen" aria-hidden="false" aria-label="End screen" role="dialog"><button class="vjs-close-button vjs-control vjs-button" tabindex="0" role="button" aria-live="polite" aria-disabled="false" title="Close Modal Dialog" onclick="jQuery(\'#' + myPlayer.id_ + ' .mts-endscreen\').hide();"><span aria-hidden="true" class="vjs-icon-placeholder"></span><span class="vjs-control-text">Close Modal Dialog</span></button><p class="vjs-modal-dialog-description vjs-offscreen" id="video-player_endscreen">This is a modal window. This modal can be closed by activating the close button.</p><div class="vjs-modal-dialog-content" role="document"><img class="endscreen-header" src="/sites/all/themes/mts/images/endscreen-header-thanks.png" /><p class="endscreen-text">Playlist has finished playing</p><img class="endscreen-footer" src="/sites/all/themes/mts/images/endscreen-footer-logo.jpg" /></div></div>');
    }
    else {
      playVideo(videoIndex);
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
        // Change the name of the video being played.
        jQuery('h2#video-name').html(currentVideo.title);

        // Add/remove video overlay depending if ingested via dynamic delivery.
        if (currentVideo.dynamic_delivery) {
          jQuery('.vjs-overlay-top-right').show();
        }
        else {
          jQuery('.vjs-overlay-top-right').hide();
        }

        // Add active class to the current video, and remove from others.
        jQuery('ol.vjs-playlist').removeClass('active');
        jQuery('ol.vjs-playlist[data-item-id=' + videoIndex + ']').addClass('active');

        // Change the share info.
        jQuery('.mts-social-share-links li.mts-social-share-facebook a').click(function() {
          window.open('http://www.facebook.com/sharer/sharer.php?u=' + currentVideo.url, 'facebook_share', 'height=320, width=640, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, directories=no, status=no');
        });
        jQuery('.mts-social-share-links li.mts-social-share-twitter a').attr('href', 'https://twitter.com/intent/tweet?original_referer=' + currentVideo.url + '&tw_p=tweetbutton&via=maoritv&text=' + currentVideo.title + '&url=' + currentVideo.url);
        jQuery('.mts-social-share-links li.mts-social-share-email a').attr('href', 'mailto:?to=&subject=' + currentVideo.title + '&body=' + currentVideo.url);
        jQuery('.mts-social-share-links li.mts-social-share-copy-link input.copy-link-processed').val(currentVideo.url);

        myPlayer.catalog.load(video);
        window.setTimeout(function () {
          myPlayer.play();
        }, 800);
      }
    });
  }

  jQuery( document ).on( "click", ".vjs-playlist", function() {
    jQuery('.mts-endscreen').remove();
    videoIndex = jQuery(this).attr('id');
    playVideo(videoIndex);
  });

  // Play the first video to start with.
  playVideo(videoIndex);
});
