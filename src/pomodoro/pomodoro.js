const { ipcRenderer } = require("electron");
import ProgressBar from "progressbar.js";
import confetti from "canvas-confetti";
// console.log([ProgressBar]);
export default class Pomodoro {
  constructor(
    workTimer,
    breakTimer,
    handleTimerBtn,
    timeDisplayBox,
    setPomodoroTimer
  ) {
    this._alert = false;
    this._alertW = false;
    this._alertWFirst = false;
    this._alertG = false;
    this.workTimer = workTimer;
    this.breakTimer = breakTimer;
    this.timeDisplayBox = timeDisplayBox;
    // this.setPomodoroTimer = setPomodoroTimer;

    // this.pomodoroDuration = this.workTimer.value * 60; // 25 mins to secs
    // this.restDuration = this.breakTimer.value * 60;
    this.pomodoroDuration = 0;
    this.restDuration = 0;

    this.currentTimeInSeconds = this.pomodoroDuration;
    this.currentSegment = 1;
    this.buttonText = handleTimerBtn.dataset.btnstate;
    this.handleTimerBtn = handleTimerBtn;
    this.topRight = null;
    this.bottomRight = null;
    this.bottomLeft = null;
    this.topLeft = null;
    this.pathOptions = {
      easing: "linear",
      duration: (this.pomodoroDuration + 1) * 1000, // add a sec and convert to millis
    };
    this.interval = null;
    this.resting = false;

    this.topRight = new ProgressBar.Path("#top-right", this.pathOptions);
    this.topRight.set(1);

    this.bottomRight = new ProgressBar.Path("#bottom-right", this.pathOptions);
    this.bottomRight.set(1);

    this.bottomLeft = new ProgressBar.Path("#bottom-left", this.pathOptions);
    this.bottomLeft.set(1);

    this.topLeft = new ProgressBar.Path("#top-left", this.pathOptions);
    this.topLeft.set(1);

    // workTimer.addEventListener("change", this.workTimerOnChange.bind(this));
    // breakTimer.addEventListener("change", this.breakTimerOnChange.bind(this));

    handleTimerBtn.addEventListener("click", () => {
      this.handleTimer();
    });
  }

  workTimerOnChange(e) {
    const val = e.target.value;
    this.currentTimeInSeconds = val * 60;
  }
  breakTimerOnChange(e) {
    const val = e.target.value;
    this.restDuration = val * 60;
  }
  handleTimer(first = false, wv = null, bv = null) {
    // debugger;
    // if (first) this.buttonText = "Start!";
    console.log("BUTTONTEXT: ", this.buttonText);
    console.log("handleTimer");
    console.log("currentTimeInSeconds", this.currentTimeInSeconds);
    // console.log("INTERVAL: ", this.interval);
    console.log("After-currentTimeInSeconds", this.currentTimeInSeconds);
    console.log("ALERTFIRST: ", this._alertWFirst);
    if (!this._alertWFirst) {
      // debugger;
      this.currentTimeInSeconds = this.workTimer.value * 60;
      this.restDuration = this.breakTimer.value * 60;
      this._alertWFirst = true;
    }
    if (!this._alertWFirst) {
      if (first) {
        // this.buttonText = "Start!";
        // this.handleTimerBtn.dataset.btnstate = "Start!";
        // this.handleTimerBtn.innerText = "Start!";
        this.currentTimeInSeconds = wv * 60;
        this.restDuration = bv * 60;
      }
    }
    console.log("BUTTONTEXT:", this.buttonText);
    // debugger;
    if (this.buttonText === "Start!" || this.buttonText === "Resume") {
      this.animateBar();
      this.buttonText = "Pause";
      this.handleTimerBtn.dataset.btnstate = "Pause";
      this.handleTimerBtn.innerText = "Pause";
      this.handleTimerBtn.classList.remove("is-success");

      this.handleTimerBtn.classList.add("is-info");
      this.timeDisplayBox.classList.add("is-dark");
      // if (this._alertW) this._alertW = false;
    } else if (this.buttonText === "Pause") {
      this.pauseBar();
      this.buttonText = "Resume";
      this.handleTimerBtn.dataset.btnstate = "Resume";
      this.handleTimerBtn.innerText = "Resume";
      this.handleTimerBtn.classList.remove("is-info");
      this.handleTimerBtn.classList.remove("is-success");

      this.timeDisplayBox.classList.remove("is-dark");
    }
    // console.log("INTERVAL: ", this.interval);
  }
  animateBar() {
    this.reduceTime();
    console.log("setPomodoroTimer+++ ", this.setPomodoroTimer);
    console.log("CURRENT_SEGMENT+++: ", this.currentSegment);
    console.log("INTERVAL+++: ", this.interval);
    let segment = null;
    switch (this.currentSegment) {
      case 1:
        segment = this.topRight;
        break;
      case 2:
        segment = this.bottomRight;
        break;
      case 3:
        segment = this.bottomLeft;
        break;
      case 4:
        segment = this.topLeft;
        break;
    }
    segment.animate(
      0,
      {
        duration: (this.currentTimeInSeconds + 1) * 1000,
      },
      () => this.onFinish()
    );
  }
  pauseBar() {
    // console.log("PUSE: ", this);
    console.log("INTERVAL: ", this.interval);
    clearInterval(this.interval);

    console.log("INTERVAL: ", this.interval);
    switch (this.currentSegment) {
      case 1:
        this.topRight.stop();
        break;
      case 2:
        this.bottomRight.stop();
        break;
      case 3:
        this.bottomLeft.stop();
        break;
      case 4:
        this.topLeft.stop();
        break;
    }
  }
  onFinish() {
    // debugger;
    if (this.currentTimeInSeconds <= 0) {
      if (this.currentSegment < 4) {
        this.currentSegment += 1;
        console.log("TAKEABREAK CURRENT_SEGMENT: ", this.currentSegment);
        this.takeABrake();
        this._alert = false;
        this._alertWFirst = true;
      } else {
        // Reset all
        this.resetAll();
        clearInterval(this.interval);
        return;
      }
      // Clear interval
      clearInterval(this.interval);

      // Play audio

      // Immediately disable button and set state
      this.resting = true;
      this.buttonText = "Rest";
      this.handleTimerBtn.dataset.btnstate = "Rest";
      this.handleTimerBtn.innerText = "Rest";
      this.handleTimerBtn.classList.add("is-success");
      this.handleTimerBtn.classList.remove("is-info");

      this.timeDisplayBox.classList.add("is-success");

      // setTimeout(() => {
      // console.log(this.setPomodoroTimer);
      // Change time to reflect rest duration
      this.currentTimeInSeconds = this.restDuration;

      // Start rest after beep ends
      this.startRest();
      // }, 4200);
    }
  }
  resetAll(fromBtn = false) {
    this.topRight.set(1);
    this.topLeft.set(1);
    this.bottomRight.set(1);
    this.bottomLeft.set(1);

    if (!fromBtn) {
      confetti({
        particleCount: 300,
        spread: 100,
        origin: { y: 0.7 },
      });
      this.goHome();
    }
    this.currentSegment = 1;
    this._alertWFirst = false;

    // Clear interval
    clearInterval(this.interval);
    // Immediately disable button and set state
    this.interval = null;
    this.resting = false;
    this.buttonText = "Start!";
    this.handleTimerBtn.dataset.btnstate = "Start!";
    this.handleTimerBtn.innerText = "Start!";
    this.handleTimerBtn.classList.remove("is-success");
    this.handleTimerBtn.classList.remove("is-info");
    this.handleTimerBtn.classList.add("is-link");

    this.timeDisplayBox.classList.add("is-success");

    // this.workTimer.value = 25;
    // this.breakTimer.value = 5;
  }
  reduceTime() {
    this.timeDisplayBox.innerHTML = this.tagTemplate();
    this.interval = setInterval(() => {
      // console.log("currentTimeInSeconds ", this.currentTimeInSeconds);
      if (this.currentTimeInSeconds > 0) {
        this.currentTimeInSeconds -= 1;
      }
      this.timeDisplayBox.innerHTML = this.tagTemplate();
      // console.log("currentTimeInSeconds ", this.currentTimeInSeconds);
      // console.log("INTERVAL: ", this.interval);
    }, 1000);
    console.log("INTERVAL-REDUCETIME: ", this.interval);
    console.log("reduceTime-alertW ", this._alertW);
    console.log("reduceTime-alert ", this._alert);
    console.log("reduceTime-alertWFirst ", this._alertWFirst);
  }
  tagTemplate() {
    console.log("Resting: ", this.resting);
    if (this.resting) {
      return `
      <div class="tags has-addons">
      <span id="timeDisplayMin" class="tag is-warning is-large is-rounded">
        ${this.timeDisplay().min}
      </span>
      <span id="timeDisplaySec" class="tag is-primary is-large is-rounded">
        ${this.timeDisplay().sec}
      </span>
    </div>
`;
    } else {
      return `
      <div class="tags has-addons">
      <span class="tag is-dark is-large is-rounded">${
        this.timeDisplay().min
      }</span>
      <span class="tag is-info is-large is-rounded">${
        this.timeDisplay().sec
      }</span>
    </div>
  `;
    }
  }
  startRest() {
    // Set new interval
    // console.info(this.setPomodoroTimer);
    this.pomodoroDuration = this.currentTimeInSeconds;
    console.log("startREST pomodoroDuration: ", this.pomodoroDuration);
    this.reduceTime();
    // document.body.style.backgroundImage =
    // "url('../../app/images/bg2.png') no-repeat";
    // document.body.style.backgroundSize = "cover";
    this.handleTimerBtn.setAttribute("disabled", "true");
    setTimeout(() => {
      clearInterval(this.interval);
      this.currentTimeInSeconds = this.pomodoroDuration;
      this.buttonText = "Start!";
      this.handleTimerBtn.dataset.btnstate = "Start!";
      this.handleTimerBtn.innerText = "Start!";
      this.handleTimerBtn.classList.remove("is-info");
      this.handleTimerBtn.classList.remove("is-success");
      this.handleTimerBtn.removeAttribute("disabled");

      this.timeDisplayBox.classList.remove("is-success");
      this.resting = false;

      console.info("ALERTWFIRST-rest: ", this._alertWFirst);
      if (this._alertWFirst) {
        if (this._alertW) this._alertW = false;
        // console.info("GOTOWORK");
        this.gotToWork();
      }
    }, this.restDuration * 1000);
  }
  timeDisplay() {
    const minutes = String(parseInt(this.currentTimeInSeconds / 60));
    const seconds = String(this.currentTimeInSeconds % 60);
    const paddedMinutes = ("0" + minutes).slice(-2);
    const paddedSeconds = ("0" + seconds).slice(-2);
    let _time = { min: paddedMinutes, sec: paddedSeconds };
    // return `${paddedMinutes}:${paddedSeconds}`;
    return _time;
  }
  takeABrake() {
    console.info("ALERT: ", this._alert);
    const NOTIFICATION_TITLE = "RELAX!";
    const NOTIFICATION_BODY = `Please take a Break 😴`;
    if (!this._alert) {
      new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY });
      this._alert = true;
    }
    console.info("ALERT-after: ", this._alert);
  }
  gotToWork() {
    console.log("NOTIFY");
    console.log("alertW ", this._alertW);
    const NOTIFICATION_TITLE = `WORK! ROUND-${this.currentSegment}`;
    const NOTIFICATION_BODY = `Keep working!`;
    if (!this._alertW) {
      new Notification(NOTIFICATION_TITLE, {
        body: NOTIFICATION_BODY,
      }).onclick = () => {
        this.animateBar();
        this.buttonText = "Pause";
        this.handleTimerBtn.dataset.btnstate = "Pause";
        this.handleTimerBtn.innerText = "Pause";
        this.handleTimerBtn.classList.remove("is-success");

        this.handleTimerBtn.classList.add("is-info");
        this.timeDisplayBox.classList.add("is-dark");
        // if (this._alertW) this._alertW = false;
      };
      this._alertW = true;
    }
    console.log("alertW-after ", this._alertW);
  }
  goHome() {
    const NOTIFICATION_TITLE = "GO HOME!";
    const NOTIFICATION_BODY = "YOU DID A GREAT JOB!";
    // if (!this._alertG) {
    new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY });
    // this._alertG = true;
    // }
  }
}
