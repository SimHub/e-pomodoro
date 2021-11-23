// import "./stylesheets/main.css";
// Everything below is just a demo. You can delete all of it.
import { ipcRenderer } from "electron";
import Pomodoro from "./pomodoro/pomodoro.js";

const _html = document.querySelector("html");
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
  timeSettings,
  app
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

//// open window defaultSize
ipcRenderer.send("minimize", false);
//
ipcRenderer.on("minimize", (event, arg) => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  console.log("ipcRenderEvent", event);
  console.log("ipcRenderArg", arg);
  console.log("WINDOWSIZE: ", w + " : " + h);
  // console.log("IPCMAIN: ", arg);
  console.log("WINDOWSIZE: ", w + " : " + h);
  if (arg) {
    bool = true;
    _html.style.background = "aliceblue";
    // app.style.background = "blueviolet";
    // document.body.style.backgroundImage = "none";
    timer.style.background = "none";
    timer.style.marginTop = "0";

    timeDisplayBox.style.top = "-53px";
    timeDisplayBox.style.left = "-7px";
    timeDisplayContainer.style.top = "48%";
    timeDisplayContainer.style.left = "40%";
    timeDisplayTitleTag.style.display = "none";

    handleTimerContainer.style.display = "none";
    timeWrapper.style.display = "none";
    svgFirstSegment.style.display = "none";

    svgSecondSegment.style.display = "none";

    svgThirdSegment.style.display = "none";

    svgFourthSegment.style.display = "none";
  }
  if (!arg) {
    bool = false;
    _html.style.background = "none";
    timeSettings.style.left = "0";
    timeSettings.style.top = "0";
    timeDisplayBox.style.top = "55px";
    timeDisplayBox.style.left = "12px";

    timer.style.background = "url(images/gummy-apple-watch.png) no-repeat";
    timer.style.backgroundSize = "650px 600px";
    timer.style.backgroundPosition = "center";
    timer.style.marginTop = "30px";

    timeDisplayTitleTag.style.display = "block";
    timeDisplayTitleTag.style.marginTop = "-74px";
    timeDisplayContainer.style.top = "50%";
    timeDisplayContainer.style.left = "50%";
    handleTimerContainer.style.display = "block";
    timeWrapper.style.display = "block";

    svgFirstSegment.style.display = "block";

    svgSecondSegment.style.display = "block";
    svgThirdSegment.style.display = "block";

    svgFourthSegment.style.display = "block";
  }
});

menuBtn.addEventListener("click", (e) => {
  const _this = e.target;
  // console.log(ipcRenderer);
  if (bool) {
    bool = false;
    _this.style.color = "#616161";
    console.log("_THIS : ", _this);
    timeModal.classList.add("mobile");
    ipcRenderer.send("minimize", bool);
  } else if (!bool) {
    bool = true;
    _this.style.color = "white";
    timeModal.classList.remove("mobile");
    ipcRenderer.send("minimize", bool);
  }
});

timeSettings.addEventListener("click", init);

function init() {
  timeModal.classList.add("is-active");

  startBtn.addEventListener("click", () => {
    justDoit.style.display = "none";
    timeSettings.classList.add("is-warning", "is-rounded");
    sbTitleTag.style.opacity = "0.5";

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
}
