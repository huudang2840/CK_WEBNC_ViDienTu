let totalBill = document.getElementsByClassName("totalBill");
for (let i = 0; i < totalBill.length; i++) {
  let { add, sub, fee } = mystring_mix.split(",");
  totalBill[i].innerHTML = Number(totalBill[i].innerHTML);
}
