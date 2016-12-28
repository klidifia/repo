/**
 * MTS prerolls.
 */
videojs.plugin('mtsPreroll', function() {
  var myPlayer = this,
    prerollVideo,
    mainVideo;

  function loadPreroll() {
    prerollVideo = prerollVideo || player.options()['data-preroll-video-id'];
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

  myPlayer.one('ended', function () {
    playVideo();
  });

  loadPreroll();
});