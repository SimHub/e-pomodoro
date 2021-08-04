// import "./stylesheets/main.css";
// Everything below is just a demo. You can delete all of it.
import Pomodoro from "./pomodoro/pomodoro.js";

import { ipcRenderer } from "electron";

const timeWrapper = document.querySelector(".time-wrapper");
const menubtn = document.querySelector(".menu__btn");
const startBtn = document.querySelector("#handleTimer");
const timeDisplayBox = document.querySelector("#timeDisplay");
const setPomodoroTimer = document.querySelector("#setPomodoroTimer");
const workTimer = document.querySelector("#workTime");
const breakTimer = document.querySelector("#breakTime");
const pomodoro = new Pomodoro(
  workTimer,
  breakTimer,
  startBtn,
  timeDisplayBox,
  setPomodoroTimer
);
let bool = false;
let firstBool = false;
ipcRenderer.on("minimize", (event, arg) => {
  // console.log("IPCMAIN: ", arg);
  if (arg) {
    timeWrapper.style.display = "none";
  }
  if (!arg) {
    timeWrapper.style.display = "block";
  }
});

menubtn.addEventListener("click", () => {
  if (bool) {
    bool = false;
    ipcRenderer.send("minimize", bool);
  } else if (!bool) {
    bool = true;
    ipcRenderer.send("minimize", bool);
    // firstBool = true;
  }
});

startBtn.addEventListener("click", () => {
  pomodoro.handleTimer();
});
