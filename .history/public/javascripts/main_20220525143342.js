let totalBill = document.getElementsByClassName("totalBill");
for (let i = 0; i < totalBill.length; i++) {
  let array = totalBill[i].innerHTML.split(",");

  // Tiền thêm - Tiền cộng - phí
  totalBill[i].innerHTML = formatVND(Number(array[0]) - Number(array[1]) - Number(array[2]));
}

function formatVND(money) {
  return money.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "vnđ";
}
