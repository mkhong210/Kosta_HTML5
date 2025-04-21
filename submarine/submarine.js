//캔버스 객체
// var canvas;
// var ctx;
// var canvasBuffer;
// var bufferCtx;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasBuffer = document.createElement("canvas");
canvasBuffer.width = canvas.width;
canvasBuffer.height = canvas.height;
const bufferCtx = canvasBuffer.getContext("2d");

var threadSpeed = 16;

//잠수함
var submarine;
var sx,
  sy,
  sw = 60,
  sh = 35;

//배경이미지
var background;

//장애물
var enemy = new Array();
var enemyColor = ["red", "blue", "white"];
var ellapse = 10;

//타이머
var loopInstance;

//게임 상태
var STATE_START = false;
var STATE_GAMEOVER = false;

//키 상태
var keyPressed = [];

//경과시간
var oldTime;
var startTime;
var totalTime;

//이벤트
window.addEventListener("load", initialize, false);
window.addEventListener("keydown", getKeyDown, false);
window.addEventListener("keyup", getKeyUp, false);

// 타이머
function getTime() {
  var date = new Date();
  var time = date.getTime();
  return time;
}

function startMessage() {
  drawText(
    ctx,
    "Enter to Start",
    canvas.width / 2,
    canvas.height / 2,
    "bold 30px arial",
    "#ffff00",
    "center"
  );
  drawText(
    ctx,
    "조작 : 방향키 ←↑→↓",
    canvas.width / 2,
    canvas.height / 2 + 30,
    "bold 20px arial",
    "#ffffff",
    "center"
  );
}

function drawText(ctx, text, x, y, font, color, align) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

function setImage() {
  submarine = new Image();
  submarine.src = "../asset/jamsuham.png";
  background = new Image();
  background.src = "../asset/sea2.jpg";
}

function createObstacle() {
  enemy.length = 0;
  for (var i = 0; i < 60; i++) {
    enemy.push({
      x: Math.random() * canvas.width,
      y: i < 60 / 2 ? 20 : canvas.height - 20,
      vx: Math.random() * 200 - 100,
      vy: Math.random() * 200 - 100,
      color: Math.floor(Math.random() * 3),
    });
  }
}

function startGame() {
  STATE_START = true;
  sx = canvas.width / 2 - 18;
  sy = canvas.height / 2 - 18;
  sw = 60;
  sh = 35;

  //장애물 생성
  createObstacle();

  // 현재 시간 저장
  startTime = getTime();
  oldTime = getTime();
}

function drawObstacle() {
  for (var i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.arc(enemy[i].x, enemy[i].y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = enemyColor[enemy[i].color];
    ctx.closePath();
    ctx.fill();
  }
}

function drawAll() {
  if (!STATE_START) {
    return;
  } else if (STATE_GAMEOVER) {
    //게임 종료시
    STATE_START = false;
    totalTime = getTime() - startTime;
    drawText(
      ctx,
      "Game Over",
      canvas.width / 2,
      canvas.height / 2,
      "bold 30px arial",
      "#ffff00",
      "center"
    );
    drawText(
      ctx,
      `score : ${totalTime}`,
      canvas.width / 2,
      canvas.height / 2 + 30,
      "bold 20px arial",
      "#ffffff",
      "center"
    );
    drawText(
      ctx,
      "Spacebar to Restart",
      canvas.width / 2,
      canvas.height / 2 + 50,
      "bold 20px arial",
      "#ffffff",
      "center"
    );
  } else {
    //게임 플레이
    //배경이미지
    bufferCtx.drawImage(background, 0, 0, canvas.width, canvas.height);
    //잠수함 캐릭터
    bufferCtx.drawImage(submarine, sx, sy, sw, sh);
    ctx.drawImage(canvasBuffer, 0, 0);

    //장애물 출력
    drawObstacle();

    // 경과 시간 출력
    totalTime = getTime() - startTime;
    drawText(
      ctx,
      totalTime,
      canvas.width - 20,
      20,
      "bold 20px arial",
      "#ffff00",
      "right"
    );
  }
}

// 충돌 검사
function crashObstacle(index) {
  let mx = enemy[index].x;
  let my = enemy[index].y;

  if (
    mx > sx - sw / 2 &&
    mx < sx + sw / 2 &&
    my > sy - sh / 2 &&
    my < sy + sh / 2
  ) {
    // alert("충돌");
    STATE_GAMEOVER = true;
  }
}

function moveObstacle() {
  for (var i = 0; i < 60; i++) {
    var mx = (enemy[i].vx * ellapse) / 1000;
    var my = (enemy[i].vy * ellapse) / 1000;
    enemy[i].x += mx;
    enemy[i].y += my;

    if (enemy[i].x > canvas.width) enemy[i].x = 0;
    if (enemy[i].x < 0) enemy[i].x = canvas.width;
    if (enemy[i].y > canvas.height) enemy[i].y = 0;
    if (enemy[i].y < 0) enemy[i].y = canvas.height;

    // 충돌 검사
    crashObstacle(i);
  }
}

//주기적으로 반복되는 루틴
function update() {
  if (keyPressed[13] == true && !STATE_START) {
    //게임 시작해
    // alert('게임 시작');
    startGame();
  }
  if (keyPressed[38] == true) {
    sy -= 3;
  }
  if (keyPressed[37] == true) {
    sx -= 3;
  }
  if (keyPressed[39] == true) {
    sx += 3;
  }
  if (keyPressed[40] == true) {
    sy += 3;
  }

  if (STATE_START) {
    //장애물 이동
    moveObstacle();
    //그려줘.
    drawAll();
  }
}

function getKeyDown(event) {
  keyPressed[event.keyCode] = true;
}
function getKeyUp(event) {
  keyPressed[event.keyCode] = false;
}

function initialize() {
  //화면 그리기 준비
  // canvas = document.getElementById("canvas");
  if (canvas == null) return;
  // ctx = canvas.getContext("2d");

  // canvasBuffer = document.createElement("canvas");
  // canvasBuffer.width = canvas.width;
  // canvasBuffer.height = canvas.height;
  // bufferCtx = canvasBuffer.getContext("2d");

  //게임 시작 메시지
  startMessage();

  //이미지 설정
  setImage();

  //반복 동작 설정
  loopInstance = setInterval(update, threadSpeed);
}
