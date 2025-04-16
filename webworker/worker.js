// 25.04.16 - 2

onmessage = function (event) {
  const rcv = event.data;
  stopOperation();
  document.getElementById("result").innerHTML = "일어날 시간입니다.";
};

function stopOperation() {
  let Time = new Date().getTime();
  console.log(Time);
  let endTime = Time + 5000;
  console.log(endTime);
  while (Time < endTime);
}
