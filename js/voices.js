// QUESTIONS DATA
// get questions json data and generate modals and form inputs for each theme
getJsonObject("questions", function(data){
    questionsData = data;

    themesList = data.map(d => d.theme);
    currentIndex = themesList.indexOf(currentTheme);

    // response list
    for (var i = 0; i < themesList.length; i++) {
        let theme = themesList[i];
        responseList = data[i].responses.map(d => d.rID);

        (theme == "labor") ? (laborResponses = responseList)
            : (theme == "market") ? (marketResponses = responseList)
            : (theme == "care") ? (careResponses = responseList)
            : (theme == "living") ? (livingResponses = responseList)
            : responseList = undefined;
    }

    // load on start up
    createModals(questionsData);
    changeTheme("", currentTheme);
    // console.log(data);
});

// RESULTS DATA
// get results json data and visualize data
getJsonObject("responses-test", function(data) {
    responsesData = data;
    currentIndex = themesList.indexOf(currentTheme);

    for (var t = 0; t < themesList.length; t++) {
        let theme = themesList[t];
        item = {};
        item.theme = theme;

        (theme == "labor") ? (responseList = laborResponses)
            : (theme == "market") ? (responseList = marketResponses)
            : (theme == "care") ? (responseList = careResponses)
            : (theme == "living") ? (responseList = livingResponses)
            : (responseList = undefined);

        let responseData = [];

        if (theme == "care" || theme == "market") {
            for (var i = 0; i < data.length; i++) {
                responseData.push(data[i][theme]);
            }
        }
        else if (theme == "labor" || theme == "living") {
            for (var i = 0; i < data.length; i++) {
                responseData = responseData.concat(data[i][theme]);
            }
        }

        item.total = responseData.length;
        totalResponses = responseData.reduce((accumulator, response) => {
            if (!item[response]) {
                item[response] = 1;
            } else {
                item[response]++;
            }
        });

        surveyData.push(item);
    };

    currentResponses = laborResponses;
    currentData = surveyData[currentIndex];
    currentBarData = getSortedBarData(currentData);
    plotHorizontalBar(svgLabor, currentBarData);
    $("." + topResponse).addClass("active");
    headlineTooltip();
    percentTooltip();

    // console.log(currentData);
    console.log(surveyData);
    console.log(responsesData);
    console.log(questionsData);
});

// VARIABLES
var modalLabor = document.getElementById("modal-labor"),
    modalMarket = document.getElementById("modal-market"),
    modalCare = document.getElementById("modal-care"),
    modalLiving = document.getElementById("modal-living");

var questionsData = [],
    responsesData = [],
    surveyData = [];
var themesList = [];
var currentTheme = "labor",
    currentIndex = themesList.indexOf(currentTheme),
    currentResponses = [],
    currentData = [],
    currentBarData = [],
    topResponse = "teamwork";
var laborResponses = [],
    marketResponses = [],
    careResponses = [],
    livingResponses = [];

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
    currentIndex = themesList.indexOf(currentTheme);
    currentTabID = "#tab-" + currentTheme;

    $("#results").removeClass(lastTheme)
        .addClass(currentTheme);
    $(".tile").removeClass("active");
    $(currentTabID).addClass("active");

    $("#theme-question").html(questionsData[currentIndex].question);
    $("#theme-name").text(currentTheme);
    $("#theme-learn").html(questionsData[currentIndex].learn);
    $("#theme-link").attr("href", "./" + currentTheme);
    $("#theme-link > span").text(currentTheme + "-based collectives");

    // console.log(currentTheme);
};
function changeThemeData(currentTheme) {
    themeIndex = themesList.indexOf(currentTheme);
    currentData =  surveyData[currentIndex];
    currentBarData = getSortedBarData(currentData);
    currentChartID = "#chart-" + currentTheme;

    (currentTheme == "labor") ? currentResponses = laborResponses
    : (currentTheme == "market") ? currentResponses = marketResponses
    : (currentTheme == "care") ? currentResponses = careResponses
    : (currentTheme == "living") ? currentResponses = livingResponses
    : currentResponses = undefined;

    (currentTheme == "labor") ? svg = svgLabor
    : (currentTheme == "living") ? svg = svgLiving
    : svg = undefined;

    $(".chart.active").removeClass("active");
    $(currentChartID).addClass("active");
    if (currentTheme == "labor" || currentTheme == "living") {
        // plotHorizontalBar(svg, currentBarData);
        // percentTooltip();
        // headlineTooltip();
    }
    console.log(currentData);
    console.log(currentBarData);
    console.log(topResponse);
}

// CREATE D3 CHARTS
// aspect ratio
const width = 400;
const height = 300;
const margin = {
    top: 10,
    right: 50,
    bottom: 10,
    left: 100
};

// define svg
const svgLabor = d3.select("#chart-labor")
    .append("svg")
        .attr("viewBox", [0, 0, width, height]);
const svgLiving = d3.select("#chart-living")
    .append("svg")
        .attr("viewBox", [0, 0, width, height]);
// tooltip
var divPercent = d3.select("#headline-percent")
    .text("");
var divHeadline = d3.select("#headline-description")
    .text("");

// headline text
function percentTooltip() {
    divPercent.html(divHtml => {
        return roundAccurately(currentBarData[0].percent * 100, 0) + "%";
    })
}
function headlineTooltip() {
    divHeadline.html(divHtml => {
        themeIndex = themesList.indexOf(currentTheme);
        responseIndex = currentResponses.indexOf(topResponse);
        return questionsData[themeIndex].responses[responseIndex].headline;
    });
}

// get sorted data for chart
function getSortedBarData(data) {
    let barData = [];
    for (var i = 0; i < currentResponses.length; i++) {
        let rID = currentResponses[i];

        let item = {};
        item.rID = rID;
        item.value = data[rID];
        item.percent = data[rID] / data.total;
        item.short = questionsData[currentIndex].responses[i].short;
        item.headline = questionsData[currentIndex].responses[i].headline;

        barData.push(item);
    };
    sortedData = barData.slice().sort((a, z) => d3.descending(a.value, z.value));
    topResponse = sortedData[0].rID;
    return sortedData;
    // console.log(barData);
}

// plot horizontal bar chart
function plotHorizontalBar(svg, barData) {
    // currentBarData = getSortedBarData(data);

    x = d3.scaleLinear()
        .domain([0, d3.max(barData, d => +d.percent)])
        .range([margin.left, width - margin.right]);

    y = d3.scaleBand()
        .domain(d3.range(barData.length))
        .rangeRound([margin.top, height - margin.bottom])
        .padding(0.2);

    // bar rect
    svg.append("g")
            .attr("class", "chart-bar")
        .selectAll("rect")
        .data(barData)
        .enter()
        .append("rect")
            .attr("id", d => d.rID)
            .attr("x", x(0))
            .attr("y", (d, i) => y(i))
            .attr("width", (d) => x(d.percent) - x(0))
            .attr("height", y.bandwidth())
            .attr("fill", (d,i) => {
                return (i == 0) ? "#D96B6D"
                : "#F8C5D7"})
        .on("mouseover", function(event, d) {
            d3.selectAll("rect")
                .transition()
                .duration("50")
                .attr("fill", "#F8C5D7")
            d3.select(this)
                .transition()
                .duration("50")
                .attr("fill", "#D96B6D")
            
            let chartClass = "." + $(this).attr("id");
            $("text").removeClass("active");
            $(chartClass).addClass("active");
        });
    // percent text labels
    svg.append("g")
            .attr("fill", "#D96B6D")
            .attr("text-anchor", "end")
            .attr("class", "chart-label")
        .selectAll("text")
        .data(barData)
        .enter()
        .append("text")
            .attr("class", d => d.rID)
            .attr("x", d => x(d.percent))
            .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("dx", -4)
            .text(d => roundAccurately(d.percent * 100, 0) + '%')
        .call(text => text.filter(d => x(d.percent) - x(0) < 20))
            .attr("dx", +4)
            .attr("text-anchor", "start");
    // description text labels
    svg.append("g")
            .attr("fill", "#333")
            .attr("text-anchor", "end")
            .attr("class", "chart-short")
        .selectAll("text")
        .data(barData)
        .enter()
        .append("text")
            .attr("class", d => d.rID)
            .attr("x", d => x(0) - 10)
            .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("opacity", 0.5)
            .text(d => d.short)
        .call(wrapText, 85);
    // headline
    // divPercent.html(divHtml => percentTooltip());
    // divHeadline.html(divHtml => headlineTooltip());
};

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

    if (!$("#results").hasClass(currentTheme)) {
        changeTheme(lastTheme, currentTheme);
        // changeThemeData(currentTheme);
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