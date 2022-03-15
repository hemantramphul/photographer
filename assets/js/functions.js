$(document).ready(function () {
  loadData();

  $("#addNew").submit(function (event) {
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

  $("#addModal").on("hidden.bs.modal", function () {
    $("#addModal form")[0].reset();
  });

  function loadData() {
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", "/books/list", false);
    xhttp.send();

    const books = JSON.parse(xhttp.responseText);
    document.getElementById("books").innerHTML = "";
    for (let book of books) {
      const x = `
            <div class="col-4">
                <div class="card">
                    <img class="img-fluid img-thumbnail" src="img/${book.image}" alt="${book.name}">
                    <div class="card-body">
                        <h5 class="card-title">${book.name}</h5>
                        <p class="card-text">${book.author}</p>

                        <button type="button" class="btn btn-danger" data-book-id="${book.id}" data-toggle="modal" data-target="#confirmationModal" data-backdrop="static" data-keyboard="false">Delete</button>
                        <button type="button" class="btn btn-primary"  data-book-id="${book.id}" data-toggle="modal" data-target="#editModal" data-backdrop="static" data-keyboard="false">Edit</button>
                    </div>
                </div>
            </div>
        `;

      document.getElementById("books").innerHTML += x;
    }
  }

  function refresh() {
    loadData();
    $("#addModal").modal("toggle");
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
