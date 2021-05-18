$(function () {
  getPersonnel();
  $("form").trigger("reset");

  $(window).scroll(function () {
    if ($(this).scrollTop() > screen.availHeight / 2) {
      $("#toTop").fadeIn();
    } else {
      $("#toTop").fadeOut();
    }
  });
  $("#preloader").fadeOut().remove();

  const toastError = document.getElementById("toastError");
  window.toastError = new bootstrap.Toast(toastError);
  const toastSuccess = document.getElementById("toastSuccess");
  window.toastSuccess = new bootstrap.Toast(toastSuccess);
});

function advSearch(event, table = null, col = null, term = null) {
  event.preventDefault();
  let op, condition, order, sort, within;
  if (table && col && term) {
    within = true;
    op = "equal";
    condition = term;
  } else {
    table = $("#searchType").val();
    col = $("#where").val();
    op = $("#operator").val();
    condition = $("#condition").val();
    order = $("#orderBy").val();
    sort = $("#sortBy").val();
  }
  url = "";
  switch (table) {
    case "department":
      url = "php/getDepartments";
      break;
    case "location":
      url = "php/getLocations";
      break;
    case "personnel":
      url = "php/getPersonnel";
    default:
      break;
  }
  $.getJSON(
    url,
    {
      column: col,
      operator: op,
      condition: condition,
      order: order,
      sort: sort,
    },
    function (data) {
      if (data.status.code == 200) {
        const arr = data.data;
        if (arr && arr.length) {
          switch (table) {
            case "department":
              displayDepartments(arr);
              break;
            case "location":
              displayLocations(arr);
              break;
            case "personnel":
              displayPersonnel(arr);
              break;
          }
          if (within) {
            $("#currentView").text(
              $("#currentView").text() + ` Within ${term}`
            );
          } else {
            table = table[0].toUpperCase() + table.substr(1);
            $("#currentView").text(`Custom ${table} Results`);
          }
        } else {
          alert("No results found");
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
        let prefix = "";
        switch ($table) {
          case "department":
            prefix = "d.";
            break;
          case "location":
            prefix = "l.";
            break;
          case "personnel":
            prefix = "p.";
            break;
        }
        cols.forEach((col) => {
          $("#where").append(
            `<option value="${prefix}${col.COLUMN_NAME}">${col.COLUMN_NAME}</option>`
          );
          $("#orderBy").append(
            `<option value="${prefix}${col.COLUMN_NAME}">${col.COLUMN_NAME}</option>`
          );
        });
      }
    }
  });
  $("#expandedAdvSearch").slideDown();
}

function configDeptModal(id) {
  $.getJSON("php/getLocations", function (data) {
    if (data.status.code == 200) {
      const locs = data.data || null;
      if (locs && locs.length) {
        $("#deptLoc").empty();
        locs.forEach((l) => {
          $("#deptLoc").append(`<option value="${l.id}">${l.name}</option>`);
        });
        getDepartment(id);
      }
    }
  });
}

function configPModal(event, id = null) {
  event.preventDefault();
  $.getJSON("php/getDepartments", function (data) {
    if (data.status.code == 200) {
      const depts = data.data || null;
      if (depts && depts.length) {
        $("#pDept").empty();
        depts.forEach((d) => {
          $("#pDept").append(`<option value="${d.id}">${d.name}</option>`);
        });
        getPerson(id || $("#search").val());
      }
    }
  });
}

function configNewDeptModal() {
  $.getJSON("php/getLocations", function (data) {
    if (data.status.code == 200) {
      const locs = data.data || null;
      if (locs && locs.length) {
        $("#newDeptLoc").empty()
          .append(`<option value="" selected disabled hidden>
        Select Location
      </option>`);
        locs.forEach((l) => {
          $("#newDeptLoc").append(`<option value="${l.id}">${l.name}</option>`);
        });
        $("#newDeptModal").modal("show");
      }
    }
  });
}

function configNewPModal() {
  $.getJSON("php/getDepartments", function (data) {
    if (data.status.code == 200) {
      const depts = data.data || null;
      if (depts && depts.length) {
        $("#newPLoc").empty().append(`<option value="" selected disabled hidden>
        Select Department
      </option>`);
        depts.forEach((d) => {
          $("#newPDept").append(`<option value="${d.id}">${d.name}</option>`);
        });
        $("#newPModal").modal("show");
      }
    }
  });
}

function checkDeletion(table, id, name) {
  let col, dependency, url;
  switch (table) {
    case "department":
      col = "d.name";
      dependency = "personnel";
      break;

    case "location":
      col = "l.name";
      dependency = "department";
      break;
  }
  $.getJSON("php/checkDeletion", { table: table, id: id }, function (data) {
    if (data.status.description == "safe to delete") {
      configDeleteModal(table, id, name);
    } else if (data.status.description == "cannot delete") {
      $("toastErrorMessage").empty();
      $("#toastErrorMessage").append(
        `<p>Cannot delete ${table} with existing ${dependency}.</p>`
      );
      $("#toastErrorMessage").append(
        `<p><button type="button" class="btn btn-outline-primary" onclick="advSearch(event, '${dependency}', '${col}', '${name}')" data-bs-dismiss="toast">View dependecies</button></p>`
      );
      toastError.show();
    }
  });
}

function configDeleteModal(table, id, name) {
  $("#confirmTarget").text(name);
  $("#confirmDeleteButton").attr(
    "onclick",
    `deleteEntry('${table}', ${id}, '${name}')`
  );
  $("#confirmDeleteModal").modal("show");
}

function deleteEntry(table, id, name) {
  $.ajax({
    url: "php/delete",
    type: "DELETE",
    data: {
      table: table,
      id: id,
    },
    success: function (data) {
      if (data.status.code == 200) {
        switch (table) {
          case "department":
            getDepartments();
            break;
          case "location":
            getLocations();
          case "personnel":
            getPersonnel();
          default:
            $("confirmDeleteModal").modal("hide");
            $("#toastSuccessMessage").text(`Deleted ${name}`);
            toastSuccess.show();
            break;
        }
      }
    },
  });
}

function displayDepartments(depts) {
  $("#grid").empty();
  depts.forEach(function (d) {
    let $col = $(
      `<div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 mb-4"></div>`
    );
    let $card = $(`<div id="d${d.id}" class="card mx-auto"></div>`);

    let $cardHeader = $(`<div class="card-header"></div>`);
    $cardHeader.append(`<h2 class="card-title fs-4">${d.name}</h2>`);
    $card.append($cardHeader);

    let $cardBody = $(`<div class="card-body"></div>`);
    $cardBody.append(`<p class="card-text">${d.location}</p>`);
    $cardBody.append(`<p class="card-text">Personnel: ${d.personnel}</p>`);
    $card.append($cardBody);

    let $cardFooter = $(`<div class="card-footer text-end"></div>`);
    let $dropdown = $(`<div class="dropdown d-inline me-2"></div>`);
    let $dropButton = $(
      `<button id="l${d.id}View" class="btn btn-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-eye"></i></button>`
    );
    $dropdown.append($dropButton);
    let $dropmenu = $(
      `<div class="dropdown-menu p-0" aria-labelled-by="l${d.id}View"></div>`
    );
    $dropmenu.append(
      `<li><button type="button" class="dropdown-item list-group-item list-group-item-action" onclick="advSearch(event, 'location', 'l.name', '${d.location}')">Location</button></li>`
    );
    $dropmenu.append(
      `<li><button type="button" class="dropdown-item list-group-item list-group-item-action" onclick="advSearch(event, 'personnel', 'd.name', '${d.name}')">Personnel</button></li>`
    );
    $dropdown.append($dropmenu);
    $cardFooter.append($dropdown);
    $cardFooter.append(
      `<button class="btn btn-secondary btn-sm me-2" onclick="configDeptModal(${d.id})"><i class="fa fa-edit"></i></button>`
    );
    $cardFooter.append(
      `<button type="button" class="btn btn-danger btn-sm" onclick="checkDeletion('department', ${d.id}, '${d.name}')">
      <i class="fas fa-folder-minus"></i>
    </button>`
    );
    $card.append($cardFooter);

    $col.append($card);
    $("#grid").append($col);
  });
  $("#currentView").text("All Departments");
  closeMenuBar();
}

function displayLocations(locs) {
  $("#grid").empty();
  locs.forEach(function (l) {
    let $col = $(
      `<div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 mb-4"></div>`
    );
    let $card = $(`<div id="l${l.id}" class="card mx-auto"></div>`);

    let $cardHeader = $(`<div class="card-header"></div>`);
    $cardHeader.append(`<h2 class="card-title fs-4">${l.name}</h2>`);
    $card.append($cardHeader);

    let $cardBody = $(`<div class="card-body"></div>`);
    $cardBody.append(`<p class="card-text">Departments: ${l.departments}</p>`);
    $cardBody.append(`<p class="card-text">Personnel: ${l.personnel}</p>`);
    $card.append($cardBody);

    let $cardFooter = $(`<div class="card-footer text-end"></div>`);
    let $dropdown = $(`<div class="dropdown d-inline me-2"></div>`);
    let $dropButton = $(
      `<button id="l${l.id}View" class="btn btn-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-eye"></i></button>`
    );
    $dropdown.append($dropButton);
    let $dropmenu = $(
      `<div class="dropdown-menu p-0" aria-labelled-by="l${l.id}View"></div>`
    );
    $dropmenu.append(
      `<li><button type="button" class="dropdown-item list-group-item list-group-item-action" onclick="advSearch(event, 'department', 'l.name', '${l.name}')">Departments</button></li>`
    );
    $dropmenu.append(
      `<li><button type="button" class="dropdown-item list-group-item list-group-item-action" onclick="advSearch(event, 'personnel', 'l.name', '${l.name}')">Personnel</button></li>`
    );
    $dropdown.append($dropmenu);
    $cardFooter.append($dropdown);
    $cardFooter.append(
      `<button class="btn btn-secondary btn-sm me-2" onclick="getLocation(${l.id})"><i class="fa fa-edit"></i></button>`
    );
    $cardFooter.append(
      `<button id="deleteLoc" type="button" class="btn btn-danger btn-sm" onclick="checkDeletion('location', ${l.id}, '${l.name}')">
      <i class="fas fa-folder-minus"></i>
    </button>`
    );
    $card.append($cardFooter);

    $col.append($card);
    $("#grid").append($col);
  });
  $("#currentView").text("All Locations");
  closeMenuBar();
}

function displayPersonnel(staff) {
  $("#grid").empty();
  staff.forEach(function (p) {
    let $col = $(
      `<div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 mb-4"></div>`
    );
    let $card = $(`<div id="e${p.id}" class="card mx-auto"></div>`);

    let $cardHeader = $(`<div class="card-header"></div>`);
    $cardHeader.append(
      `<h2 class="card-title fs-4">${p.firstName} ${p.lastName}</h2>`
    );
    $card.append($cardHeader);

    let $cardBody = $(`<div class="card-body"></div>`);
    if (p.jobTitle || null) {
      $cardBody.append(`<p class="card-subtitle">${p.jobTitle}</p>`);
    }
    $cardBody.append(`<p class="card-text">${p.department}</p>`);
    $cardBody.append(`<p class="card-text">${p.location}</p>`);
    $card.append($cardBody);

    let $cardFooter = $(`<div class="card-footer text-end"></div>`);
    $cardFooter.append(
      `<a href="mailto:${p.email}" target="_blank" class="me-2"><button class="btn btn-primary btn-sm"><i class="fas fa-envelope"></i></button></a>`
    );
    let $dropdown = $(`<div class="dropdown d-inline me-2"></div>`);
    let $dropButton = $(
      `<button id="l${p.id}View" class="btn btn-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-eye"></i></button>`
    );
    $dropdown.append($dropButton);
    let $dropmenu = $(
      `<div class="dropdown-menu p-0" aria-labelled-by="l${p.id}View"></div>`
    );
    $dropmenu.append(
      `<li><button type="button" class="dropdown-item list-group-item list-group-item-action" onclick="advSearch(event, 'department', 'd.name', '${p.department}')">Department</button></li>`
    );
    $dropmenu.append(
      `<li><button type="button" class="dropdown-item list-group-item list-group-item-action" onclick="advSearch(event, 'location', 'l.name', '${p.location}')">Location</button></li>`
    );
    $dropdown.append($dropmenu);
    $cardFooter.append($dropdown);
    $cardFooter.append(
      `<button class="btn btn-secondary btn-sm me-2" onclick="configPModal(event, ${p.id})"><i class="fa fa-user-edit"></i></button>`
    );
    $cardFooter.append(
      `<button type="button" class="btn btn-danger btn-sm" onclick="configDeleteModal('personnel',${p.id}, '${p.firstName} ${p.lastName}')">
      <i class="fas fa-user-minus"></i>
    </button>`
    );
    $card.append($cardFooter);

    $col.append($card);

    $("#grid").append($col);
  });
  $("#currentView").text("All Personnel");
  closeMenuBar();
}

function getDepartment(id) {
  $.getJSON(
    "php/getDepartments",
    { column: "d.id", operator: "equal", condition: id },
    function (data, status) {
      if (data.status.code == 200) {
        if ((data.data || null) && data.data.length) {
          const d = data.data[0];
          $("#deptName").val(d.name);
          $("#deptLoc").val(d.locID);
          $("#deptID").text(id);
          if (d.personnel == 0) {
            $("#deleteDept").show();
          } else {
            $("#deleteDept").hide();
          }
          $("#deptModal").modal("show");
        } else {
          alert("No result found");
        }
      }
    }
  );
}

function getLocation(id) {
  $.getJSON(
    "php/getLocations",
    { column: "l.id", operator: "equal", condition: id },
    function (data, status) {
      if (data.status.code == 200) {
        if ((data.data || null) && data.data.length) {
          const l = data.data[0];
          $("#locName").val(l.name);
          $("#locID").text(id);
          if (l.departments == 0 && l.personnel == 0) {
            $("#deleteLoc").show();
          } else {
            $("#deleteLoc").hide();
          }
          $("#locModal").modal("show");
        } else {
          alert("No result found");
        }
      }
    }
  );
}

function getPerson(id) {
  $.getJSON(
    "php/getPersonnel",
    { column: "p.id", operator: "equal", condition: id },
    function (data, status) {
      if (data.status.code == 200) {
        if ((data.data || null) && data.data.length) {
          const p = data.data[0];
          $("#pFName").val(p.firstName);
          $("#pLName").val(p.lastName);
          $("#pJob").val(p.jobTitle);
          $("#pEmail").val(p.email);
          $("#pDept").val(p.deptID);
          $("#pID").text(id);
          $("#pModal").modal("show");
        } else {
          alert("No result found");
        }
      }
    }
  );
}

function getDepartments() {
  $.getJSON("php/getDepartments", function (data) {
    const depts = data.data || null;
    if (data.status.code == 200) {
      if (depts && depts.length) {
        displayDepartments(depts);
      } else {
        alert("No results found");
      }
    }
  });
}

function getPersonnel() {
  $.getJSON("php/getPersonnel", function (data) {
    const staff = data.data || null;
    if (data.status.code == 200) {
      if (staff && staff.length) {
        displayPersonnel(staff);
      } else {
        alert("No results found");
      }
    }
  });
}

function getLocations() {
  $.getJSON("php/getLocations", function (data) {
    const locs = data.data || null;
    if (data.status.code == 200) {
      if (locs && locs.length) {
        displayLocations(locs);
      } else {
        alert("No results found");
      }
    }
  });
}

function newDepartment(event) {
  event.preventDefault();
  const $name = $("#newDept").val();
  const $locID = $("#newDeptLoc").val();
  const confirmation = confirm(`Are you sure you wish to create ${$name}?`);
  if (confirmation) {
    $.post(
      "php/newDepartment",
      { name: $name, locID: $locID },
      function (data) {
        if (data.status.code == 201) {
          getDepartments();
          $("#newDeptAlert").fadeIn().delay(3000).fadeOut();
          $("#newDeptForm").trigger("reset");
        }
      }
    );
  }
}

function newLocation(event) {
  event.preventDefault();
  const $name = $("#newLoc").val();
  const confirmation = confirm(`Are you sure you wish to create ${$name}?`);
  if (confirmation) {
    $.post("php/newLocation", { name: $name }, function (data) {
      if (data.status.code == 201) {
        getLocations();
        $("#newLocAlert").fadeIn().delay(3000).fadeOut();
        $("#newLocForm").trigger("reset");
      }
    });
  }
}

function newPersonnel(event) {
  event.preventDefault();
  const $fName = $("#newPFName").val();
  const $lName = $("#newPLName").val();
  const $job = $("#newPJob").val();
  const $email = $("#newPEmail").val();
  const $deptID = $("#newPDept").val();
  const confirmation = confirm(
    `Are you sure you wish to create ${$fName} ${$lName}?`
  );
  if (confirmation) {
    $.post(
      "php/newPersonnel",
      {
        fName: $fName,
        lName: $lName,
        job: $job,
        email: $email,
        deptID: $deptID,
      },
      function (data) {
        if (data.status.code == 201) {
          getPersonnel();
          $("#newPAlert").fadeIn().delay(3000).fadeOut();
          $("#newPForm").trigger("reset");
        }
      }
    );
  }
}

function openMenuBar() {
  $("#menuBar, #overlay").addClass("active");
}

function toggleAdvSearch() {
  $("#toggleAdvSearch i").toggleClass("rotate90");
  $("#advSearch").slideToggle("fast");
}

function toTop() {
  $("html, body").animate({ scrollTop: 0 }, 500);
}

function updateDepartment(event) {
  event.preventDefault();
  const $id = $("#deptID").text();
  const $name = $("#deptName").val();
  const $locID = $("#deptLoc").val();
  const confirmation = confirm(`Are you sure you wish to edit ${$name}?`);
  if (confirmation) {
    $.ajax({
      url: "php/updateDepartment",
      type: "PUT",
      data: { id: $id, name: $name, locID: $locID },
      success: function (data) {
        if (data.status.code == 200) {
          getDepartments();
          $("#updateDAlert").fadeIn().delay(3000).fadeOut();
        }
      },
    });
  }
}

function updateLocation(event) {
  event.preventDefault();
  const $name = $("#locName").val();
  const $id = $("#locID").text();
  const confirmation = confirm(`Are you sure you wish to edit ${$name}?`);
  if (confirmation) {
    $.ajax({
      url: "php/updateLocation",
      type: "PUT",
      data: { id: $id, name: $name },
      success: function (data) {
        if (data.status.code == 200) {
          getLocations();
          $("#updateLAlert").fadeIn().delay(3000).fadeOut();
        }
      },
    });
  }
}

function updatePersonnel(event) {
  event.preventDefault();
  const $id = $("#pID").text();
  const $pFName = $("#pFName").val();
  const $pLName = $("#pLName").val();
  const $pJob = $("#pJob").val();
  const $pEmail = $("#pEmail").val();
  const $pDeptID = $("#pDept").val();
  const confirmation = confirm(
    `Are you sure you wish to edit ${$pFName} ${$pLName}?`
  );
  if (confirmation) {
    $.ajax({
      url: "php/updatePersonnel",
      type: "PUT",
      data: {
        id: $id,
        fName: $pFName,
        lName: $pLName,
        job: $pJob,
        email: $pEmail,
        deptID: $pDeptID,
      },
      success: function (data) {
        if (data.status.code == 200) {
          getPersonnel();
          $("#updatePAlert").fadeIn().delay(3000).fadeOut();
        }
      },
    });
  }
}
