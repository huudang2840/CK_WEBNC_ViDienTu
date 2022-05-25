let totalBill = document.getElementsByClassName("totalBill");
for (let i = 0; i < totalBill.length; i++) {
  let array = totalBill[i].innerHTML.split(",");

  // Tiền thêm - Tiền cộng - phí
  totalBill[i].innerHTML = formatVND(Number(array[0]) - Number(array[1]) - Number(array[2]));
}

function formatVND(money) {
  return  function formatVND(money) {
    .split('').reverse().reduce((prev, next, index) => {
    return ((index % 3) ? next : (next + ',')) + prev
})
