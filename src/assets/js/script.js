// // Owlcarousel
if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
  document
    .querySelector('meta[name="viewport"]')
    .setAttribute(
      "content",
      "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    );
}

// document.addEventListener("DOMContentLoaded", function () {
//   var accordionItems = document.querySelectorAll(".accordion-item");

//   accordionItems.forEach(function (item) {
//     item.addEventListener("shown.bs.collapse", function () {
//       this.classList.add("collapsed");
//     });

//     item.addEventListener("hidden.bs.collapse", function () {
//       this.classList.remove("collapsed");
//     });
//   });
// });

$(document).ready(function () {
  $(".videos-carousel").owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    autoplay: false,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    center: false,
    dots: true,
    navText: [
      "<i class='fa fa-long-arrow-left'></i>",
      "<img class='arrow-right' src='assets/images/arrow_forward_24px.png'>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 3,
      },
    },
  });

  $(".trust-carousel").owlCarousel({
    loop: true,
    margin: 30,
    nav: false,
    autoplay: false,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    center: false,
    dots: true,
    navText: [
      "<i class='fa fa-long-arrow-left'></i>",
      "<img class='arrow-right' src='assets/images/arrow_forward_24px.png'>",
    ],
    responsive: {
      0: {
        items: 1.2,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 3,
      },
    },
  });

  $(".trust-home-carousel").owlCarousel({
    loop: true,
    margin: 30,
    nav: false,
    autoplay: false,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    center: false,
    dots: false,
    navText: [
      "<img class='arrow-right' src='assets/images/arrowlefthome.svg'>",
      "<img class='arrow-right' src='assets/images/arrowrighthome.svg'>",
    ],
    responsive: {
      0: {
        items: 1,
        nav: true,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
    },
  });

  $(".etfbenefits-carousel").owlCarousel({
    loop: true,
    margin: 40,
    nav: false,
    autoplay: false,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    center: false,
    dots: true,
    navText: [
      "<i class='fa fa-long-arrow-left'></i>",
      "<img class='arrow-right' src='assets/images/arrow_forward_24px.png'>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 4,
      },
    },
  });

  $(".youtubevideo-carousel").owlCarousel({
    loop: true,
    margin: 20,
    nav: false,
    autoplay: false,
    autoplayTimeout: 3000,
    autoplayHoverPause: false,
    center: false,
    dots: false,
    navText: [
      "<img class='arrow-right' src='assets/images/arrowlefthome.svg'>",
      "<img class='arrow-right' src='assets/images/arrowrighthome.svg'>",
    ],
    responsive: {
      0: {
        items: 1,
        nav: true,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 2,
      },
    },
  });

  $(".abt-us ul li").click(function () {
    $(".abt-us ul li").removeClass("active");
    $(this).addClass("active");
  });

  $(".l1").hover(
    function () {
      $(".bod1-img").css("display", "none");
      $(".colored1-div").css("display", "block");
    },
    function () {
      $(".bod1-img").css("display", "block");
      $(".colored1-div").css("display", "none");
    }
  );

  $(".l2").hover(
    function () {
      $(".bod2-img").css("display", "none");
      $(".colored2-div").css("display", "block");
    },
    function () {
      $(".bod2-img").css("display", "block");
      $(".colored2-div").css("display", "none");
    }
  );

  $(".l3").hover(
    function () {
      $(".bod3-img").css("display", "none");
      $(".colored3-div").css("display", "block");
    },
    function () {
      $(".bod3-img").css("display", "block");
      $(".colored3-div").css("display", "none");
    }
  );
  $(".l4").hover(
    function () {
      $(".bod4-img").css("display", "none");
      $(".colored4-div").css("display", "block");
    },
    function () {
      $(".bod4-img").css("display", "block");
      $(".colored4-div").css("display", "none");
    }
  );
  $(".l5").hover(
    function () {
      $(".bod5-img").css("display", "none");
      $(".colored5-div").css("display", "block");
    },
    function () {
      $(".bod5-img").css("display", "block");
      $(".colored5-div").css("display", "none");
    }
  );
  $(".l6").hover(
    function () {
      $(".bod6-img").css("display", "none");
      $(".colored6-div").css("display", "block");
    },
    function () {
      $(".bod6-img").css("display", "block");
      $(".colored6-div").css("display", "none");
    }
  );
});
