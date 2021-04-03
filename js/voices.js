// VARIABLES
var modalLabor = document.getElementById("modal-labor"),
    modalMarket = document.getElementById("modal-market"),
    modalCare = document.getElementById("modal-care"),
    modalLiving = document.getElementById("modal-living");

// FUNCTIONS
function openModal(modalId) {
    document.getElementById(modalId).style.display = "block"
    document.getElementById(modalId).classList.add("show");
}
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
  document.getElementById(modalId).classList.remove("show");
}

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

// QUESTIONS DATA
// get questions json data and generate modals and form inputs for each theme
getJsonObject("questions", function(qData){
    for (i = 0; i < qData.length; i++) {
        var theme = qData[i].theme,
            modalID = 'modal-' + theme,
            imgSrc = './img/' + theme + '-quest.svg',
            question = qData[i].question,
            responses = qData[i].responses,
            qType = qData[i].type;

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
    
    console.log(qData[0].responses[0].rID);
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
}

$(document).ready(function() {
    // console.log("ready!");
})