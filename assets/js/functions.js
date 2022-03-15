$(document).ready(function () {
  loadData();

  $("#addPhotoForm").submit(function (event) {
    event.preventDefault();
    $(this).ajaxSubmit({
      error: function (xhr) {},
      success: function (response) {
        refresh();
      },
    });
  });

  $("#btnDeletePhoto").click(function (event) {
    event.preventDefault();
    const id = $("#photoId").val();
    $.ajax({
      type: "get",
      url: "/delete/" + id,
      dataType: "text",
    }).done(function (data) {
      loadData();
      $("#deletePhotoModal").modal("toggle");
    });
  });

  $("#addPhotoModal").on("hidden.bs.modal", function () {
    $("#addPhotoModal form")[0].reset();
  });

  $("#editPhotoModal").on("hidden.bs.modal", function () {
    $("#editPhotoModal form")[0].reset();
  });

  function loadData() {
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", "/list", false);
    xhttp.send();

    const photos = JSON.parse(xhttp.responseText);
    document.getElementById("photos").innerHTML = "";
    for (let photo of photos) {
      const content = `
                <div class="portfolio-item padd-15">
                    <div class="portfolio-item-inner shadow-dark">
                        <div class="portfolio-img">
                            <img src="img/${photo.image}" alt="${photo.title}" width="100" height="300">
                        </div>
                    </div>
                    
                    <div class="title padd-15"><h4 class="skin-color-style">${photo.title}</h4></div>
                    <div class="title padd-15 skin-color-style"><i class="fa fa-map-pin"></i> ${photo.location}</div>
                    <div class="description padd-15 skin-color-style-text">${photo.description}</div>
                    <div>&nbsp;</div>
                    <div class="description padd-15">
                      <button type="button" class="btn btn-sm btn-danger" data-photo-id="${photo.id}" data-toggle="modal" data-target="#deletePhotoModal" 
                      data-backdrop="static" data-keyboard="false">Delete</button>
                      <button type="button" class="btn btn-sm btn-warning"  data-photo-id="${photo.id}" data-toggle="modal" data-target="#editPhotoModal"
                      data-backdrop="static" data-keyboard="false">Edit</button>
                    </div>
                </div>
        `;

      document.getElementById("photos").innerHTML += content;
    }
  }

  function refresh() {
    loadData();
    $("#addPhotoModal").modal("toggle");
  }

  $("#deletePhotoModal").on("show.bs.modal", function (e) {
    //get data-id attribute of the clicked element
    var id = $(e.relatedTarget).data("photo-id");

    //populate the textbox
    $(e.currentTarget).find('input[name="photoId"]').val(id);
  });

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

  $("#editPhotoForm").submit(function (event) {
    event.preventDefault();
    var url = $("#editPhotoForm").attr("action");
    $(this).ajaxSubmit({
      error: function (xhr) {},
      success: function (response) {
        loadData();
        $("#editPhotoModal").modal("toggle");
      },
    });
    // $.ajax({
    //   url: url,
    //   type: "POST",
    //   data: {
    //     title: $("#updateTitle").val(),
    //     location: $("#updateLocation").val(),
    //     description: $("#updateDescription").val(),
    //   },
    //   dataType: "json",
    // });

    // loadData();
    // $("#editPhotoModal").modal("toggle");
  });
});
