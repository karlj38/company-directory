$(function () {
  $("#preloader").fadeOut().remove();
});

function closeMenuBar() {
  $("#menuBar, #overlay").removeClass("active");
}

function openMenuBar() {
  $("#menuBar, #overlay").addClass("active");
}
