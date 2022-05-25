let totalBill = document.getElementsByClassName("totalBill");
for (let i = 0; i < totalBill.length; i++) {
  let { add, sub, fee } = totalBill[i].innerHTML.split("/");
  totalBill[i].innerHTML = Number();
}
