/**
 * MTS Custom plugin for preroll videos.
 */
videojs.plugin('mtsCustom', function() {
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
  });

  loadPreroll();
});
