let totalBill = document.getElementsByClassName("totalBill");
for (let i = 0; i < totalBill.length; i++) {
  let array = totalBill[i].innerHTML.split("/");
  console.log(array);
  totalBill[i].innerHTML = array;
}
