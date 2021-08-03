// import "./stylesheets/main.css";
// Everything below is just a demo. You can delete all of it.
import Pomodoro from "./pomodoro/pomodoro.js";

// import { ipcRenderer } from "electron";
// import jetpack from "fs-jetpack";
// import env from "env";
//
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

startBtn.addEventListener("click", () => {
  pomodoro.handleTimer();
});
