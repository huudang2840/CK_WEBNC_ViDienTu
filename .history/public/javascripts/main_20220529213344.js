let totalBill = document.getElementsByClassName("totalBill");
totalBillWallet(totalBill);

function totalBillWallet(bill) {
  for (let i = 0; i < bill.length; i++) {
    let array = bill[i].innerHTML.split(",");
    let total = Number(array[0]) - Number(array[1]) - Number(array[2]);
    if (total > 0) {
      total = "+" + total;
    }

    // Tiền thêm - Tiền cộng - phí
    bill[i].innerHTML = formatVND(total);
  }
}
function formatVND(money) {
  return money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " đ";
}

(function ($) {
  "use strict";

  $(function () {
    var header = $(".start-style");
    $(window).scroll(function () {
      var scroll = $(window).scrollTop();

      if (scroll >= 10) {
        header.removeClass("start-style").addClass("scroll-on");
      } else {
        header.removeClass("scroll-on").addClass("start-style");
      }
    });
  });

  //Animation

  $(document).ready(function () {
    $("body.hero-anime").removeClass("hero-anime");
  });

  //Menu On Hover

  $("body").on("mouseenter mouseleave", ".nav-item", function (e) {
    if ($(window).width() > 750) {
      var _d = $(e.target).closest(".nav-item");
      _d.addClass("show");
      setTimeout(function () {
        _d[_d.is(":hover") ? "addClass" : "removeClass"]("show");
      }, 1);
    }
  });

  //Switch light/dark

  $("#switch").on("click", function () {
    if ($("body").hasClass("dark")) {
      $("body").removeClass("dark");
      $("#switch").removeClass("switched");
    } else {
      $("body").addClass("dark");
      $("#switch").addClass("switched");
    }
  });
})(jQuery);
