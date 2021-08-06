// import "./stylesheets/main.css";
// Everything below is just a demo. You can delete all of it.
import { ipcRenderer } from "electron";
import Pomodoro from "./pomodoro/pomodoro.js";

const modal = document.querySelector("#timeModal");
const sbTitleTag = document.querySelector(".sb-title-tag");
const app = document.querySelector("#app");
const timer = document.querySelector(".timer");
const timerDisplayWrapper = document.querySelector("#timerDisplayWrapper");
const settingTag = document.querySelector("#settingTag");
const pauseResumeTag = document.querySelector("#pauseResumeTag");
const timeSettings = document.querySelector("#settings");
const timeWrapper = document.querySelector(".time-wrapper");
const menuBtn = document.querySelector(".menu__btn");
const startBtn = document.querySelector("#startBtn");
const resetBtn = document.querySelector("#resetBtn");
const handleTimerBtn = document.querySelector("#handleTimer");
const timeDisplayContainer = document.querySelector(".time-display");
const timeDisplayBox = document.querySelector("#timeDisplay");
const timeDisplayTitleTag = document.querySelector("#timeDisplayTitleTag");
const setPomodoroTimer = document.querySelector("#setPomodoroTimer");
const workTimer = document.querySelector("#workTime");
const breakTimer = document.querySelector("#breakTime");
const svgFirstSegment = document.querySelector("#first-segment");
const svgSecondSegment = document.querySelector("#second-segment");
const svgThirdSegment = document.querySelector("#third-segment");
const svgFourthSegment = document.querySelector("#fourth-segment");
const pathTopRight = document.querySelector("#top-right");
const pathBottomRight = document.querySelector("#bottom-right");
const pathTopLeft = document.querySelector("#top-left");
const pathBottomLeft = document.querySelector("#bottom-left");
const w = window.innerWidth;
const h = window.innerHeight;
const pomodoro = new Pomodoro(
  workTimer,
  breakTimer,
  handleTimerBtn,
  timeDisplayBox,
  timeSettings
);
const windowTopBar = document.createElement("div");

let bool = false;
let firstBool = false;

// make frameless window movable
windowTopBar.style.width = "100%";
windowTopBar.style.height = "32px";
windowTopBar.style.height = "32px";
windowTopBar.style.cursor = "grap";
// windowTopBar.style.backgroundColor = "#000";
windowTopBar.style.position = "absolute";
windowTopBar.style.top = windowTopBar.style.left = 0;
windowTopBar.style.webkitAppRegion = "drag";
document.body.appendChild(windowTopBar);

console.log("WINDOWSIZE: ", w + " : " + h);

resetBtn.addEventListener("click", () => {
  window.location.reload();
  // console.log(window.cache);
});

timeSettings.addEventListener("mouseover", () => {
  console.log("HOVER");
  document.querySelector(".tooltip-settingTag").style.display = "block";
});
timeSettings.addEventListener("mouseout", () => {
  console.log("LEAVE");
  document.querySelector(".tooltip-settingTag").style.display = "none";
});

ipcRenderer.on("minimize", (event, arg) => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  console.log("WINDOWSIZE: ", w + " : " + h);
  // console.log("IPCMAIN: ", arg);
  console.log("WINDOWSIZE: ", w + " : " + h);
  if (arg) {
    app.style.background = "blueviolet";
    // document.body.style.backgroundImage = "none";
    timer.style.marginTop = "0";
    timeDisplayBox.style.top = "-53px";
    timeDisplayBox.style.left = "-7px";
    timeDisplayContainer.style.top = "48%";
    timeDisplayContainer.style.left = "40%";
    timeDisplayTitleTag.style.display = "none";
    handleTimerContainer.style.display = "none";
    timeWrapper.style.display = "none";
    svgFirstSegment.style.top = "-38px";
    svgFirstSegment.style.right = "29px";
    svgFirstSegment.setAttribute("width", "122");
    svgFirstSegment.setAttribute("height", "125");
    pathTopRight.setAttribute("stroke-width", "20");

    svgSecondSegment.style.bottom = "-121px";
    svgSecondSegment.style.right = "29px";
    svgSecondSegment.setAttribute("width", "122");
    svgSecondSegment.setAttribute("height", "125");
    pathBottomRight.setAttribute("stroke-width", "20");

    svgThirdSegment.style.bottom = "-121px";
    svgThirdSegment.style.left = "43px";
    svgThirdSegment.setAttribute("width", "122");
    svgThirdSegment.setAttribute("height", "125");
    pathTopLeft.setAttribute("stroke-width", "20");

    svgFourthSegment.style.top = "-37px";
    svgFourthSegment.style.left = "43px";
    svgFourthSegment.setAttribute("width", "122");
    svgFourthSegment.setAttribute("height", "125");
    pathBottomLeft.setAttribute("stroke-width", "20");
  }
  if (!arg) {
    app.style.background = "url(../app/images/gummy-apple-watch.png) no-repeat";
    app.style.backgroundSize = "650px 600px";
    app.style.backgroundPosition = "center";
    // document.body.style.backgroundImage =
    // "url(../app/images/gummy-apple-watch.png) no-repeat";
    timeSettings.style.left = "0";
    timeSettings.style.top = "-51px";
    timeDisplayBox.style.top = "55px";
    timeDisplayBox.style.left = "12px";
    timer.style.marginTop = "30px";
    timeDisplayTitleTag.style.display = "block";
    timeDisplayTitleTag.style.marginTop = "-74px";
    timeDisplayContainer.style.top = "50%";
    timeDisplayContainer.style.left = "50%";
    handleTimerContainer.style.display = "block";
    timeWrapper.style.display = "block";
    svgFirstSegment.style.top = "0";
    svgFirstSegment.style.right = "0";
    svgFirstSegment.setAttribute("width", "163");
    svgFirstSegment.setAttribute("height", "165");
    pathTopRight.setAttribute("stroke-width", "15");

    svgSecondSegment.style.bottom = "0";
    svgSecondSegment.style.right = "0";
    svgSecondSegment.setAttribute("width", "163");
    svgSecondSegment.setAttribute("height", "165");
    pathBottomRight.setAttribute("stroke-width", "15");

    svgThirdSegment.style.bottom = "0";
    svgThirdSegment.style.left = "0";
    svgThirdSegment.setAttribute("width", "163");
    svgThirdSegment.setAttribute("height", "165");
    pathTopLeft.setAttribute("stroke-width", "15");

    svgFourthSegment.style.top = "0";
    svgFourthSegment.style.left = "0";
    svgFourthSegment.setAttribute("width", "163");
    svgFourthSegment.setAttribute("height", "165");
    pathBottomLeft.setAttribute("stroke-width", "15");
  }
});

menuBtn.addEventListener("click", () => {
  console.log(ipcRenderer);
  if (bool) {
    bool = false;
    timeModal.classList.add("mobile");
    ipcRenderer.send("minimize", bool);
  } else if (!bool) {
    bool = true;
    timeModal.classList.remove("mobile");
    ipcRenderer.send("minimize", bool);
  }
});

timeSettings.addEventListener("click", init);

function init() {
  timeModal.classList.add("is-active");

  startBtn.addEventListener("click", () => {
    justDoit.style.display = "none";
    timeDisplayTitleTag.style.marginTop = "-48px";
    timeSettings.style.position = "absolute";
    timeSettings.style.left = "0px";
    timeSettings.classList.add("is-warning", "is-rounded");
    sbTitleTag.style.opacity = "0";

    menuBtn.classList.add("active");
    handleTimerBtn.style.display = "block";

    // handleTimerBtn.dataset.btnstate = "Start!";
    // handleTimerBtn.innerText = "Start!";
    timeModal.classList.remove("is-active");
    timeDisplayContainer.style.top = "42%";
    pomodoro.resetAll(true);
    pomodoro.handleTimer(true, workTimer.value, breakTimer.value);
  });
  resetBtn.addEventListener("click", () => {
    pomodoro.resetAll(true);
  });

  document.querySelector(".modal-close").addEventListener("click", () => {
    timeModal.classList.remove("is-active");
  });

  timerDisplayWrapper.style.backgroundImage =
    "url('../app/images/gummy-coffee.png') no-repeat";

  // timeDisplayTitleTag.style.display = "none";
}
