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

// modal html string for each survey question
var modalString = "";

$(document).ready(function() {
  console.log("ready!");

  $.getJSON("./data/questions.json", function(data){
    console.log(data);
  }).fail(function() {
    console.log("error");
  });
})