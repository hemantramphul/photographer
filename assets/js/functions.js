var LOGIN = false;

$(document).ready(function () {
  var status = $("#loginStatus").val();
  LOGIN = status === "true";

  // Loading data
  loadPhoto();
  loadEducation();

  // Login
  $("#loginForm").submit(function (event) {
    event.preventDefault();
    $(this).ajaxSubmit({
      error: function (xhr) {
        console.log(xhr);
      },
      success: function (response) {
        var result = response;
        if (response.error) {
          $("#passwordsNoMatchLogin").show();
        } else {
          $("#loginModal").modal("toggle");
          LOGIN = true;
          $(".loginUsername").html(response.username);
          refreshPage();
        }
      },
    });
  });

  $("#loginModal").on("show.bs.modal", function (e) {
    $("#passwordsNoMatchLogin").hide();
  });

  // Logout
  $("#btnLogout").click(function (event) {
    event.preventDefault();
    $.ajax({
      type: "get",
      url: "/auth/logout",
    }).done(function (data) {
      refreshPage();
      $("#logoutModal").modal("toggle");
    });
  });

  /////////////////////////////////////////
  // Photo ////////////////////////////
  /////////////////////////////////////////

  // Add photo
  $("#addPhotoForm").submit(function (event) {
    event.preventDefault();
    $(this).ajaxSubmit({
      error: function (xhr) {},
      success: function (response) {
        refresh();
      },
    });
  });

  // Delete photo
  $("#btnDeletePhoto").click(function (event) {
    event.preventDefault();
    const id = $("#photoId").val();
    $.ajax({
      type: "get",
      url: "/delete/" + id,
      dataType: "text",
    }).done(function (data) {
      loadPhoto();
      $("#deletePhotoModal").modal("toggle");
    });
  });

  $("#addPhotoModal").on("hidden.bs.modal", function () {
    $("#addPhotoModal form")[0].reset();
  });

  $("#editPhotoModal").on("hidden.bs.modal", function () {
    $("#editPhotoModal form")[0].reset();
  });

  // Load list of photos
  function loadPhoto() {
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", "/list", false);
    xhttp.send();

    const photos = JSON.parse(xhttp.responseText);
    document.getElementById("photos").innerHTML = "";
    let content = "";
    for (let photo of photos) {
      content = `
                <div class="portfolio-item padd-15">
                    <div class="portfolio-item-inner shadow-dark">
                        <div class="portfolio-img">
                            <img src="img/${photo.image}" alt="${photo.title}" width="100" height="300">
                        </div>
                    </div>
                    
                    <div class="title padd-15"><h4 class="skin-color-style">${photo.title}</h4></div>
                    <div class="title padd-15 skin-color-style"><i class="fa fa-map-pin"></i> ${photo.location}</div>
                    <div class="description padd-15 skin-color-style-text">${photo.description}</div>
                    <div>&nbsp;</div>`;
      if (LOGIN) {
        content += `<div class="description padd-15">
                      <button type="button" class="btn btn-sm btn-warning"  data-photo-id="${photo.id}" data-toggle="modal" data-target="#editPhotoModal"
                      data-backdrop="static" data-keyboard="false">Edit</button>
                      <button type="button" class="btn btn-sm btn-danger" data-photo-id="${photo.id}" data-toggle="modal" data-target="#deletePhotoModal" 
                      data-backdrop="static" data-keyboard="false">Delete</button>
                    </div>
        `;
      }

      content += `</div>`;

      document.getElementById("photos").innerHTML += content;
    }
  }

  function refresh() {
    loadPhoto();
    $("#addPhotoModal").modal("toggle");
  }

  function refreshPage() {
    window.location.reload();
  }

  $("#deletePhotoModal").on("show.bs.modal", function (e) {
    //get data-id attribute of the clicked element
    var id = $(e.relatedTarget).data("photo-id");

    //populate the textbox
    $(e.currentTarget).find('input[name="photoId"]').val(id);
  });

  // Edit photo
  $("#editPhotoModal").on("shown.bs.modal", function (e) {
    //get data-id attribute of the clicked element
    var id = $(e.relatedTarget).data("photo-id");

    e.preventDefault();
    $.ajax({
      type: "get",
      url: "/edit/" + id,
      dataType: "json",
    }).done(function (data) {
      //var res = JSON.parse(data);
      $("#updateTitle").val(data[0].title);
      $("#updateLocation").val(data[0].location);
      $("#updateDescription").val(data[0].description);
      $("#editPhotoForm").attr("action", "/update/" + data[0].id);
    });
  });

  // Update photo
  $("#editPhotoForm").submit(function (event) {
    event.preventDefault();
    var url = $("#editPhotoForm").attr("action");
    $(this).ajaxSubmit({
      error: function (xhr) {},
      success: function (response) {
        loadPhoto();
        $("#editPhotoModal").modal("toggle");
      },
    });
  });

  /////////////////////////////////////////
  // Education ////////////////////////////
  /////////////////////////////////////////

  // Load education
  function loadEducation() {
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", "/education/list", false);
    xhttp.send();

    const educations = JSON.parse(xhttp.responseText);
    document.getElementById("educations").innerHTML = "";
    let content = "";
    for (let education of educations) {
      content = `
                <div class="timeline-item">
                  <div class="circle-dot"></div>
                  <h3 class="timeline-date">
                    <i class="fa fa-calendar"></i> ${education.year_start} - ${education.year_ended}`;
      if (LOGIN) {
        content += `<button type="button" class="btn btn-sm btn-danger float-right" data-education-id="${education.id}" data-toggle="modal" data-target="#deleteEducationModal" 
                      data-backdrop="static" data-keyboard="false">Delete</button>
                    <button type="button" class="btn btn-sm btn-warning float-right" data-education-id="${education.id}" data-toggle="modal" data-target="#editEducationModal"
                      data-backdrop="static" data-keyboard="false" style="margin-right:5px;">Edit</button>`;
      }
      content += `</h3>
                    <h4 class="timeline-title">
                      ${education.field}
                    </h4>
                    <p class="timeline-text"><i class="fa fa-map-pin"></i> ${education.location}</p>
                  </div>                
        `;

      document.getElementById("educations").innerHTML += content;
    }
  }

  // Refresh education
  function refreshEducation() {
    loadEducation();
    $("#addEducationModal").modal("toggle");
    $("#addEducationModal form")[0].reset();
  }

  // Add education
  $("#addEducationForm").submit(function (event) {
    event.preventDefault();
    $(this).ajaxSubmit({
      error: function (xhr) {},
      success: function (response) {
        refreshEducation();
      },
    });
  });

  // Edit edcuation
  $("#editEducationModal").on("shown.bs.modal", function (e) {
    //get data-id attribute of the clicked element
    var id = $(e.relatedTarget).data("education-id");

    e.preventDefault();
    $.ajax({
      type: "get",
      url: "/education/edit/" + id,
      dataType: "json",
    }).done(function (data) {
      $("#updateEducationStartYear").val(data[0].year_start);
      $("#updateEducationEndYear").val(data[0].year_ended);
      $("#updateEducationLocation").val(data[0].location);
      $("#updateEducationField").val(data[0].field);
      $("#editEducationForm").attr("action", "/education/update/" + data[0].id);
    });
  });

  // Update education
  $("#editEducationForm").submit(function (event) {
    event.preventDefault();
    var url = $("#editEducationForm").attr("action");
    $(this).ajaxSubmit({
      error: function (xhr) {},
      success: function (response) {
        loadEducation();
        $("#editEducationModal").modal("toggle");
      },
    });
  });

  // Delete education
  $("#deleteEducationModal").on("show.bs.modal", function (e) {
    //get data-id attribute of the clicked element
    var id = $(e.relatedTarget).data("education-id");

    //populate the textbox
    $(e.currentTarget).find('input[name="educationId"]').val(id);
  });

  $("#btnDeleteEducation").click(function (event) {
    event.preventDefault();
    const id = $("#educationId").val();
    $.ajax({
      type: "get",
      url: "/education/delete/" + id,
      dataType: "text",
    }).done(function (data) {
      loadEducation();
      $("#deleteEducationModal").modal("toggle");
    });
  });
});
