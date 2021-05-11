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

function configDeptModal(id) {
  $.getJSON("php/getList", { type: "locations" }, function (data) {
    if (data.status.code == 200) {
      const depts = data.data || null;
      if (depts && depts.length) {
        $("#deptLoc").empty();
        depts.forEach((d) => {
          $("#deptLoc").append(`<option value="${d.name}">${d.name}</option>`);
        });
        getDepartment(id);
      }
    }
  });
}

function configEmpModal(event, id = null) {
  event.preventDefault();
  $.getJSON("php/getList", { type: "departments" }, function (data) {
    if (data.status.code == 200) {
      const depts = data.data || null;
      if (depts && depts.length) {
        $("#empDept").empty();
        depts.forEach((d) => {
          $("#empDept").append(`<option value="${d.name}">${d.name}</option>`);
        });
        getEmployee(id || $("#search").val());
      }
    }
  });
}

function getDepartment(id) {
  $.getJSON("php/get", { type: "department", id: id }, function (data, status) {
    if (data.status.code == 200) {
      if ((data.data || null) && data.data.length) {
        const d = data.data[0];
        $("#deptName").val(d.name);
        $("#deptLoc").val(d.location);
        $("#DeptModal").modal("show");
      } else {
        alert("No result found");
      }
    }
  });
}

function getEmployee(id) {
  $.getJSON("php/get", { type: "employee", id: id }, function (data, status) {
    if (data.status.code == 200) {
      if ((data.data || null) && data.data.length) {
        const emp = data.data[0];
        $("#empFName").val(emp.firstName);
        $("#empLName").val(emp.lastName);
        $("#empJob").val(emp.jobTitle);
        $("#empEmail").val(emp.email);
        $("#empDept").val(emp.department);
        $("#EmpModal").modal("show");
      } else {
        alert("No result found");
      }
    }
  });
}

function getLocation(id) {
  $.getJSON("php/get", { type: "location", id: id }, function (data, status) {
    if (data.status.code == 200) {
      if ((data.data || null) && data.data.length) {
        const l = data.data[0];
        $("#locName").val(l.name);
        $("#LocModal").modal("show");
      } else {
        alert("No result found");
      }
    }
  });
}

function getDepartments() {
  $.getJSON("php/getList", { type: "departments" }, function (data) {
    const depts = data.data || null;
    if (data.status.code == 200 && depts && depts.length) {
      $("#grid").empty();
      depts.forEach(function (d) {
        let $col = $(
          `<div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 mb-4"></div>`
        );
        let $card = $(`<div id="e${d.id}" class="card mx-auto"></div>`);

        let $cardHeader = $(`<div class="card-header"></div>`);
        $cardHeader.append(`<h2 class="card-title fs-4">${d.name}</h2>`);
        $card.append($cardHeader);

        let $cardBody = $(`<div class="card-body"></div>`);
        $cardBody.append(`<p class="card-subtitle">${d.location}</p>`);
        $cardBody.append(`<p class="card-text">Personnel: ${d.personnel}</p>`);
        $card.append($cardBody);

        let $cardFooter = $(`<div class="card-footer text-end"></div>`);
        $cardFooter.append(
          `<button class="btn btn-primary btn-sm me-2"><i class="fas fa-eye"></i></button>`
        );
        $cardFooter.append(
          `<button class="btn btn-secondary btn-sm" onclick="configDeptModal(${d.id})"><i class="fa fa-edit"></i></button>`
        );
        $card.append($cardFooter);

        $col.append($card);
        $("#grid").append($col);
        closeMenuBar();
      });
    }
  });
}

function getEmployees() {
  $.getJSON("php/getList", { type: "employees" }, function (data) {
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
          `<button class="btn btn-secondary btn-sm" onclick="configEmpModal(event, ${e.id})"><i class="fa fa-user-edit"></i></button>`
        );
        $card.append($cardFooter);

        $col.append($card);
        $("#grid").append($col);
        closeMenuBar();
      });
    }
  });
}

function getLocations() {
  $.getJSON("php/getList", { type: "locations" }, function (data) {
    const locs = data.data || null;
    if (data.status.code == 200 && locs && locs.length) {
      $("#grid").empty();
      locs.forEach(function (l) {
        let $col = $(
          `<div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 mb-4"></div>`
        );
        let $card = $(`<div id="e${l.id}" class="card mx-auto"></div>`);

        let $cardHeader = $(`<div class="card-header"></div>`);
        $cardHeader.append(`<h2 class="card-title fs-4">${l.name}</h2>`);
        $card.append($cardHeader);

        let $cardBody = $(`<div class="card-body"></div>`);
        $cardBody.append(`<p class="card-text">Personnel: ${l.personnel}</p>`);
        $card.append($cardBody);

        let $cardFooter = $(`<div class="card-footer text-end"></div>`);
        $cardFooter.append(
          `<button class="btn btn-primary btn-sm me-2"><i class="fas fa-eye"></i></button>`
        );
        $cardFooter.append(
          `<button class="btn btn-secondary btn-sm" onclick="getLocation(${l.id})"><i class="fa fa-edit"></i></button>`
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
