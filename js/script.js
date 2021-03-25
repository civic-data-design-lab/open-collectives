// menu dropdown
var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
  return new bootstrap.Dropdown(dropdownToggleEl)
});

// nav menu to X animation
$('.navTrigger').click(function(){
  $(this).toggleClass('active');
});

// sidebar secondary menu animation
$('.arrow-wide').on('click', function() {
  if ($(this).hasClass('active')) {
    $('#sidebar').css('left','-24rem');
    $('main').css('margin-left','auto');
    $('.sidebtn').css('left','0px');
    $('.fade').removeClass('show').css('z-index','-1');
  }
  else {
    $('.fade').addClass('show').css('z-index','4');
    $('#sidebar').css('left','0rem');
    $('main').css('margin-left','26rem');
    $('.sidebtn').css('left','22rem');
  }
  $(this).toggleClass('active');
});

// embed trailer video
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '960',
    width: '540',
    controls: 0,
    autoplay: 1,
    videoId: 'GW3JPYkjeo0',
    playlist: 'GW3JPYkjeo0',
    loop: 1, 
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    // setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}

$('#vidTrailer').on('load', function(){
  $('#vidTrailer').contents().find('.ytp-chrome-top').css('display','none!important');
});