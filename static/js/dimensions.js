// ----- Initializations -----

//For Isotope integration to filter cards with sliders
var grid;

var dimensions = {
  "economics": {
    description:
      "Economics refers to the entities who profit from the collective, the intent to profit or not, the degree to which the collective directly benefits from its members versus profiting from a private investor/ owner of a platform.",
    range: {
      0: "mix of common and private goods",
      10: "PRIVATE GOOD"
    }
  },
  "governance": {
    description:
      "Governance assesses how a collective is managed.",
    range: {
      0: "mixed or federated",
      10: "CENTRALIZED"
    }
  },
  "platform": {
    description:
      "Platform defines whether a collective exists on an exclusively digital or physical platform or somewhere in between.",
    range: {
      0: "mix of physical and digital",
      10: "DIGITAL"
    }
  },
  "porosity": {
    description:
      "Porosity refers to the ability of members to join and leave the collective n terms of process, time cycle, qualifications, etc. The two main factors include the (a) ease in which to join and leave and (b) the collective’s anticipation to changes in membership.",
    range: {
      0: "invitation required",
      10: "CLOSED"
    }
  },
  "size": {
    description:
      "Size refers to the number of members in a collective; it is a way to evaluate quantity.",
    range: {
      0: "100 to 1,000",
      10: "LARGE"
    }
  }
};

var FormText = {
  "FormEcon": {
    1:"Common goods",
    2:"Mostly common goods",
    3:"Mix of common and private goods",
    4:"Mostly private goods",
    5:"Private goods"
  },
  "FormGovern": {
    1:"Decentralized",
    2:"Mostly decentralized",
    3:"Mixed or federated",
    4:"Mostly centralized",
    5:"Centralized"
  },
  "FormPlatform": {
    1:"Physical only",
    2:"Mostly physical",
    3:"Mix of physical and digital",
    4:"Mostly digital",
    5:"Digital"
  },
  "FormPorous": {
    1:"Open to anyone",
    2:"Mostly open",
    3:"Invitation required",
    4:"Mostly closed",
    5:"Closed"
  },
  "FormSize": {
    1:"<50",
    2:"50 to 100",
    3:"100 to 1,000",
    4:"1,000 to 5,000",
    5:">5,000"
  }
}


// Initialize Isotope on the card-grid
var initGrid = function() {
  // init isotope
  grid = new Isotope("#card-grid", {
    // options
    itemSelector: ".flex-card",
    layoutMode: "fitRows",
    order: "random",
    getSortData: {
      porosity: ".porosity parseInt",
      economics: ".economics parseInt",
      size: ".size parseInt",
      platform: ".platform parseInt",
      governance: ".governance parseInt"
    }
  });
};

// Create the sliders from dimensions
var initSlider = function() {
  var template = $(".slider.template");
  $.each(dimensions, function(key, value) {
    var slider = template.clone();
    slider
      .find(".btn")
      .attr("data-content", value.description)
    slider.find(".iconLabel .title").prepend(key);
    slider.find(".iconLabel input").attr('id',`${key}_chk`);
    slider.find(".iconLabel .range-label").attr('for',`${key}_chk`);
    slider.find("#left").text(value.range[0]);
    slider.find("#left").attr('id', `${key}_label`)
    // slider.find("#right").text(value.range[10]);
    slider
      .find("input[type=range]")
      .attr("id", key.toLowerCase().replace("/", "_") + "-slider");
    slider.removeClass("template").appendTo(template.parent());
    if (key==="economics") {
      slider.addClass('active')
    }
  });
  $('[data-toggle="popover"]').popover();
};

// For the radar chart
RadarChart.defaultConfig.color = function() {};
RadarChart.defaultConfig.radius = 3;
RadarChart.defaultConfig.levels = 5;
RadarChart.defaultConfig.w = 200;
RadarChart.defaultConfig.h = 200;

var renderCards = function() {
  var template = $(".card-list .flex-card.template");
  var total_values = {}
  $.each(dimensions, function(key, item){
    total_values[key]=0
  });
  $('.card-list').html(template[0]);
  $.each(window.data.data, function(key, item) {
    var card = template.clone();
    card.attr("data-id", key);
    card // Finding front photo of card first
      .find(".flex-card-front")
      .css("background-image", `url(./data/image/${item.image})`); // `"background-image:url(data/image/"${item.backgroundImage})`);
    
    card // Finding back photo of card upon click
      .find(".item-image")
      .css("item-image", `url(./data/image/${item.image})`);

    card.find(".item-title .title-text").text(item.title);

    card.find(".item-description").text( //Only finds first 150 words for flex card back
      item.description
        .split(" ")
        .slice(0, 150)
        .join(" ")
    ); 
    card.find(".item-longDescription").text(// Finds all words for modal
      item.description);

    //Appends all card info found 
    card.find(".button-expand").append(item.title);
    $.each(item.values, function(k, val) {
      total_values[k]+=val
      var span = $("<span/>")
        .addClass(k)
        .text(val);
      card.find(".item-data").append(span);
    });
    $(".item-data").hide();
    card.removeClass("template");
    $(".card-list").append(card);
  });
  var avg_values = {};
  $.each(dimensions, function(key, item){
    avg_values[key]=total_values[key]/data.data.length
  });
  window.data['average']=avg_values
}

// As soon as the webpage is loaded
$(document).ready(function() {
  // check cookies
  if (!document.cookie.includes("visited=true")) {
    $('#splashScreenModal').modal('show')
    var d = new Date();
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = "visited=true;" + expires + "path=/";
  }
  // Initialize the Slider
  initSlider();

  // Read data from the file and populate
  var addCards = $.getJSON("/data", function(data,error) {
    window.data = data;
    renderCards();
  });
  // When populated, initialize Isotope grid
  addCards.done(() => {
    initGrid();
  });
  $('#submitWrapper').tooltip();
  // filters on / off
  $('.on-off-label').on("click", function(){
    $(this).closest('.slider').toggleClass('active')
  })
  $("a.iconLabel").on("click", function() {
    $(this).closest('.slider').toggleClass('active')
    if (!$(this).closest('.slider').hasClass('active')) {
      $(this).closest('.slider').find('input[type=range]').val(null)
      filter_cards();
    }
  });
});

function create_filter(filter, number, filter_on) {
  if (filter_on) {
    return parseInt(number, 10) <= filter + 2 && parseInt(number, 10) >= filter - 2;
  } else {
    return parseInt(number, 10) <= filter + 10 && parseInt(number, 10) >= filter - 10;
  }
  
}

function data_for_radar_chart(values) {
  axes = []
  $.each(values, function(key,value) {
    axes.push({axis:key, value:value})
  })
  return axes;
}

function filter_cards() {
  
  let porosity_filter = parseInt($("#porosity-slider").val());
  let economics_filter = parseInt($("#economics-slider").val());
  let size_filter = parseInt($("#size-slider").val());
  let platform_filter = parseInt($("#platform-slider").val());
  let governance_filter = parseInt($("#governance-slider").val());

  let porosity_on = $("#porosity-slider").closest('.slider').hasClass('active');
  let economics_on = $("#economics-slider").closest('.slider').hasClass('active');
  let size_on = $("#size-slider").closest('.slider').hasClass('active');
  let platform_on = $("#platform-slider").closest('.slider').hasClass('active');
  let governance_on = $("#governance-slider").closest('.slider').hasClass('active');

  $('#economics_label').html(`${FormText["FormEcon"][economics_filter]}`)
  $('#size_label').html(`${FormText["FormSize"][size_filter]}`)
  $('#porosity_label').html(`${FormText["FormPorous"][porosity_filter]}`)
  $('#platform_label').html(`${FormText["FormPlatform"][platform_filter]}`)
  $('#governance_label').html(`${FormText["FormGovern"][governance_filter]}`)
  
  grid.arrange({
    filter: function() {
      var porosity_num = $(this)
        .find(".porosity")
        .text();
      var economics_num = $(this)
        .find(".economics")
        .text();
      var size_num = $(this)
        .find(".size")
        .text();
      var platform_num = $(this)
        .find(".platform")
        .text();
      var governance_num = $(this)
        .find(".governance")
        .text();

      // Only returns values 5 numbers greater or lower than chosen one (range 0-30)
      return (
        create_filter(porosity_filter, porosity_num, porosity_on) &&
        create_filter(economics_filter, economics_num, economics_on) &&
        create_filter(size_filter, size_num, size_on) &&
        create_filter(platform_filter, platform_num, platform_on) &&
        create_filter(governance_filter, governance_num, governance_on)
      );
    }
  });
}

/* Create generic template filter */

$(".sideBar").on("input", "input[type=range]", ()=>filter_cards());

// ----- Prevent cluttering of popovers -----
$(document).click(function(e) {
  var clickedOn = $(e.target);
  $(".btn[aria-describedby]").each(function(key, elem) {
    let popover = $(elem).attr("aria-describedby");
    if (
      !(
        clickedOn.closest(".popover").length &&
        clickedOn.closest(".popover").attr("id") === popover
      ) &&
      clickedOn.closest(".btn[aria-describedby]")[0] !== elem
    ) {
      $(elem).popover("hide");
    }
    
  });
});
// On button click, expands modal to show title and description
$(".card-list").on("click", ".button-expand", function() {
  var modal = $("#myModal");
  var item =
    window.data.data[
      $(this)
        .parents(".flex-card")
        .attr("data-id")
    ];
  
  var data = [{
    className: 'average',
    axes: data_for_radar_chart(window.data.average)
  },{
    className: item.title,
    axes: data_for_radar_chart(item.values)
  }];
  modal.find(".item-title").text(item.title);
  modal.find(".item-longDescription").text(item.description);
  // modal.find(".item-link").text(item.link);
  var chart = RadarChart.chart();
  var cfg = chart.config(); // retrieve default config
  modal.find('.radar-chart').html('');
  var svg = d3.select('.radar-chart').append('svg')
    .attr('width', cfg.w + 50)
    .attr('height', cfg.h + 20);
  svg.append('g').classed('single', 1).datum(data).call(chart);
    modal.find('.slider-chart').html('');
    var svgSliders = d3.select(".slider-chart")
        .append("svg")
        .attr("viewBox", [0,0,cfg.w + 50, cfg.h + 50]);
    // var sliders = SlidersChart.sliders(data, cfg);
    // svgSliders.append("g").classed('single', 1).datum(data).call(sliders);
    plotSlidersChart(svgSliders, data, cfg, FormText);
  // modal.find(".item-image").css("background-image", `url('data/image/${item.itemImage}')`);
  modal.find(".modal-image").attr("src", `./data/image/${item.image}`);
  modal.modal("show");
});
// $(".nav-bar").on("click")

// ------Added an alert for submitting a collective -----------
$("#AddCollective").on("submit", function(e){
  e.preventDefault()
  var uploadedImage = $("#FormPic")
  var imageURL = $("#FormPicUrl")
  uploadedImage.removeAttr('disabled')
  imageURL.removeAttr('disabled')
  var formData = new FormData(this);
  $(this).addClass('submitting-form');
  $(this).find('#submitCollective').attr('disabled', true);
  $.ajax({
    url : $(this).attr('action'),
    type: 'POST',
    data: formData,
    cache : false,
    processData: false,
    contentType: false,
  }).done(function(response) {
    response = JSON.parse(response)
    if (response['success']===true) {
      alert('Your successfully added a collective!');
      window.data = response['data'];
      renderCards();
      initGrid();
      filter_cards();
      $('#formModal').modal('hide');
    } else {
      alert('There was some error');
    }
  }).always(function() {
    grecaptcha.reset();
    $("#AddCollective")[0].reset();
    $("#AddCollective").removeClass('submitting-form');
    $("#AddCollective").find('#submitCollective').attr('disabled', true);
  })
})
captcha = function() {
  $('#submitCollective').attr('disabled',false)
  $('#submitWrapper').tooltip('disable');
  $('#FormCaptcha').val(grecaptcha.getResponse())
}
expireCaptcha = function() {
  $('#submitCollective').attr('disabled',true)
  $('#submitWrapper').tooltip('enable');
  $('#FormCaptcha').val('')
}

/* Add Collective Button */
$('#addCollective, #addCollective2').click(function() {
  $('#aboutModal').modal('hide')
  $('#formIntroModal').modal('show');
});

// ----- Resetting station sliders to normal-----
$('#station-reset').click (function() {
  $('.on-off').prop('checked', false);
  $("#porosity-slider, #economics-slider, #size-slider, #platform-slider, #governance-slider").closest('.slider').removeClass('active');
  $("#porosity-slider, #economics-slider, #size-slider, #platform-slider, #governance-slider").val(null);
  grid.arrange({filter:""})
  filter_cards();
})

const allRanges = document.querySelectorAll(".range-wrap");

allRanges.forEach(wrap => {
  const range = wrap.querySelector(".range");
  const bubble = wrap.querySelector(".range-value");

  range.addEventListener("input", () => {
    setBubble(range, bubble);
  });
  setBubble(range, bubble);
});

function setBubble(range, bubble) {
  const val = range.value;
  const min = range.min ? range.min : 0;
  const max = range.max ? range.max : 100;
  const newVal = Number(((val - min) * 100) / (max - min));
  bubble.innerHTML = FormText[range.id][val];

  // Sorta magic numbers based on size of the native UI thumb
  bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
};

// ---- Tab links for image upload or image URL ----
$('.tablinks').click(function(){
  $('.tabcontent').removeClass('active')
  $('.tablinks').removeClass('active btn-dark')
  let activeTab = $(this).attr('id').slice(0,-3)
  $(`#${activeTab}Content`).addClass('active')
  $(this).addClass('active btn-dark')
});

function validate_image(){
  var uploadedImage = $("#FormPic")
  var imageURL = $("#FormPicUrl")
  uploadedImage.removeAttr('disabled')
  imageURL.removeAttr('disabled')
  if (uploadedImage.val() != "" && imageURL.val() == ""){
    imageURL.removeAttr('required')
    imageURL.prop('disabled', 'true')
    uploadedImage.removeAttr('disabled')
    uploadedImage.attr('required', 'required')
  } // If image is uploaded
  else if (imageURL.val() !="" && uploadedImage.val() == ""){
    uploadedImage.removeAttr('required')
    uploadedImage.prop('disabled', 'true')
    imageURL.removeAttr('disabled')
    imageURL.attr('required', 'required')
  } // If image URL inputted
  // TESTING 
  // $("#FormPic").is(':required')
  // $("#FormPicUrl").is(':required')
  // $("#FormPic").is(':disabled')
  // $("#FormPicUrl").is(':disabled')
}

$('#splashScreenModal a').click(function(){
  $('#splashScreenModal').modal('hide')
});

// sidebar secondary menu animation
$('.arrow-wide').on('click', function() {
    if (!$(this).hasClass('active')) {
        $('.dropdown-menu').addClass('active-side');
        $('.arrow-wide').addClass('active').addClass('open');
        $('#main-content').addClass('sidebar-shown');
        $('body').addClass('hide-overflow');
    }
    else {
        $('.dropdown-menu').removeClass('active-side');
        $('.arrow-wide').removeClass('active').removeClass('open');
        $('#main-content').removeClass('sidebar-shown');
        $('body').removeClass('hide-overflow');
    }
});

$('#primary > .overlay').click(function() {
    $('#main-content').removeClass('sidebar-shown');
    $('body').removeClass('hide-overflow');
    $('.dropdown-menu').removeClass('active-side');
    $('.arrow-wide').removeClass('active').removeClass('open');
});

// click inactive input slider to toggle active state
$(".sliders-wrapper").on("click", ".btn-toggle", function() {
    if (!$(this).closest(".slider").hasClass("active")) {
        $(this).closest(".slider").addClass("active");
    }
});

// hover on chart sliders
$(".slider-chart").on("mouseover", "circle", function() {
    if ($(this).hasClass("economics") || $(this).hasClass("governance") || $(this).hasClass("platform") || $(this).hasClass("porosity") || $(this).hasClass("size")) {
        var property = $(this).attr("class")
        $(".slider-chart .label-values ." + property).addClass("active");
    }
});
$(".slider-chart").on("mouseout", "circle", function() {
    if ($(this).hasClass("economics") || $(this).hasClass("governance") || $(this).hasClass("platform") || $(this).hasClass("porosity") || $(this).hasClass("size")) {
        var property = $(this).attr("class")
        $(".slider-chart .label-values ." + property).removeClass("active");
    }
});
$(".slider-chart").on("mouseover", "text", function() {
    if ($(this).hasClass("economics") || $(this).hasClass("governance") || $(this).hasClass("platform") || $(this).hasClass("porosity") || $(this).hasClass("size")) {
        var property = $(this).attr("class")
        $(".slider-chart .label-values ." + property).addClass("active");
    }
});
$(".slider-chart").on("mouseout", "text", function() {
    if ($(this).hasClass("economics") || $(this).hasClass("governance") || $(this).hasClass("platform") || $(this).hasClass("porosity") || $(this).hasClass("size")) {
        var property = $(this).attr("class")
        $(".slider-chart .label-values ." + property).removeClass("active");
    }
})