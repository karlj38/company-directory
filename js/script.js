$(function () {
  $("#preloader").fadeOut().remove();
});

function closeMenuBar() {
  $("#menuBar, #overlay").removeClass("active");
}

function configAdvSearch() {
  //get dynamic fields
  $("#expandedAdvSearch").slideDown();
}

function openMenuBar() {
  $("#menuBar, #overlay").addClass("active");
}

function toggleAdvSearch() {
  $("#toggleAdvSearch i").toggleClass("rotate90");
  $("#advSearch").slideToggle("fast");
}
