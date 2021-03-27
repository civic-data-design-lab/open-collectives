var modalLabor = document.getElementById("modal-labor"),
    modalMarket = document.getElementById("modal-market"),
    modalCare = document.getElementById("modal-care"),
    modalLiving = document.getElementById("modal-living");

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