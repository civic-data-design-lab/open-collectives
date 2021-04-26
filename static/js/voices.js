// VARIABLES
var modalLabor = document.getElementById("modal-labor"),
    modalMarket = document.getElementById("modal-market"),
    modalCare = document.getElementById("modal-care"),
    modalLiving = document.getElementById("modal-living"),
    modalThanks = document.getElementById("modal-thanks");

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
    .attr("viewBox", [0, 0, width, height]);
const svgMarket = d3.select("#chart-market")
    .append("svg")
    .attr("viewBox", [-width/2, -height/2, width, height]);
const svgCare = d3.select("#chart-care")
    .append("svg")
    .attr("viewBox", [-width/2, -height/2, width, height]);
const svgLiving = d3.select("#chart-living")
    .append("svg")
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
    }

    // load on start up
    createModals(questionsData);
    changeTheme("", currentTheme);
    // console.log(data);
});

// RESULTS DATA
// get results json data and visualize data
getJsonObject("responses-test", function (data) {
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

        item.total = responseData.length;
        responseData.forEach((response) => {
            if (!item[response]) {
                item[response] = 1;
            } else {
                item[response]++;
            }
        });

        (theme == "labor") ? (laborData = item)
            : (theme == "market") ? (marketData = item)
                : (theme == "care") ? (careData = item)
                    : (theme == "living") ? (livingData = item)
                        : themeData = undefined;

        surveyData.push(item);
    };

    laborChartData = getSortedChartData(laborData);
    marketChartData = getSortedChartData(marketData);
    careChartData = getSortedChartData(careData);
    livingChartData = getSortedChartData(livingData);

    // laborData = getSortedChartData(surveyData[0]);

    plotHorizontalBar(svgLabor, laborChartData);
    plotHorizontalBar(svgLiving, livingChartData);
    plotDonutChart(svgMarket, marketChartData);
    plotDonutChart(svgCare, careChartData);

    $(".chart").addClass("inactive");
    $("." + laborTopResponse).removeClass("inactive").addClass("active");
    percentTooltip(laborChartData);
    headlineTooltip(laborChartData);

    console.log(surveyData);
    console.log(responsesData);
    console.log(questionsData);
    // console.log(laborData);
});

// FUNCTIONS
// open and close modals
function openModal(modalId) {
    if (modalId == "modal-thanks") {
        // $(modalId).modal({
        //     show: 'false',
        //     backdrop: 'static',
        //     keyboard: false
        // });
        document.getElementById('form').submit(function(e) {
            e.preventDefault();
            // $(this).submit();
            document.getElementById(modalId).style.display = "block";
            document.getElementById(modalId).classList.add("show");
        });
    }
    else {
        document.getElementById(modalId).style.display = "block";
        document.getElementById(modalId).classList.add("show");
    }
}
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
    document.getElementById(modalId).classList.remove("show");

    if (modalId == "modal-thanks") {
        window.location.hash = "#results";
        $("html, body").animate({ scrollTop: winHeight });
        // console.log("continue to results");
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

        var htmlString = "<div class='modal fade' id='" + modalID + "' tabindex='-1' role='dialog' aria-labelledby='" + theme + "' aria-hidden='true'><div class='modal-dialog modal-dialog-centered' role='document'><div class='modal-content'><img class='img-quest' src='" + imgSrc + "' alt='" + titleCase(theme) + " Question Background'><div class='modal-header'><h3 class='h5 mb-0'>" + question + "</h3><button type='button' class='close' data-dismiss='modal' aria-label='Close' onclick='closeModal(" + modalID + ")'><span aria-hidden='true'>&times;</span></button></div><div class='modal-body'>";
        var modalStringEnd = "</div><div class='modal-footer'><button type='button' class='continue link-black' data-dismiss='modal' aria-label='Continue' onclick='closeModal(" + modalID + ")'><span aria-hidden='true' class='position-relative before-arrow'><b>Continue</b><div class='arrow'><div class='head'></div></div></span></button></div></div></div></div>";

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
    currentChartID = "#chart-" + currentTheme;

    (currentTheme == "labor") ? (currentChartData = laborChartData, topResponse = laborTopResponse)
        : (currentTheme == "market") ? (currentChartData = marketChartData)
            : (currentTheme == "care") ? (currentChartData = careChartData)
                : (currentTheme == "living") ? (currentChartData = livingChartData, topResponse = livingTopResponse)
                    : (currentChartData = undefined);

    $(".chart.active").removeClass("active").addClass("inactive");
    $(currentChartID).removeClass("inactive").addClass("active");
    if (currentTheme == "labor" || currentTheme == "living") {
        percentTooltip(currentChartData);
        headlineTooltip(currentChartData);
        $("." + topResponse).addClass("active");
    }
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
        : (theme == "market") ? (marketTopRepsonse = topResponse)
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
    // description text labels
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
            .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            // .attr("dx", "0")
            .attr("opacity", 0.5)
            .text(d => d.short)
        .call(wrapText, 80);
};

// plot donut chart
function plotDonutChart(svg, donutData) {
    arcs = pie(donutData);

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
            $("rect").removeClass("active");
            $(chartClass).addClass("active");
        });
    
    svg.append("g")
            .attr("class", "chart-short")
        .selectAll("text")
        .data(arcs)
        .enter()
        .append("text")
        // .join("text")
            .attr("class", d => d.data.rID)
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .text(d => d.data.short)
            // .attr("dy", "0.35em")
        // .call(wrapText, donutWidth)
            // .call(text => text.append("tspan")
            //     .attr("y", "-0.4em")
            //     .text(d => d.data.value.toLocalString()))
}

// EVENTS
// click to read more
$(".read-more").on("click", function() {
    if (!$(this).hasClass("active")) {
        $(this).addClass("active");
        $("#read-more").css("display", "block");
    }
    else {
        $(this).removeClass("active");
        $("#read-more").css("display", "none");
    }
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
    else if (event.target == modalThanks) {
        closeModal('modal-thanks');
    }
};
// keep results section at top when resizing window
$(window).resize(function () {
    if (window.location.href.endsWith("#results")) {
        $("html, body").animate({ scrollTop: winHeight });
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

        if ($(this).is(":checked")) {
            $("#btn-" + themeName + " .img-pos").css("opacity", 0);
            $("#btn-" + themeName + " .img-neg").css("opacity", 0);
            $("#btn-" + themeName + " .img-color").css("opacity", 1);
            // console.log(themeName + " checked");
        }
        else if (!$(".form-check-input[name*='" + themeName + "']").is(":checked")) {
            $("#btn-" + themeName + " .img-color").css("opacity", 0);
            $("#btn-" + themeName + " .img-pos").css("opacity", 1);
        }
    });

    // on submit form
    $("#form").on('submit', "#submit", function(e) {
        document.getElementById(modalId).style.display = "block";
        document.getElementById(modalId).classList.add("show");
        e.preventDefault();
    });
    // console.log("ready!");
})
