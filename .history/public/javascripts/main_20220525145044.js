let totalBill = document.getElementsByClassName("totalBill");
totalBillWallet(totalBill);

function totalBillWallet(bill) {
  for (let i = 0; i < bill.length; i++) {
    let array = bill[i].innerHTML.split(",");
    let total
    if ((Number(array[0]) - Number(array[1]) - Number(array[2]) > 0){
        
    }

    // Tiền thêm - Tiền cộng - phí
    bill[i].innerHTML = formatVND());
  }
}
function formatVND(money) {
  return money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " đ";
}
