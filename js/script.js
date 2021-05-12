$(function () {
  $("#preloader").fadeOut().remove();
});

function advSearch(event) {
  event.preventDefault();
  $table = $("#searchType").val();
  $col = $("#where").val();
  $op = $("#operator").val();
  $condition = $("#condition").val();
  $order = $("#orderBy").val();
  $sort = $("#sortBy").val();

  $.getJSON(
    "php/getList",
    {
      table: $table,
      column: $col,
      operator: $op,
      condition: $condition,
      order: $order,
      sort: $sort,
    },
    function (data) {
      if (data.status.code == 200) {
        const arr = data.data;
        if (arr && arr.length) {
          switch ($table) {
            case "department":
              displayDepartments(arr);
              break;
            case "personnel":
              displayEmployees(arr);
              break;
            case "location":
              displayLocations(arr);
              break;
          }
        }
      }
      $("#advSearch").trigger("reset");
      $("#expandedAdvSearch").slideUp();
    }
  );
}

function closeMenuBar() {
  $("#menuBar, #overlay").removeClass("active");
}

function configAdvSearch() {
  const $table = $("#searchType").val();
  $.getJSON("php/getColumns", { table: $table }, function (data) {
    if (data.status.code == 200) {
      const cols = data.data || null;
      if (cols && cols.length) {
        $("#where")
          .empty()
          .append(`<option value="" disabled selected hidden>Where</option>`);
        $("#orderBy")
          .empty()
          .append(
            `<option value="" disabled selected hidden>Order By</option>`
          );
        cols.forEach((col) => {
          $("#where").append(
            `<option value="${col.COLUMN_NAME}">${col.COLUMN_NAME}</option>`
          );
          $("#orderBy").append(
            `<option value="${col.COLUMN_NAME}">${col.COLUMN_NAME}</option>`
          );
        });
      }
    }
  });
  $("#expandedAdvSearch").slideDown();
}

function configDeptModal(id) {
  $.getJSON("php/getList", { table: "location" }, function (data) {
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
  $.getJSON("php/getList", { table: "department" }, function (data) {
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

function configNewDeptModal() {
  $.getJSON("php/getList", { table: "location" }, function (data) {
    if (data.status.code == 200) {
      const locs = data.data || null;
      if (locs && locs.length) {
        $("#newDeptLoc").empty()
          .append(`<option value="" selected disabled hidden>
        Select Location
      </option>`);
        locs.forEach((l) => {
          $("#newDeptLoc").append(
            `<option value="${l.name}">${l.name}</option>`
          );
        });
        $("#newDeptModal").modal("show");
      }
    }
  });
}

function configNewEmpModal() {
  $.getJSON("php/getList", { table: "department" }, function (data) {
    if (data.status.code == 200) {
      const depts = data.data || null;
      if (depts && depts.length) {
        $("#newEmpLoc").empty()
          .append(`<option value="" selected disabled hidden>
        Select Department
      </option>`);
        depts.forEach((d) => {
          $("#newEmpDept").append(
            `<option value="${d.name}">${d.name}</option>`
          );
        });
        $("#newEmpModal").modal("show");
      }
    }
  });
}

function displayDepartments(depts) {
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
function displayEmployees(staff) {
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
    $cardBody.append(`<p class="card-text">${e.department}, ${e.location}</p>`);
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
function displayLocations(locs) {
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
  $.getJSON("php/getList", { table: "department" }, function (data) {
    const depts = data.data || null;
    if (data.status.code == 200 && depts && depts.length) {
      displayDepartments(depts);
    }
  });
}

function getEmployees() {
  $.getJSON("php/getList", { table: "personnel" }, function (data) {
    const staff = data.data || null;
    if (data.status.code == 200 && staff && staff.length) {
      displayEmployees(staff);
    }
  });
}

function getLocations() {
  $.getJSON("php/getList", { table: "location" }, function (data) {
    const locs = data.data || null;
    if (data.status.code == 200 && locs && locs.length) {
      displayLocations(locs);
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
