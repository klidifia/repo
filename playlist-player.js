/**
 * MTS Custom plugin for continuous playing of videos in a playlist.
 */
videojs.plugin('mtsPlaylists', function() {
  var options = player.options();
  if (!options.hasOwnProperty('data-videos')){
    return;
  }

  var videos = JSON.parse(options['data-videos']);

  var myPlayer = this,
      i = 0;

  // Listen for the 'ended' event and play the next video.
  myPlayer.on('ended', function() {
    playVideo();
  });

  function playVideo (id) {
    // If a particular playlist item was selected.
    if (typeof id !== 'undefined') {
      i = id;
    }

    // Hide the big play button since we are auto-playing.
    myPlayer.bigPlayButton.hide();

    // Determine what the next video ID is.
    var currentVideo = videos[i];

    // Load and play the next video.
    myPlayer.catalog.getVideo(currentVideo.video_id, function (error, video) {
      if (!error) {
        // Change the name of the video being played.
        jQuery('h2#video-name').html(currentVideo.title);
        myPlayer.catalog.load(video);
        window.setTimeout(function() {
          myPlayer.play();
        }, 800);
      }
    });

    // Cycle to the next video.
    i++%videos.length;
  }

  jQuery('.vjs-playlist').live('click', function () {
    var id = jQuery(this).attr('id');
    playVideo(id);
  });

  // Play the first video to start with.
  playVideo();
});
