import "./App.css";
import React from "react";
import { UilArrowUp } from "@iconscout/react-unicons";
import { UilArrowDown } from "@iconscout/react-unicons";
import { UilPlay } from "@iconscout/react-unicons";
import { UilPause } from "@iconscout/react-unicons";
import { UilRepeat } from "@iconscout/react-unicons";

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessLength: 25,
      timer: 1500,
      session: "Session",
      mode: "inactive",
    };
    this.increaseBreak = this.increaseBreak.bind(this);
    this.decreaseBreak = this.decreaseBreak.bind(this);
    this.increaseSession = this.increaseSession.bind(this);
    this.decreaseSession = this.decreaseSession.bind(this);
    this.timeConverter = this.timeConverter.bind(this);
    this.reset = this.reset.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.decreaseTimer = this.decreaseTimer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    this.timerControl = this.timerControl.bind(this);
    this.buzzer = this.buzzer.bind(this);
  }

  increaseBreak() {
    let value = this.state.breakLength;
    if (value === 60) {
      return value;
    }
    this.setState({
      breakLength: value + 1,
    });
  }

  decreaseBreak() {
    let value = this.state.breakLength;
    if (value === 1) {
      return value;
    }
    this.setState({
      breakLength: value - 1,
    });
  }

  increaseSession() {
    let value = this.state.sessLength;
    if (value === 60) {
      return value;
    }
    this.setState({
      sessLength: value + 1,
      timer: this.state.timer + 60,
    });
  }

  decreaseSession() {
    let value = this.state.sessLength;
    if (value === 1) {
      return value;
    }
    this.setState({
      sessLength: value - 1,
      timer: this.state.timer - 60,
    });
  }

  reset() {
    this.setState({
      breakLength: 5,
      sessLength: 25,
      timer: 1500,
      session: "Session",
      mode: "inactive",
    });
    clearInterval(this.begin);
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }

  timeConverter(number) {
    let minutes = Math.floor(number / 60);
    let seconds = number - minutes * 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return minutes + ":" + seconds;
  }

  startTimer() {
    if (this.state.mode === "inactive") {
      this.setState({
        mode: "active",
      });
      this.begin = setInterval(() => {
        this.decreaseTimer();
        this.timerControl();
      }, 1000);
    } else {
      return;
    }
  }

  decreaseTimer() {
    this.setState({
      timer: this.state.timer - 1,
    });
  }

  timerControl() {
    if ((this.state.timer == 0) & (this.state.session === "Session")) {
      this.setState({
        session: "Break",
        timer: this.state.breakLength * 60,
      });
      this.buzzer();
    }
    if ((this.state.timer == 0) & (this.state.session === "Break")) {
      this.setState({
        session: "Session",
        timer: this.state.sessLength * 60,
      });
      this.buzzer();
    }
  }

  buzzer() {
    if (this.state.timer == 0) {
      this.audioBeep.play();
    }
  }

  pauseTimer() {
    if (this.state.mode === "active") {
      this.setState({
        mode: "inactive",
      });
      clearInterval(this.begin);
    }
  }

  render() {
    return (
      <div className="pomodoro">
        <h1>Pomodoro Technique</h1>
        <SessionControls
          increaseBreak={this.increaseBreak}
          decreaseBreak={this.decreaseBreak}
          breakLength={this.state.breakLength}
          increaseSession={this.increaseSession}
          decreaseSession={this.decreaseSession}
          sessLength={this.state.sessLength}
        />
        <div className="timer">
          <div id="timer-label" className="label">
            <h2>{this.state.session}</h2>
          </div>
          <div id="time-left" className="numbers">
            {this.timeConverter(this.state.timer)}
          </div>
          <TimerControls
            reset={this.reset}
            startTimer={this.startTimer}
            pauseTimer={this.pauseTimer}
          />
        </div>
        <audio
          id="beep"
          preload="auto"
          ref={(audio) => {
            this.audioBeep = audio;
          }}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    );
  }
}

class SessionControls extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="top-controls">
        <div className="break controls">
          <div id="break-label" className="label">
            <h2> Break Length </h2>
          </div>
          <div className="scontrols">
            <button
              onClick={this.props.increaseBreak}
              className="session-btns"
              id="break-increment"
            >
              <span className="arrows">
                <UilArrowUp />
              </span>
            </button>
            <p id="break-length" className="numbers">
              {this.props.breakLength}
            </p>
            <button
              onClick={this.props.decreaseBreak}
              className="session-btns"
              id="break-decrement"
            >
              <span className="arrows">
                <UilArrowDown />
              </span>
            </button>
          </div>
        </div>
        <div className="session controls">
          <div id="session-label" className="label">
            <h2> Session Length</h2>
          </div>
          <div className="scontrols">
            <button
              onClick={this.props.increaseSession}
              className="session-btns"
              id="session-increment"
            >
              <span className="arrows">
                <UilArrowUp />
              </span>
            </button>
            <p id="session-length" className="numbers">
              {this.props.sessLength}
            </p>
            <button
              onClick={this.props.decreaseSession}
              className="session-controls"
              id="session-decrement"
            >
              <span className="arrows">
                <UilArrowDown />
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class TimerControls extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="timer-controls">
        <div id="start_stop">
          <div className="timer-btns">
            <button onClick={this.props.startTimer}>
              <UilPlay />
            </button>
            <button onClick={this.props.pauseTimer}>
              <UilPause />
            </button>
          </div>
        </div>
        <div id="reset-btn">
          <button id="reset" onClick={this.props.reset}>
            <UilRepeat />
          </button>
        </div>
      </div>
    );
  }
}
export default Timer;
