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

function configViewEmpForm(event, id = null) {
  event.preventDefault();
  $.getJSON("php/getList", { type: "departments" }, function (data) {
    if (data.status.code == 200) {
      const departments = data.data || null;
      if (departments && departments.length) {
        $("#empDept").empty();
        departments.forEach((d) => {
          $("#empDept").append(`<option value="${d.name}">${d.name}</option>`);
        });
        getEmployee(id || $("#search").val());
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

function getEmployees() {
  $.getJSON("php/getList", { type: "employees" }, function (data) {
    console.log(data);
    const staff = data.data || null;
    if (data.status.code == 200 && staff && staff.length) {
      $("#grid").empty();
      staff.forEach(function (e) {
        let $col = $(
          `<div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 mb-4"></div>`
        );
        let $card = $(`<div id="e${e.id}" class="card mx-auto"></div>`);

        let $cardHeader = $(`<div class="card-header"></div>`);
        $cardHeader.append(
          `<h2 class="card-title fs-4">${e.firstName} ${e.lastName}</h2>`
        );
        $card.append($cardHeader);

        let $cardBody = $(`<div class="card-body"></div>`);
        if (e.jobTitle || null) {
          $cardBody.append(`<p class="card-subtitle">${e.jobTitle}</p>`);
        }
        $cardBody.append(
          `<p class="card-text">${e.department}, ${e.location}</p>`
        );
        $card.append($cardBody);

        let $cardFooter = $(`<div class="card-footer text-end"></div>`);
        $cardFooter.append(
          `<a href="mailto:${e.email}" target="_blank" class="me-2"><button class="btn btn-primary btn-sm"><i class="fas fa-envelope"></i></button></a>`
        );
        $cardFooter.append(
          `<button class="btn btn-secondary btn-sm" onclick="configViewEmpForm(event, ${e.id})"><i class="fa fa-user-edit"></i></button>`
        );
        $card.append($cardFooter);

        $col.append($card);
        $("#grid").append($col);
        closeMenuBar();
      });
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
