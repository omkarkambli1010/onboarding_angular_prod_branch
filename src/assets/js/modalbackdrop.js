$(document).ready(function () {
  function setBackdropOpacity(opacity) {
      const backdrop = $(".modal-backdrop");
      backdrop.css("opacity", opacity);
      if (opacity === 0) {
          backdrop.css("display", "none");
      } else {
          backdrop.css("display", "block");
      }
  }

  $(".modal").on("show.bs.modal", function () {
      if ($(".modal-backdrop").length === 0) {
          $('<div class="modal-backdrop"></div>').appendTo(document.body);
      }
      setBackdropOpacity(0.1);
  });

  $(".modal").on("hidden.bs.modal", function () {
      if ($(".modal.show").length === 0) {
          setBackdropOpacity(0);
      }
  });
});