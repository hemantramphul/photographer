$(document).ready(function () {
  loadData();

  $("#addPhoto").submit(function (event) {
    event.preventDefault();
    $(this).ajaxSubmit({
      error: function (xhr) {},
      success: function (response) {
        refresh();
      },
    });
  });

  $("#btnDelete").click(function (event) {
    event.preventDefault();
    const id = $("#bookId").val();
    $.ajax({
      type: "get",
      url: "/books/delete/" + id,
      dataType: "text",
    }).done(function (data) {
      loadData();
      $("#confirmationModal").modal("toggle");
    });
  });

  $("#addPhotoModal").on("hidden.bs.modal", function () {
    $("#addPhotoModal form")[0].reset();
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
                </div>
        `;

      document.getElementById("photos").innerHTML += content;
    }
  }

  function refresh() {
    loadData();
    $("#addPhotoModal").modal("toggle");
  }

  //triggered when modal is about to be shown
  $("#confirmationModal").on("show.bs.modal", function (e) {
    //get data-id attribute of the clicked element
    var bookId = $(e.relatedTarget).data("book-id");

    //populate the textbox
    $(e.currentTarget).find('input[name="bookId"]').val(bookId);
  });

  $("#editModal").on("shown.bs.modal", function (e) {
    //get data-id attribute of the clicked element
    var bookId = $(e.relatedTarget).data("book-id");

    e.preventDefault();
    $.ajax({
      type: "get",
      url: "/books/edit/" + bookId,
      dataType: "json",
    }).done(function (data) {
      //var res = JSON.parse(data);
      $("#updateName").val(data[0].name);
      $("#updateAuthor").val(data[0].author);
      $("#editForm").attr("action", "/books/update/" + data[0].id);
    });
  });

  $("#editForm").submit(function (event) {
    event.preventDefault();
    var url = $("#editForm").attr("action");
    $.ajax({
      url: url,
      type: "POST",
      data: {
        name: $("#updateName").val(),
        author: $("#updateAuthor").val(),
      },
      dataType: "json",
    });

    loadData();
    $("#editModal").modal("toggle");
  });
});
