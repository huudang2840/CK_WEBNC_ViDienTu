let totalBill = document.getElementsByClassName("totalBill");
for (let i = 0; i < totalBill.length; i++) {
  let { add, sub, fee } = totalBill[i].innerHTML.split("/");
  console.log(add, sub, fee);
  totalBill[i].innerHTML = Number(add) - Number(sub) - Number(fee);
}
