let totalBill = document.getElementsByClassName("totalBill");
for (let i = 0; i < totalBill.length; i++) {
  console.log(totalBill[i].innerHTML);
  totalBill[i].innerHTML = Number(1);
}
