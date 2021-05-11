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

function configViewEmpForm(event) {
  event.preventDefault();
  $.getJSON("php/getList", { type: "departments" }, function (data) {
    if (data.status.code == 200) {
      const departments = data.data || null;
      if (departments && departments.length) {
        $("#empDept").empty();
        departments.forEach((d) => {
          $("#empDept").append(`<option value="${d.name}">${d.name}</option>`);
        });
        getEmployee($("#search").val());
      }
    }
  });
}

function getEmployee(id) {
  $.getJSON("php/getEmployee", { id: id }, function (data, status) {
    if (data.status.code == 200) {
      if ((data.data || null) && data.data.length) {
        const emp = data.data[0];
        $("#empFName").val(emp.firstName);
        $("#empLName").val(emp.lastName);
        $("#empJob").val(emp.jobTitle);
        $("#empEmail").val(emp.email);
        $("#empDept").val(emp.department);
        $("#viewEmpModal").modal("show");
      } else {
        alert("No result found");
      }
    }
  });
}

function openMenuBar() {
  $("#menuBar, #overlay").addClass("active");
}

function toggleAdvSearch() {
  $("#toggleAdvSearch i").toggleClass("rotate90");
  $("#advSearch").slideToggle("fast");
}
