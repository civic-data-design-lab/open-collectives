// VARIABLES
var modalLabor = document.getElementById("modal-labor"),
    modalMarket = document.getElementById("modal-market"),
    modalCare = document.getElementById("modal-care"),
    modalLiving = document.getElementById("modal-living");
    // modalThanks = document.getElementById("modal-thanks");

var questionsData = [],
    responsesData = [],
    surveyData = [];
var laborData = [],
    marketData = [],
    careData = [],
    livingData = [];
var laborChartData = [],
    livingChartData = [];
var themesList = [];
var currentTheme = "labor",
    currentIndex = themesList.indexOf(currentTheme);
var laborResponses = [],
    marketResponses = [],
    careResponses = [],
    livingResponses = [];
var laborTopResponse = "",
    marketTopResponse = "",
    careTopResponse = "",
    livingTopResponse = "";
var rowID = null,
    country = null,
    admin1 = null,
    city = null;

// D3 CHART VARIABLES
const width = 400;
const height = 300;
const margin = {
    top: 10,
    right: 50,
    bottom: 10,
    left: 100
};
const donutWidth = 60;
const radius = Math.min(width, (height - donutWidth * 2/3)) / 2;

// define svg
const svgLabor = d3.select("#chart-labor")
    .append("svg")
    .attr("class", "bar-horz")
    .attr("viewBox", [0, 0, width, height]);
const svgMarket = d3.select("#chart-market")
    .append("svg")
    .attr("class", "donut")
    .attr("viewBox", [-width/2, -height/2, width, height]);
const svgCare = d3.select("#chart-care")
    .append("svg")
    .attr("class", "donut")
    .attr("viewBox", [-width/2, -height/2, width, height]);
const svgLiving = d3.select("#chart-living")
    .append("svg")
    .attr("class", "bar-horz")
    .attr("viewBox", [0, 0, width, height]);

// tooltip
var divPercent = d3.select("#headline-percent")
    .text("");
var divHeadline = d3.select("#headline-description")
    .text("");

// donut chart
var arc = d3.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

var pie = d3.pie()
    .value(d => d.value)
    .padAngle(0.025)
    .sort(null);

// CALL DATA PARSE FUNCTIONS
// load json file and callback function
function getJsonObject(jsonFileName, callback) {
    var request = new XMLHttpRequest();
    var jsonPath = './data/' + jsonFileName + '.json';
    request.open('GET', jsonPath, true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            try {
                callback(JSON.parse(request.responseText));
            } catch (err) {
                callback(err);
            }
        }
    }
}

// QUESTIONS DATA
// get questions json data and generate modals and form inputs for each theme
if (questionsData.length == 0) {
    getJsonObject("questions", function (data) {
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
        };
    
        // load on start up
        createModals(questionsData);
        changeTheme("", currentTheme);
        // console.log(data);
    });
}

// RESULTS DATA
// get results json data and visualize data
// getJsonObject("responses-test", function (data) {
jQuery.getJSON("./responses", function(data) {
    responsesData = data;

    for (var t = 0; t < themesList.length; t++) {
        let theme = themesList[t];
        item = {};
        item.theme = theme;

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

        responseData.forEach((response) => {
            if (response == null || response == "{}") {
                if (!item.nullValue) {
                    item.nullValue = 1;
                } else {
                    item.nullValue++;
                }
            } else if (!item[response]) {
                item[response] = 1;
            } else {
                item[response]++;
            }
        });
        if (!item.nullValue) {
            item.total = responseData.length;
        } else {
            item.total = responseData.length - item.nullValue;
        }

        (theme == "labor") ? (laborData = item)
            : (theme == "market") ? (marketData = item)
                : (theme == "care") ? (careData = item)
                    : (theme == "living") ? (livingData = item)
                        : themeData = undefined;

        surveyData.push(item);
    };

    try {
        laborChartData = getSortedChartData(laborData);
        marketChartData = getSortedChartData(marketData);
        careChartData = getSortedChartData(careData);
        livingChartData = getSortedChartData(livingData);
    }
    catch {
        console.error(error);

        getJsonObject("questions", function (qdata) {
            questionsData = qdata;
            console.log(questionsData);

            themesList = qdata.map(d => d.theme);
            currentIndex = themesList.indexOf(currentTheme);
        
            // response list
            for (var i = 0; i < themesList.length; i++) {
                let theme = themesList[i];
                responseList = qdata[i].responses.map(d => d.rID);
        
                (theme == "labor") ? (laborResponses = responseList)
                    : (theme == "market") ? (marketResponses = responseList)
                        : (theme == "care") ? (careResponses = responseList)
                            : (theme == "living") ? (livingResponses = responseList)
                                : responseList = undefined;
            };
        
            // load on start up
            createModals(questionsData);
            changeTheme("", currentTheme);
            // console.log(data);

            laborChartData = getSortedChartData(laborData);
            marketChartData = getSortedChartData(marketData);
            careChartData = getSortedChartData(careData);
            livingChartData = getSortedChartData(livingData);
        });
    }
    finally {
        plotHorizontalBar(svgLabor, laborChartData);
        plotHorizontalBar(svgLiving, livingChartData);
        plotDonutChart(svgMarket, marketChartData);
        plotDonutChart(svgCare, careChartData);

        $(".chart").addClass("inactive");
        $("." + laborTopResponse).removeClass("inactive").addClass("active");
        percentTooltip(laborChartData);
        headlineTooltip(laborChartData);
    }

    // console.log(surveyData);
    // console.log(responsesData);
    // console.log(questionsData);
    // console.log(laborData);
});

// FUNCTIONS
// generate modals and form inputs for each theme question
function createModals(questionsData) {
    var modalTemplate = $(".modal.template");
    questionsData.forEach((question) => {
        var modal = modalTemplate.clone();
        var theme = question.theme,
            modalId = "modal-" + question.theme,
            cardId = "card-" + question.theme,
            questionText = question.question,
            responses = question.responses,
            qType = question.type,
            miniChartId = "mini-chart-" + question.theme;

        modal.attr("id", modalId).attr("aria-labelledby", theme);
        modal.find(".card").attr("id", cardId);
        modal.find(".h5:not(#location-question)").html(questionText);
        modal.find(".btn-rotate").attr("data-card", cardId);
        // modal.find(".continue").attr("onclick", closeModal(modalID));
        responses.forEach((response) => {
            var rID = response.rID,
                rLong = response.long;

            var responseString = "<input class='form-check-input' type='" + qType + "' name='" + theme + "' id='" + rID + "' value='" + rID + "'><label class='form-check-label' for='" + rID + "'>" + rLong + "</label>";

            modal.find(".card-front .modal-body").append(responseString);
        });
        modal.find(".mini-chart").attr("id", miniChartId);

        modal.removeClass("template").appendTo(modalTemplate.parent());
    });
};
// open and close modals
function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
    document.getElementById(modalId).classList.add("show");

    var theme = modalId.slice(6),
        modalSelectorId = "#form #modal-" + theme,
        miniChartId = "#" + $(modalSelectorId).find(".mini-chart").attr("id");
    
    if ($(miniChartId).children().length == 0) {
        if (theme == "labor") {
            const svgMiniLabor = d3.select("#form #mini-chart-labor")
                .append("svg")
                .attr("class", "bar-horz")
                .attr("viewBox", [-10, 0, width, height]);
            plotHorizontalBar(svgMiniLabor, laborChartData);
        }
        else if (theme == "market") {
            const svgMiniMarket = d3.select("#form #mini-chart-market")
                .append("svg")
                .attr("class", "donut")
                .attr("viewBox", [-width/2, -height/2, width, height]);
            plotDonutChart(svgMiniMarket, marketChartData);
        }
        else if (theme == "care") {
            const svgMiniCare = d3.select("#form #mini-chart-care")
                .append("svg")
                .attr("class", "donut")
                .attr("viewBox", [-width/2, -height/2, width, height]);
            plotDonutChart(svgMiniCare, careChartData);
        }
        else if (theme == "living") {
            const svgMiniLiving = d3.select("#form #mini-chart-living")
                .append("svg")
                .attr("class", "bar-horz")
                .attr("viewBox", [-10, 0, width, height]);
            plotHorizontalBar(svgMiniLiving, livingChartData);
        }
    };
}
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
    document.getElementById(modalId).classList.remove("show");

    // if (modalId == "modal-thanks") {
    //     window.location.hash = "#results";
    //     $("html, body").animate({ scrollTop: winHeight });
        // console.log("continue to results");
    // }
}

// submit form data
function submitForm(theme) {
    const params = new URLSearchParams();
        if (country == null) {
            country = $("#modal-" + theme + " .form-select").val();
            admin1 = $("#modal-" + theme + " #admin1").val();
            city = $("#modal-" + theme + " #city").val();
        }
        params.set("country", country);
        params.set("admin1", admin1);
        params.set("city", city);

        inputName = "input[name='" + theme + "']:checked";

        if ($(inputName).val() !== undefined) {
            if (theme == "labor" || theme == "living") {
                checkedList = $(inputName).map(function() {return $(this).val()}).toArray();
                checkedList.forEach((value) => params.append(theme, value));
            } else {
                params.set(theme, $(inputName).val());
            }
        };
        
        // if (rowID == null) {
        //     console.log("first submit, insert new data row. rowID = ", rowID);
        // }
        // else {
        //     params.set("rowID", rowID);
        //     console.log("not first submit, update last data row. rowID = ", rowID);
        // };

        $.ajax({
            method: 'GET',
            url: '/survey?' + params.toString(),
            success: function(result) {
                // rowID = result.rowID[0];
                // console.log(result);
                params.delete(theme);
                // console.log(params);
            }
        });
};

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
    currentChartID = "#chart-" + currentTheme;

    (currentTheme == "labor") ? (currentChartData = laborChartData, topResponse = laborTopResponse)
        : (currentTheme == "market") ? (currentChartData = marketChartData, topResponse = marketTopResponse)
            : (currentTheme == "care") ? (currentChartData = careChartData, topResponse = careTopResponse)
                : (currentTheme == "living") ? (currentChartData = livingChartData, topResponse = livingTopResponse)
                    : (currentChartData = undefined);

    $(".chart.active").removeClass("active").addClass("inactive");
    $(currentChartID).removeClass("inactive").addClass("active");

    percentTooltip(currentChartData);
    headlineTooltip(currentChartData);
    $("rect").removeClass("active");
    $("path").removeClass("active");
    $("text").removeClass("active");
    $("." + topResponse).addClass("active");
}

// CREATE D3 CHARTS
// get sorted data for chart
function getSortedChartData(data) {
    let barData = [];

    theme = data.theme;
    themeIndex = questionsData.findIndex(d => d.theme == data.theme);
    themeResponses = questionsData[themeIndex].responses;
    topValue = data[themeResponses[0].rID];
    topResponse = themeResponses[0].rID;
    for (var i = 0; i < themeResponses.length; i++) {
        let rID = themeResponses[i].rID;

        let item = {};
        item.theme = theme;
        item.rID = rID;
        item.value = data[rID];
        item.percent = data[rID] / data.total;
        item.short = questionsData[themeIndex].responses[i].short;
        item.headline = questionsData[themeIndex].responses[i].headline;

        if (data[rID] > topValue) {
            topValue = data[rID];
            topResponse = rID;
        }
        barData.push(item);
    };
    sortedData = barData.slice().sort((a, z) => d3.descending(a.value, z.value));

    (theme == "labor") ? (laborTopResponse = topResponse)
        : (theme == "market") ? (marketTopResponse = topResponse)
            : (theme == "care") ? (careTopResponse = topResponse)
                : (theme == "living") ? (livingTopResponse = topResponse)
                    : (topValue = undefined);

    return sortedData;
    // console.log(barData);
}

// headline text
function percentTooltip(themeData) {
    divPercent.html(divHtml => {
        return roundAccurately(themeData[0].percent * 100, 0) + "%";
    })
}
function headlineTooltip(themeData) {
    divHeadline.html(divHtml => {
        return themeData[0].headline;
    });
}

// plot horizontal bar chart
function plotHorizontalBar(svg, barData) {
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
            .attr("class", d => d.rID)
            .attr("x", x(0))
            .attr("y", (d, i) => y(i))
            .attr("width", (d) => x(d.percent) - x(0))
            .attr("height", y.bandwidth())
            .attr("fill", (d, i) => {
                return (i == 0) ? "#D96B6D"
                    : "#F8C5D7"
            })
        .on("mouseover", function (event, d) {
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
            $("rect").removeClass("active");
            $(chartClass).addClass("active");
        });
    // percent text labels
    svg.append("g")
        .attr("class", "chart-label")
        .attr("fill", "#D96B6D")
        .attr("text-anchor", "end")
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
    // short text labels
    svg.append("g")
        .attr("class", "chart-short")
        .attr("fill", "#333")
        .attr("text-anchor", "end")
        .selectAll("text")
        .data(barData)
        .enter()
        .append("text")
            .attr("class", d => d.rID)
            .attr("x", d => x(0) - 10)
            .attr("y", (d, i) => {
                return (d.rID == "teamwork" || d.rID == "agency" || d.rID == "robots" || d.rID == "community" || d.rID == "privacy") ? y(i) + y.bandwidth() / 2 - 5
                : y(i) + y.bandwidth() / 2;
            })
            .attr("dy", "0.35em")
            // .attr("dx", "0")
            .attr("opacity", 0.5)
            .text(d => d.short)
        .call(wrapText, 100);
};

// plot donut chart
function plotDonutChart(svg, donutData) {
    arcs = pie(donutData);
    // donut sections
    svg.append("g")
            .attr("class", "chart-donut")
        .selectAll("path")
        .data(arcs)
        .enter()
        .append("path")
            .attr("id", d => d.data.rID)
            .attr("class", d => d.data.rID)
            .attr("d", arc)
            .attr("fill", (d, i) => {
                return (i == 0) ? "#D96B6D"
                    : "#F8C5D7"
            })
        .on("mouseover", function (event, d) {
            d3.selectAll("path")
                .transition()
                .duration("50")
                .attr("fill", "#F8C5D7")
            d3.select(this)
                .transition()
                .duration("50")
                .attr("fill", "#D96B6D")

            let chartClass = "." + $(this).attr("id");
            $("text").removeClass("active");
            $("path").removeClass("active");
            $(chartClass).addClass("active");
        });
    // percentage text label
    svg.append("g")
        .attr("class", "chart-label")
        .attr("fill", "#D96B6D")
        .selectAll("text")
        .data(arcs)
        .enter()
        .append("text")
            .attr("class", d => d.data.rID)
            .attr("x", -45)
            .attr("y", 15)
            // .attr("dy", "-0.5em")
            .attr("text-anchor", "center")
            .text(d => roundAccurately(d.data.percent * 100, 0) + '%');
    // text short labels
    svg.append("g")
            .attr("class", "chart-short")
        .selectAll("text")
        .data(arcs)
        .enter()
        .append("text")
            .attr("class", d => d.data.rID)
            .attr("text-anchor", d => {
                midAngle = (d.endAngle - d.startAngle) / 2 + d.startAngle;
                return (midAngle <= Math.PI) ? "start" 
                : "end"
            })
            .attr("x", 0)
            .attr("y", 0)
            .attr("dy", 0.35)
            // .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("transform", d => {
                midAngle = (d.endAngle - d.startAngle) / 2 + d.startAngle;
                centroid = arc.centroid(d);
                return (midAngle <= 1/12 * 2 * Math.PI) ? `translate( ${centroid[0] + donutWidth} , ${centroid[1] + donutWidth/2} )`
                : (1/12 * 2 * Math.PI < midAngle && midAngle <= 2/12 * 2 * Math.PI) ? `translate( ${centroid[0] + donutWidth * 1/2} , ${centroid[1] - donutWidth * 4/5} )`
                : (2/12 * 2 * Math.PI < midAngle && midAngle <= 4/12 * 2 * Math.PI) ? `translate( ${centroid[0] + donutWidth * 2/3} , ${centroid[1]} )`
                : (4/12 * 2 * Math.PI < midAngle && midAngle <= 5/12 * 2 * Math.PI) ? `translate( ${centroid[0] + donutWidth * 1/2} , ${centroid[1] + donutWidth * 1/2} )`
                : (5/12 * 2 * Math.PI < midAngle && midAngle <= Math.PI) ? `translate( ${centroid[0] + donutWidth} , ${centroid[1] + donutWidth/2} )`
                : (Math.PI < midAngle && midAngle <= 7/12 * 2 * Math.PI) ? `translate( ${centroid[0] - donutWidth} , ${centroid[1] + donutWidth/3} )`
                : (7/12 * 2 * Math.PI < midAngle && midAngle <= 8/12 * 2 * Math.PI) ? `translate( ${centroid[0] - donutWidth * 1/2} , ${centroid[1] + donutWidth * 1/2} )`
                : (8/12 * 2 * Math.PI < midAngle && midAngle <= 10/12 * 2 * Math.PI) ? `translate( ${centroid[0] - donutWidth * 2/3} , ${centroid[1]} )`
                : (10/12 * 2 * Math.PI < midAngle && midAngle <= 11/12 * 2 * Math.PI) ? `translate( ${centroid[0] - donutWidth * 1/2} , ${centroid[1] - donutWidth * 4/5} )`
                : `translate( ${centroid[0] - donutWidth/6} , ${centroid[1] - donutWidth*4/5} )`
            })
            .text(d => d.data.short)
        .call(wrapText, 80);
}

// EVENTS
// sidebar secondary menu animation
function closeSidebar() {
    if (winWidth < 384) {
        $('#sidebar').css('left', -winWidth);
    }
    else {
        $('#sidebar').css('left','-24rem');
    }
    $('main').css('margin-left','auto');
    $('.sidebtn').css('left','0px');
    $('#fade-sidebar').removeClass('show').css('z-index','-1');
    $('.dropdown-menu').removeClass('active-side');
    $('.arrow-wide').removeClass('active');
};

$('.arrow-wide').on('click', function() {
    if (!$(this).hasClass('active')) {
        if (winWidth < 384) {
            $('.sidebtn').css('left','calc(100vw - 2rem)');
        }
        else {
            $('.sidebtn').css('left','22rem');
        }
        $('#fade-sidebar').addClass('show').css('z-index','4');
        $('#sidebar').css('left','0rem');
        $('main').css('margin-left','26rem');
        $('.dropdown-menu').addClass('active-side');
        $('.arrow-wide').addClass('active');
    }
    else {
        closeSidebar();
    }
});
$('.close-sidebar').on('click', function() {
    closeSidebar();
});
  
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
    // else if (event.target == modalThanks) {
    //     closeModal('modal-thanks');
    // }
};
// keep results section at top when resizing window
$(window).resize(function () {
    if (window.location.href.endsWith("#results")) {
        $("html, body").animate({ scrollTop: winHeight });
    }
    if (winWidth < 384) {
        $(".sidebar").css("width", winWidth);
        if ($(".arrow-wide").hasClass("active")) {
            $('.sidebtn').css('left','calc(100vw - 2rem)');
        }
        else {
            $(".sidebar").css("left", -winWidth);
        }
    }
    else {
        $(".sidebar").css("width", "24rem");
        if ($(".arrow-wide").hasClass("active")) {
            $('.sidebtn').css('left','22rem');
        }
        else {
            $(".sidebar").css("left", "-24rem");
        }
    }
});
// click tile to change results theme
$("#results .tile").on("click", function () {
    lastTheme = currentTheme;
    currentTheme = $(this).attr("id").slice(4);

    if (!$("#results").hasClass(currentTheme)) {
        changeTheme(lastTheme, currentTheme);
        changeThemeData(currentTheme);
    };
});

// click arrows to change results theme
$("#arrow-prev").on("click", function () {
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
    changeThemeData(currentTheme);
});
$("#arrow-next").on("click", function () {
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
    changeThemeData(currentTheme);
});

$(document).ready(function () {
    // if input checked
    $("#form").on("click", ".form-check-input", function() {
        var themeName = $(this).attr("name");
        // tile colored images if input checked
        if ($(this).is(":checked")) {
            $("#btn-" + themeName + " .img-pos").css("opacity", 0);
            $("#btn-" + themeName + " .img-neg").css("opacity", 0);
            $("#btn-" + themeName + " .img-color").css("opacity", 1);
            $("#form #modal-" + themeName + " .btn-next").removeAttr("disabled");
            $("#form #modal-" + themeName + " .card-front .btn-submit").removeAttr("disabled");
            // console.log(themeName + " checked");
        }
        else if (!$(".form-check-input[name*=" + themeName + "]").is(":checked")) {
            $("#btn-" + themeName + " .img-color").css("opacity", 0);
            $("#btn-" + themeName + " .img-pos").css("opacity", 1);
            $("#form #modal-" + themeName + " .btn-submit").attr("disabled", true);
        }
        // if all items checked
        // if ($("input[name*='labor']").is(":checked") && $("input[name*='market']").is(":checked") && $("input[name*='care']").is(":checked") && $("input[name*='living']").is(":checked")) {
        //     $("#btn-view-results").addClass("ready");
        // }
        // if all items checked
        // else if ($(".form-check-input").is(":checked")) {
        //     $("#btn-view-results").removeClass("disable");
        // }
    });
    // first submit with location & remove/hide other location questions
    $("#form").on("change", ".form-location", function() {
        var themeName = $(this).closest(".modal").attr("id").slice(6);

        if ($("#form #modal-" + themeName + " .form-select").val() != "Select country" && $("#form #modal-" + themeName + " #city").val() != "") {
            $("#form #modal-" + themeName + " .location-content .btn-submit").removeAttr("disabled");
        }
    });
    // flip card on input submit
    $("#form").on("click", ".btn-rotate", function() {
        var cardId = "#" + $(this).attr("data-card"),
            theme = cardId.slice(6);

        if (!$(this).hasClass("btn-back")) { // card flip forward
            if ($(this).hasClass("btn-submit")) {
                submitForm(theme);
                if ($(this).hasClass("location-submit")) {
                    $("#form .card-front .btn-submit").removeClass("hidden");
                    $("#form .card-front .btn-next").remove();
                    $("#form .location-content").addClass("hidden");
                    $("#form .results-content").removeClass("hidden");
                }

                $(cardId + " .card-front .btn-submit").remove();
                $(cardId + " .btn-flip").removeClass("hidden");
            }
            // show highlighed response on chart
            if ($(cardId).find("input").is(":checked")) {
                $("#form " + cardId + " rect").removeClass("active");
                $("#form " + cardId + " path").removeClass("active");
                $("#form " + cardId + " text").removeClass("active");

                if ($(cardId).find("input").attr("type") == "checkbox") {
                    checkedResponses = $(cardId).find("input:checked").map(function() {return $(this).val()}).toArray();
                    checkedResponses.forEach(response => {
                        $("#form " + cardId + " ." + response).addClass("active");
                    })
                }
                else if ($(cardId).find("input").attr("type") == "radio") {
                    hightlightResponse = "#form " + cardId + " ." + $(cardId).find("input:checked").val();
                    $(hightlightResponse).addClass("active");
                }
            }
            else {
                (theme == "labor") ? (topResponse = laborTopResponse)
                    : (theme == "market") ? (topResponse = marketTopResponse)
                        : (theme == "care") ? (topResponse = careTopResponse)
                            : (theme == "living") ? (topResponse = livingTopResponse)
                                : (topResponse = undefined);

                $("#form " + cardId + " rect").removeClass("active");
                $("#form " + cardId + " path").removeClass("active");
                $("#form " + cardId + " text").removeClass("active");
                $("#form " + cardId + " ." + topResponse).addClass("active");
            }
            $(cardId).addClass("flipped");
        }
        else if ($(this).hasClass("btn-back")) { // card flip back
            $(cardId).removeClass("flipped");
        };
        
        // console.log($(this).attr("data-card"));
    });
    // console.log("ready!");
})