/**
 * MTS prerolls.
 */
videojs.plugin('mtsPreroll', function() {
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
        console.log('Loading preroll video.');
        myPlayer.catalog.load(video);
        myPlayer.poster(null);
        // Set the poster image of the main video.
        myPlayer.catalog.getVideo(mainVideo, function (error, video) {
          if (!error) {
            console.log('Loading original poster.');
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
    } else {
      var language = myPlayer.language_,
        message;
      if (language === 'en') {
        message = 'Thanks (EN).';
      }
      else {
        message = 'Thanks (MI).';
      }
      jQuery('.html5-video-player').append('<div class="mts-endscreen vjs-modal-dialog" tabindex="-1" aria-describedby="video-player_endscreen" aria-hidden="false" aria-label="End screen" role="dialog"><div class="vjs-close-button vjs-control vjs-button" tabindex="0" role="button" aria-live="polite" aria-disabled="false" title="Close Modal Dialog" onclick="jQuery(\'.mts-endscreen\').hide();"><span class="vjs-control-text">Close Modal Dialog</span></div><p class="vjs-modal-dialog-description vjs-offscreen" id="video-player_endscreen">This is a modal window. This modal can be closed by activating the close button.</p><div class="vjs-modal-dialog-content" role="document"><p>' + message + '</p><p>Share: ' + window.location.href + '</p></div></div>');
    }
  });

  loadPreroll();
});