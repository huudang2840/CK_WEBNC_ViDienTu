let totalBill = document.getElementsByClassName("totalBill");

function totalBillWallet(bill) {
  for (let i = 0; i < bill.length; i++) {
    let array = bill[i].innerHTML.split(",");

    // Tiền thêm - Tiền cộng - phí
    bill[i].innerHTML = formatVND(Number(array[0]) - Number(array[1]) - Number(array[2]));
  }
}
function formatVND(money) {
  return money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " đ";
}
