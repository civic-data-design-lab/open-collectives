// title case
function titleCase(string) {
	string = string.toLowerCase();
	string = string.split(' ');
	for (var i = 0; i < string.length; i++) {
		string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1);
	}
	return string.join(' ');
}

// round accurately function
function roundAccurately(number, decimalPlaces) {
	return Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces);	
};

// wrap multi-line text spans
function wrapText(text, width) {
	text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.2,
			anchor = text.attr("text-anchor"),
			x = text.attr("x"),
			y = text.attr("y"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null)
				.append("tspan")
				.attr("text-anchor", anchor)
				.attr("x", x)
				.attr("y", y)
				.attr("dy", dy + "em");
		while (word = words.pop()) {
			line.push(word);
			tspan.text(line.join(" "));
			if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan")
					.attr("text-anchor", anchor)
					.attr("x", x)
					.attr("y", y)
					.attr("dy", ++lineNumber * lineHeight + dy + "em")
					.text(word);
			}
		}
	})
}

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
function closeSidebar() {
  $('#sidebar').css('left','-24rem');
  $('main').css('margin-left','auto');
  $('.sidebtn').css('left','0px');
  $('#fade-sidebar').removeClass('show').css('z-index','-1');
  $('.dropdown-menu').removeClass('active-side');
  $('.arrow-wide').removeClass('active');
};

$('.arrow-wide').on('click', function() {
  if (!$(this).hasClass('active')) {
    closeSidebar();
    $('#fade-sidebar').addClass('show').css('z-index','4');
    $('#sidebar').css('left','0rem');
    $('main').css('margin-left','26rem');
    $('.sidebtn').css('left','22rem');
    $('.dropdown-menu').addClass('active-side');
    $('.arrow-wide').addClass('active');
  }
  else {
    closeSidebar();
  }
});
$('.close-sidebar').on('click', function() {
  closeSidebar();
})

// window resize
var winHeight = $(window).height();
var winWidth = $(window).width();

$(window).resize(function() {
	winHeight = $(window).height();
	winWidth = $(window).width();
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