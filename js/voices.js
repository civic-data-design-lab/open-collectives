// VARIABLES
var modalLabor = document.getElementById("modal-labor"),
    modalMarket = document.getElementById("modal-market"),
    modalCare = document.getElementById("modal-care"),
    modalLiving = document.getElementById("modal-living");

var questionsData = [],
    responsesData = [];
var themesList = [];
var currentTheme = "labor",
    currentKeys =  [];
var laborData = [],
    marketData = [],
    careData = [],
    livingData = [];

// FUNCTIONS
function openModal(modalId) {
    document.getElementById(modalId).style.display = "block"
    document.getElementById(modalId).classList.add("show");
}
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
  document.getElementById(modalId).classList.remove("show");
}

// load json file and callback function
function getJsonObject(jsonFileName, callback){
    var request = new XMLHttpRequest();
    var jsonPath = './data/' + jsonFileName + '.json';
    request.open('GET', jsonPath, true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
        var type = request.getResponseHeader('Content-Type');
            try {
            callback(JSON.parse(request.responseText));
            }catch(err) {
            callback(err);
            }
        }
    }
}

// generate modals and form inputs for each theme question
function createModals(questionsData) {
    for (i = 0; i < questionsData.length; i++) {
        var theme = questionsData[i].theme,
            modalID = 'modal-' + theme,
            imgSrc = './img/' + theme + '-quest.svg',
            question = questionsData[i].question,
            responses = questionsData[i].responses,
            qType = questionsData[i].type;

        var htmlString = "<div class='modal fade' id='" + modalID + "' tabindex='-1' role='dialog' aria-labelledby='" + theme + "' aria-hidden='true'><div class='modal-dialog modal-dialog-centered' role='document'><div class='modal-content'><img class='img-quest' src='" + imgSrc + "' alt='" + titleCase(theme) + " Question Background'><div class='modal-header'><h3 class='h4 mb-3'>" + question + "</h3><button type='button' class='close' data-dismiss='modal' aria-label='Close' onclick='closeModal('" + modalID + "')'><span aria-hidden='true'>&times;</span></button></div><div class='modal-body'>";
        var modalStringEnd = "</div><div class='modal-footer'></div></div></div></div>";

        for (j = 0; j < responses.length; j++) {
            var rID = responses[j].rID,
                rLong = responses[j].long;
            var responseString = "<input class='form-check-input' type='" + qType + "' name='" + theme + "' id='" + rID + "' value='" + rID + "'><label class='form-check-label' for='" + rID + "'>" + rLong + "</label>";

            htmlString += responseString;
        };

        htmlString += modalStringEnd;
        $('#form').append(htmlString);
    }
}

// change results theme content
function changeTheme(lastTheme, currentTheme) {
    currentTabID = "#tab-" + currentTheme;

    $("#results").removeClass(lastTheme)
        .addClass(currentTheme);
    $(".tile").removeClass("active");
    $(currentTabID).addClass("active");
};

// QUESTIONS DATA
// get questions json data and generate modals and form inputs for each theme
getJsonObject("questions", function(data){
    questionsData = data;
    themesList = data.map(d => d.theme);
    console.log(themesList);

    // for (var i = 0; i < data.length; i++) {
        
    //     let qTheme = data[i].qTheme;
    //     item = {};

    //     item.theme = qTheme;
    //     item.responses = data[i].responses.map(d => d.rID);

        // themesList.push(item);

    //     for (var i = 0; j < data.length; j++) {
    //         let rKey = data[i].responses[j].rID;
    //         // rCount = data.filter(d => d.rID == rKey).length;

    //         item.theme = qTheme;
    //         item.rID = data[i].responses[j].rID;
            
    //     }
        
    // }

    createModals(questionsData);
    // console.log(data);
    
});

// get results json data and visualize data
getJsonObject("responses-test", function(data) {
    responsesData = data;

    // if (!rTotal) {
    //     rTotal = data.length;
    // }

    console.log(responsesData);
    console.log(questionsData);
});

// EVENTS
// close modal on click
window.onclick = function (event) {
    if (event.target == modalLabor) {
        closeModal('modal-labor')
    }
    else if (event.target == modalMarket) {
        closeModal('modal-market')
    }
    else if (event.target == modalCare) {
        closeModal('modal-care')
    }
    else if (event.target == modalLiving) {
        closeModal('modal-living')
    }
};
// keep results section at top when resizing window
$(window).resize(function() {
    if (window.location.href.endsWith("#results")) {
        $("html, body").animate({scrollTop: winHeight});
    }
});

// click tile to change results theme
$(".tile").on("click", function() {
    lastTheme = currentTheme;
    currentTheme = $(this).attr("id").slice(4);
    // console.log(currentTheme);

    if (!$("#results").hasClass(currentTheme)) {
        changeTheme(lastTheme, currentTheme);
    };
});

// click arrows to change results theme
$("#arrow-prev").on("click", function() {
    indexLastTheme = themesList.indexOf(currentTheme);
    
    if (indexLastTheme == 0) {
        indexNextTheme = themesList.length - 1;
    }
    else {
        indexNextTheme = indexLastTheme - 1;
    }
    
    lastTheme = themesList[indexLastTheme];
    currentTheme = themesList[indexNextTheme];
    changeTheme(lastTheme, currentTheme);
});
$("#arrow-next").on("click", function() {
    indexLastTheme = themesList.indexOf(currentTheme);
    
    if (indexLastTheme == themesList.length - 1) {
        indexNextTheme = 0;
    }
    else {
        indexNextTheme = indexLastTheme + 1;
    }
    
    lastTheme = themesList[indexLastTheme];
    currentTheme = themesList[indexNextTheme];
    changeTheme(lastTheme, currentTheme);
});

$(document).ready(function() {
    // console.log("ready!");
})