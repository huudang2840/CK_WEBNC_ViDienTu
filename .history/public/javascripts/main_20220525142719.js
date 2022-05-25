let totalBill = document.getElementsByClassName("totalBill");
for (let i = 0; i < totalBill.length; i++) {
  let array = totalBill[i].innerHTML.split(",");

  totalBill[i].innerHTML = Number(array[0]) - Number(array[1]) - Number(array[2]);
}
