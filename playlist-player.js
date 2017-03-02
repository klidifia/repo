/**
 * MTS Custom plugin for continuous playing of videos in a playlist.
 */
videojs.plugin('mtsPlaylists', function() {
  var options = player.options();
  if (!options.hasOwnProperty('data-videos')){
    return;
  }

  var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
      var p=a[i].split('=', 2);
      if (p.length == 1)
        b[p[0]] = "";
      else
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
  })(window.location.search.substr(1).split('&'));

  var id = jQuery('ol[data-video-id="' + qs.id + '"]').attr('id');
  var videos = JSON.parse(options['data-videos']);
  var myPlayer = this;

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

        // Change the share info.
        jQuery('.mts-social-share-links li.mts-social-share-facebook a').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=' + currentVideo.url);
        jQuery('.mts-social-share-links li.mts-social-share-twitter a').attr('href', 'https://twitter.com/intent/tweet?original_referer=' + currentVideo.url + '&tw_p=tweetbutton&via=maoritv&text=' + currentVideo.title + '&url=' + currentVideo.url);
        jQuery('.mts-social-share-links li.mts-social-share-email a').attr('href', 'mailto:?to=&subject=' + currentVideo.title + '&body=' + currentVideo.url);
        jQuery('.mts-social-share-links li.mts-social-share-copy-link input.copy-link-processed').val(currentVideo.url);

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
  playVideo(id);
});
