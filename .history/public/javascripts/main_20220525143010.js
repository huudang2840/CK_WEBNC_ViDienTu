let totalBill = document.getElementsByClassName("totalBill");
for (let i = 0; i < totalBill.length; i++) {
  let array = totalBill[i].innerHTML.split(",");

  // Tiền thêm - Tiền cộng - phí
  totalBill[i].innerHTML = Number(array[0]) - Number(array[1]) - Number(array[2]);
}

function format2(n, currency) {
  return currency + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}