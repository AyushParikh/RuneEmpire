import React from "react";

import "../../Style/Dice.css";
import { Slider } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import sound from "../../Components/Sound";
import clickSrc from "../../Sounds/clickSound.wav";
import winSrc from "../../Sounds/WinSoundDice.wav";
import loseSrc from "../../Sounds/LoseSoundDice.wav";
import FairnessPopup from "../../Components/Fairness";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/EditOutlined";
import Button from "@material-ui/core/Button";
import millify from "millify";
import { swal } from "sweetalert2/dist/sweetalert2";
import { Prompt } from "react-router";
import Axios from "axios";
import DiceSlider from "../../Components/Dice/Slider";
import ScoreTable from "../../Components/ScoreTable";

const MAX_SLIDER_VALUE = 99.8;
const MIN_SLIDER_VALUE = 10;
const UPDATE_TABLE_INTERVAL = 5000;

const VolumeSlider = withStyles({
  root: {
    color: "#52af77",
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
    color: "green",
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

export default class Dice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      manual: true,
      slider: MIN_SLIDER_VALUE,
      mult: null,
      bet: 5000,
      winnings: 0,
      resultVal: null,
      showResult: false,
      clickable: true,
      fairness: false,
      clientSeed: null,
      serverSeedHashed: "",
      nonce: 0,
      noSeedChange: false,
      seedChange: false,
      previousScores: [],
      gameID: 0,
      boxId: 0,
      rows: [],
      rowsToGet: 10,
      houseEdge: null,
      numBets: 0,
      profitStop: 0,
      lossStop: 0,
      onWinReset: false,
      onLoseReset: false,
      currentBet: 0,
      currentProfit: 0,
      currentLoss: 0,
      onWinIncrease: 0,
      onLoseIncrease: 0,
      volume: 1,
      betMil: true,
      color: "default",
    };

    this.handleResult = this.handleResult.bind(this);
    this.diceRef = React.createRef();
    this.flipSlider = this.flipSlider.bind(this);
  }

  handleSlider = (e, value) => {
    if (
      (this.state.color === "default" && value > MAX_SLIDER_VALUE) ||
      (this.state.color !== "default" && value > 90)
    ) {
      if (this.state.color === "default") {
        value = MAX_SLIDER_VALUE;
      } else {
        value = 90;
      }
    } else if (
      (this.state.color === "default" && value < MIN_SLIDER_VALUE) ||
      (this.state.color !== "default" && value < 0.2)
    ) {
      if (this.state.color === "default") {
        value = MIN_SLIDER_VALUE;
      } else {
        value = 0.2;
      }
    }
    this.setState({ slider: value });
  };

  handleBet = async (e) => {
    var finalString = e.target.value;

    if (parseFloat(finalString) > 999999999999999) {
      swal.fire({
        title: "Value Too Large",
        text: "Please enter a valid amount",
        icon: "error",
        background: "var(--background)",
        confirmButtonText: "Okay",
      });
      return;
    }
    await this.setState({
      bet: finalString,
    });
    this.handleWinAmount();
  };

  logVal = () => {
    var result;
    var minpos;
    var maxpos;
    var minlval;
    var maxlval;
    var scale;

    if (
      (this.state.color === "default" && this.state.slider < 50) ||
      (this.state.color !== "default" && this.state.slider > 50)
    ) {
      minpos = 10;
      maxpos = 50;
      minlval = Math.log(1.01);
      maxlval = Math.log(2);

      scale = (maxlval - minlval) / (maxpos - minpos);

      result = Math.exp(
        ((this.state.color === "default"
          ? this.state.slider
          : Math.abs(this.state.slider - 100)) -
          minpos) *
          scale +
          minlval
      ).toFixed(2);
    } else if (
      (this.state.color === "default" && this.state.slider < 70) ||
      (this.state.color !== "default" && this.state.slider > 30)
    ) {
      minpos = 50;
      maxpos = 70;
      minlval = Math.log(2);
      maxlval = Math.log(3);

      scale = (maxlval - minlval) / (maxpos - minpos);

      result = Math.exp(
        ((this.state.color === "default"
          ? this.state.slider
          : Math.abs(this.state.slider - 100)) -
          minpos) *
          scale +
          minlval
      ).toFixed(2);
    } else if (
      (this.state.color === "default" && this.state.slider < 80) ||
      (this.state.color !== "default" && this.state.slider > 20)
    ) {
      minpos = 70;
      maxpos = 80;
      minlval = Math.log(3);
      maxlval = Math.log(5);

      scale = (maxlval - minlval) / (maxpos - minpos);

      result = Math.exp(
        ((this.state.color === "default"
          ? this.state.slider
          : Math.abs(this.state.slider - 100)) -
          minpos) *
          scale +
          minlval
      ).toFixed(2);
    } else if (
      (this.state.color === "default" && this.state.slider < 90) ||
      (this.state.color !== "default" && this.state.slider > 10)
    ) {
      minpos = 80;
      maxpos = 90;
      minlval = Math.log(5);
      maxlval = Math.log(10);

      scale = (maxlval - minlval) / (maxpos - minpos);

      result = Math.exp(
        ((this.state.color === "default"
          ? this.state.slider
          : Math.abs(this.state.slider - 100)) -
          minpos) *
          scale +
          minlval
      ).toFixed(2);
    } else if (
      (this.state.color === "default" && this.state.slider < 98) ||
      (this.state.color !== "default" && this.state.slider > 2)
    ) {
      minpos = 90;
      maxpos = 98;
      minlval = Math.log(10);
      maxlval = Math.log(45);

      scale = (maxlval - minlval) / (maxpos - minpos);
      result = Math.exp(
        ((this.state.color === "default"
          ? this.state.slider
          : Math.abs(this.state.slider - 100)) -
          minpos) *
          scale +
          minlval
      ).toFixed(2);
    } else if (
      (this.state.color === "default" && this.state.slider < 100) ||
      (this.state.color !== "default" && this.state.slider > 0)
    ) {
      minpos = 98;
      maxpos = 99.8;
      minlval = Math.log(45);
      maxlval = Math.log(500);

      scale = (maxlval - minlval) / (maxpos - minpos);
      result = Math.exp(
        ((this.state.color === "default"
          ? this.state.slider
          : Math.abs(this.state.slider - 100)) -
          minpos) *
          scale +
          minlval
      ).toFixed(2);
      console.log(result);
    }
    console.log(result);
    var finalResult = (result * (1 - this.state.houseEdge / 100)).toFixed(2);
    if (finalResult < 1.01) {
      finalResult = 1.01;
    }

    return finalResult;
  };

  handleWinAmount = (e) => {
    var betResult = this.formatBet(this.state.bet);
    var result =
      (parseFloat(betResult) * this.logVal()).toFixed(0) -
      parseFloat(betResult);
    if (result > 999999999999999) {
      return;
    }
    if (!isNaN(result)) {
      this.setState({
        winnings: result,
      });
    }
  };

  formatBet(bet) {
    var finalString = bet.toString().toLowerCase();
    finalString = finalString.replace("t", "000000000000");
    finalString = finalString.replace("b", "000000000");
    finalString = finalString.replace("m", "000000");
    finalString = finalString.replace("k", "000");
    return finalString;
  }

  flipSlider() {
    this.setState({
      color: this.state.color === "default" ? "red" : "default",
      slider: Math.abs(this.state.slider - 100),
    });
    this.forceUpdate();
  }

  handleResultAuto = async () => {
    var finalResult = this.formatBet(this.state.bet);
    if (
      (this.state.currentBet < this.state.numBets &&
        this.state.currentProfit <= this.state.profitStop &&
        this.state.currentLoss <= this.state.lossStop) ||
      (this.state.currentBet < this.state.numBets &&
        this.state.lossStop === 0 &&
        this.state.profitStop === 0)
    ) {
      this.setState({ clickable: false, mult: this.logVal() });
      if (this.props.bank < parseFloat(finalResult)) {
        this.setState({ clickable: true });
        window
          .fetch(
            `${window.baseURL}/checkValidUser/` +
              window.localStorage.getItem("token")
          )
          .then((response) => response.json())
          .then((data) => {
            if (data !== false) {
              this.setState({ poor: true });
            } else {
              window.location = "/login";
            }
          });
        return;
      }

      var result;

      await fetch(
        `${window.baseURL}/dice/getResult/` +
          window.localStorage.getItem("token"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientSeed: this.state.clientSeed,
            nonce: this.state.nonce,
            count: 1,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => (result = data));

      var resultPercent = result[0] * 100;
      this.setState({
        resultVal: resultPercent.toPrecision(4),
        showResult: true,
        nonce: this.state.nonce + 1,
      });

      var element = document.getElementById("result-asset");
      var elementColour = document.getElementsByClassName("result-value")[0];
      var elementText = document.getElementsByClassName(
        "results-value-text"
      )[0];
      var pos = 0;
      var mySound = new sound(clickSrc);
      mySound.volume(this.state.volume);
      mySound.play();
      this.frame(
        resultPercent,
        pos,
        elementColour,
        elementText,
        element,
        mySound
      );

      if (resultPercent > this.state.slider) {
        this.setState({
          bet:
            parseFloat(finalResult) +
            parseFloat(finalResult) *
              (parseFloat(this.state.onWinIncrease) / 100),
          currentProfit: this.state.currentProfit + this.state.winnings,
        });
      } else {
        this.setState({
          bet:
            parseFloat(finalResult) +
            parseFloat(finalResult) *
              (parseFloat(this.state.onLoseIncrease) / 100),
          currentLoss: this.state.currentLoss + parseFloat(finalResult),
        });
      }

      this.setState({ currentBet: this.state.currentBet + 1 });
      setTimeout(this.handleResultAuto, 2000);
    } else {
      this.resetAuto();
    }
  };
  resetAuto = () => {
    this.setState({
      currentBet: 0,
      currentProfit: 0,
      currentLoss: 0,
    });
  };

  handleResult = async () => {
    this.setState({ clickable: false, mult: this.logVal() });
    var finalResult = this.formatBet(this.state.bet);
    if (this.props.bank < parseFloat(finalResult)) {
      this.setState({ clickable: true });
      window
        .fetch(
          `${window.baseURL}/checkValidUser/` +
            window.localStorage.getItem("token")
        )
        .then((response) => response.json())
        .then((data) => {
          if (data !== false) {
            this.setState({ poor: true });
          } else {
            window.location = "/login";
          }
        });
      return;
    }

    var result;

    await fetch(
      `${window.baseURL}/dice/getResult/` +
        window.localStorage.getItem("token"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientSeed: this.state.clientSeed,
          nonce: this.state.nonce,
          count: 1,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => (result = data));

    var resultPercent = result[0] * 100;
    this.setState({
      resultVal: resultPercent.toPrecision(4),
      showResult: true,
      nonce: this.state.nonce + 1,
    });

    var element = document.getElementById("result-asset");
    var elementColour = document.getElementsByClassName("result-value")[0];
    var elementText = document.getElementsByClassName("results-value-text")[0];
    var pos = 0;
    var mySound = new sound(clickSrc);
    mySound.volume(this.state.volume);
    mySound.play();
    this.frame(
      resultPercent,
      pos,
      elementColour,
      elementText,
      element,
      mySound
    );
  };

  frame = async (result, pos, elementColour, elementText, element, mySound) => {
    if (pos >= result) {
      mySound.remove();
      if (
        (this.state.color === "default" && result >= this.state.slider) ||
        (this.state.color !== "default" && result <= this.state.slider)
      ) {
        var winSound = new sound(winSrc);
        winSound.volume(this.state.volume);
        winSound.play();

        elementColour.style.backgroundColor = "green";
        this.props.setBank(this.state.winnings);
        Axios.post(
          `${window.baseURL}/user/${window.localStorage.getItem("token")}`,
          {
            win: true,
            wager: this.formatBet(this.state.bet),
            profit: this.state.winnings,
          }
        );
        if (parseFloat(this.formatBet(this.state.bet)) > 50000000) {
          const { socket } = this.props;
          socket.emit(
            "50m",
            window.localStorage.getItem("token"),
            this.state.winnings,
            "Dice"
          );
        }
        this.addToDiceDB(this.state.winnings);
      } else {
        var loseSound = new sound(loseSrc);
        loseSound.volume(this.state.volume);
        loseSound.play();
        elementColour.style.backgroundColor = "red";
        var finalString = this.formatBet(this.state.bet);
        this.props.setBank(parseFloat(-finalString));
        Axios.post(
          `${window.baseURL}/user/${window.localStorage.getItem("token")}`,
          {
            loss: true,
            wager: this.formatBet(this.state.bet),
            profit: -this.state.bet,
          }
        );
        this.addToDiceDB(parseFloat(-finalString));
      }
      this.props.getRows();
      elementText.innerHTML = result.toFixed(2);

      var prevScores = this.state.previousScores;
      var newScore = {
        score: result,
        visableSeed: false,
      };
      prevScores.push(newScore);
      this.setState({ previousScores: prevScores });

      await fetch(`${window.baseURL}/gameID`)
        .then((response) => response.json())
        .then((data) => this.setState({ gameID: data.id }));
      setTimeout(() => {
        this.setState({ showResult: false, clickable: true });
      }, 750);
      //remove sound so user doesnt get pileup of html elements
      setTimeout(() => {
        if (winSound !== undefined) {
          winSound.remove();
        } else {
          loseSound.remove();
        }
      }, 1500);
    } else {
      pos += 2;
      elementText.innerHTML = pos.toFixed(1);
      element.style.marginLeft = pos + "%";
      if (
        (this.state.color === "default" && pos > this.state.slider) ||
        (this.state.color !== "default" && pos < this.state.slider)
      ) {
        elementColour.style.backgroundColor = "green";
      } else {
        elementColour.style.backgroundColor = "red";
      }
      requestAnimationFrame(() =>
        this.frame(result, pos, elementColour, elementText, element, mySound)
      );
    }
  };

  addToDiceDB = async (result) => {
    var finalResult = this.formatBet(this.state.bet);
    if (parseFloat(finalResult) > 0) {
      fetch(
        `${window.baseURL}/dice/addScore/` +
          window.localStorage.getItem("token"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            game: "Dice",
            wager: parseFloat(finalResult),
            multiplier: this.state.mult,
            //win or lose condition
            profit: result,
            clientSeed: this.state.clientSeed,
            nonce: this.state.nonce - 1,
            serverHash: this.state.serverSeedHashed,
          }),
        }
      );
      this.props.updateTable();
    }
  };

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({ houseEdge: this.props.houseEdge });
    }
  }

  componentWillUnmount() {
    var sounds = document.getElementsByTagName("audio");
    for (i = 0; i < sounds.length; i++) sounds[i].pause();

    window.cancelRequestAnimFrame = (function () {
      return (
        window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout
      );
    })();

    for (var i = 1; i < 99999; i++) {
      window.clearInterval(i);
      window.cancelRequestAnimFrame(i);
    }
  }

  async init() {
    await fetch(`${window.baseURL}/gameID`)
      .then((response) => response.json())
      .then((data) => this.setState({ gameID: data.id }));

    const { socket } = this.props;

    this.setState({
      tempClient: this.props.clientSeed,
      clientSeed: this.props.clientSeed,
    });
    this.randomiseServerSeed();
    this.handleWinAmount();
    this.setState({ houseEdge: this.props.houseEdge });
  }

  randomiseServerSeed = async () => {
    await fetch(
      `${window.baseURL}/newSeed/` + window.localStorage.getItem("token")
    );

    await fetch(
      `${window.baseURL}/seed/` + window.localStorage.getItem("token")
    )
      .then((response) => response.text())
      .then((data) => this.setState({ serverSeedHashed: data }));
  };

  changeSeed = () => {
    if (this.state.tempClient !== this.state.clientSeed) {
      this.props.setClient(this.state.tempClient);
      this.setState({
        clientSeed: this.state.tempClient,
        nonce: 0,
        seedChange: true,
      });
      window.localStorage.setItem("client", this.state.tempClient);
      this.randomiseServerSeed();
      this.showOldSeeds();
    } else {
      this.setState({ noSeedChange: true });
    }
  };

  showOldSeeds() {
    var oldSeeds = this.state.previousScores;
    for (var i = 0; i < oldSeeds.length; i++) {
      oldSeeds[i].visableSeed = true;
    }
    this.setState({ previousScores: oldSeeds });
  }

  fairnessResult = (score, i) => {
    if (score.visableSeed) {
      this.setState({
        fairness: true,
        fairnessButton: false,
        unhash: true,
        gameClicked: this.state.gameID - (4 - i),
        boxId: i,
      });
    } else {
      this.setState({
        fairness: true,
        fairnessButton: false,
        unhash: false,
        boxId: i,
      });
    }
  };

  render() {
    const classes = this.props;

    var prevScores;
    if (this.state.previousScores.length > 4) {
      prevScores = this.state.previousScores.slice(
        this.state.previousScores.length - 4,
        this.state.previousScores.length
      );
    } else {
      prevScores = this.state.previousScores;
    }
    return (
      <div>
        <div className="dice-page" style={{ width: this.props.pageWidth }}>
          <Prompt
            message={(location) => {
              return !this.state.playing
                ? true
                : "Are you sure you want to leave mid game? You may lose some money";
            }}
          />
          <div className="dice-game-wrapper">
            <div className="side-bar">
              <div className="type-of-play">
                <Button
                  id="manual"
                  style={{
                    backgroundColor:
                      this.state.manual && "var(--very-dark-back)",
                  }}
                  onClick={() => this.setState({ manual: true })}
                >
                  Manual
                </Button>
                <Button
                  id="auto"
                  style={{
                    backgroundColor:
                      !this.state.manual && "var(--very-dark-back)",
                  }}
                  onClick={() => this.setState({ manual: false })}
                >
                  Auto
                </Button>
              </div>
              <div className="manual-side">
                <div className="bet-amount">
                  Bet amount:
                  <div className="bet-amount-input">
                    <input
                      className="bet-input"
                      value={this.state.bet}
                      onChange={this.handleBet}
                    />
                    <button
                      className="bet-input-mult"
                      onClick={async () => {
                        var result = this.formatBet(this.state.bet);
                        result *= 0.5;
                        if (!isNaN(result)) {
                          await this.setState({
                            bet: millify(result, { precision: 0 }),
                          });
                        }
                        this.handleWinAmount();
                      }}
                    >
                      0.5x
                    </button>
                    <button
                      className="bet-input-mult"
                      onClick={async () => {
                        var result = this.formatBet(this.state.bet);
                        result *= 2;
                        if (result > 999999999999999) {
                          return;
                        }
                        if (!isNaN(result)) {
                          await this.setState({
                            bet: millify(result, { precision: 0 }),
                          });
                        }
                        this.handleWinAmount();
                      }}
                    >
                      2x
                    </button>
                  </div>
                </div>
                {this.state.manual ? (
                  <div>
                    <div className="win-amount stop-win">
                      Win Amount:
                      <div
                        className="win-amount-text"
                        style={{
                          border: "solid 3px var(--very-dark-back)",
                        }}
                      >
                        {millify(this.state.winnings)}
                      </div>
                    </div>
                    <div className="bet">
                      <Button
                        disabled={!this.state.clickable}
                        className="bet-button"
                        style={{ backgroundColor: "#009900" }}
                        onClick={this.handleResult}
                      >
                        Bet
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="win-amount num-bets">
                      Number of Bets:
                      <input
                        disabled={!this.state.clickable}
                        type="number"
                        style={{
                          border: "solid 3px var(--very-dark-back)",
                        }}
                        className="win-amount-text"
                        value={this.state.numBets}
                        onChange={(e) =>
                          this.setState({
                            numBets: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div style={{ margin: "10px 20px" }}>
                      On Win:
                      <div className="on-win">
                        <button
                          disabled={!this.state.clickable}
                          className="reset"
                          style={{
                            backgroundColor: this.state.onWinReset
                              ? "var(--vary-dark-back)"
                              : "var(--dark-background)",
                            borderRadius: "5px 0 0 5px",
                          }}
                          onClick={() => this.setState({ onWinReset: false })}
                        >
                          Reset
                        </button>
                        <button
                          disabled={!this.state.clickable}
                          className="increase-by"
                          style={{
                            backgroundColor: this.state.onWinReset
                              ? "var(--dark-background)"
                              : "var(--vary-dark-back)",
                            borderRadius: "0",
                          }}
                          onClick={() => this.setState({ onWinReset: true })}
                        >
                          Increase By
                        </button>
                        <input
                          disabled={
                            !this.state.onWinReset || !this.state.clickable
                          }
                          type="number"
                          className="increase-value"
                          value={this.state.onWinIncrease}
                          onChange={(e) =>
                            this.setState({
                              onWinIncrease: e.target.value,
                            })
                          }
                          placeholder="%"
                        />
                      </div>
                    </div>
                    <div style={{ margin: "10px 20px" }}>
                      On Loss:
                      <div className="on-win">
                        <button
                          disabled={!this.state.clickable}
                          className="reset"
                          style={{
                            backgroundColor: this.state.onLoseReset
                              ? "var(--vary-dark-back)"
                              : "var(--dark-background)",
                            borderRadius: "5px 0 0 5px",
                          }}
                          onClick={() => this.setState({ onLoseReset: false })}
                        >
                          Reset
                        </button>
                        <button
                          disabled={!this.state.clickable}
                          className="increase-by"
                          style={{
                            backgroundColor: this.state.onLoseReset
                              ? "var(--dark-background)"
                              : "var(--vary-dark-back)",
                            borderRadius: "0",
                          }}
                          onClick={() => this.setState({ onLoseReset: true })}
                        >
                          Increase By
                        </button>
                        <input
                          disabled={
                            !this.state.onLoseReset || !this.state.clickable
                          }
                          type="number"
                          className="increase-value"
                          value={this.state.onLoseIncrease}
                          onChange={(e) =>
                            this.setState({
                              onLoseIncrease: e.target.value,
                            })
                          }
                          placeholder="%"
                        />
                      </div>
                    </div>
                    <div className="win-amount  stop-win">
                      Stop on Profit:
                      <input
                        disabled={!this.state.clickable}
                        style={{
                          border: "solid 3px var(--very-dark-back)",
                        }}
                        className="win-amount-text"
                        value={millify(this.state.profitStop)}
                        onChange={(e) => {
                          var finalString = this.formatBet(e.target.value);
                          if (parseFloat(finalString) > 999999999999999) {
                            return;
                          }
                          if (
                            !isNaN(
                              parseFloat(finalString[finalString.length - 1])
                            ) ||
                            finalString.length < 1
                          ) {
                            this.setState({
                              profitStop: finalString,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="win-amount stop-loss">
                      Stop on Loss:
                      <input
                        disabled={!this.state.clickable}
                        style={{
                          border: "solid 3px var(--very-dark-back)",
                        }}
                        className="win-amount-text"
                        value={millify(this.state.lossStop)}
                        onChange={(e) => {
                          var finalString = this.formatBet(e.target.value);
                          if (parseFloat(finalString) > 999999999999999) {
                            return;
                          }
                          if (
                            !isNaN(
                              parseFloat(finalString[finalString.length - 1])
                            ) ||
                            finalString.length < 1
                          ) {
                            this.setState({
                              lossStop: finalString,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="bet">
                      <Button
                        disabled={!this.state.clickable}
                        className="bet-button"
                        style={{ backgroundColor: "#009900" }}
                        onClick={this.handleResultAuto}
                      >
                        Bet
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="dice-game">
              <div className="prev-scores">
                {prevScores.map((score, i) => (
                  <span
                    className="prev-score-value"
                    style={{
                      backgroundColor: "var(--very-dark-back)",
                    }}
                    onClick={() => this.fairnessResult(score, i)}
                  >
                    {score.score.toFixed(2)}
                  </span>
                ))}
              </div>
              <div className={classes.root}>
                <div className="slider">
                  <div className="animation-asset">
                    <div
                      id="result-asset"
                      style={{
                        display: this.state.showResult ? "block" : "none",
                      }}
                    >
                      <div className="result-value">
                        <div className="results-value-text"></div>
                      </div>
                    </div>
                  </div>
                  <div className={classes.margin} />
                  <DiceSlider
                    valueLabelDisplay="on"
                    aria-label="pretto slider"
                    defaultValue={20}
                    min={0}
                    max={100}
                    value={this.state.slider.toFixed(1)}
                    onChange={this.state.clickable && this.handleSlider}
                    onChangeCommitted={this.handleWinAmount}
                    color={this.state.color}
                  />
                  <div className={classes.margin} />
                </div>
              </div>
              <div className="dice-footer-wrapper">
                <div className="dice-footer">
                  <div className="multiplier">
                    <div className="mult-text">Win Multiplier:</div>
                    <input
                      className="mult-value"
                      value={this.logVal()}
                      onChange={this.logVal}
                    />
                  </div>
                  <div className="roll-over">
                    <div className="roll-text">
                      {this.state.color === "default"
                        ? "Roll Over:"
                        : "Roll Under"}
                    </div>
                    <div
                      className="roll-value"
                      onClick={this.flipSlider}
                      style={{ cursor: "pointer" }}
                    >
                      {this.state.slider.toFixed(1)}
                    </div>
                  </div>
                  {/* TODO make multiplier and win chance change slider pos on text change */}
                  <div className="win-chance">
                    <div className="win-text">Win Chance:</div>
                    <input
                      className="win-value"
                      value={(100 - this.state.slider).toFixed(2)}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="fair-buttons">
              <button
                onClick={() => {
                  this.setState({
                    fairness: true,
                    tempClient: this.state.clientSeed,
                    fairnessButton: true,
                    boxId: this.state.previousScores.length,
                  });
                }}
                className="fair"
              >
                Seeds
              </button>
              <div className="volume-slider-wrapper">
                <div style={{ marginTop: "4px" }}>Volume:</div>
                <VolumeSlider
                  className="volume-slider"
                  valueLabelDisplay="auto"
                  aria-label="pretto slider"
                  defaultValue={100}
                  value={(this.state.volume * 100).toFixed(0)}
                  onChange={(e, value) =>
                    this.setState({ volume: value / 100 })
                  }
                />
              </div>
            </div>
          </div>
          {this.state.fairness && (
            <FairnessPopup
              tempClient={this.state.tempClient}
              serverSeed={this.state.serverSeedHashed}
              nonce={this.state.nonce}
              changeTemp={(e) => this.setState({ tempClient: e })}
              submit={this.changeSeed}
              showButton={this.state.fairnessButton}
              unhash={this.state.unhash}
              gameID={this.state.gameID}
              boxId={this.state.boxId}
              boxIdLength={prevScores.length}
              close={() => this.setState({ fairness: false })}
            />
          )}
          <div>
            <Dialog
              open={this.state.noSeedChange}
              style={{ zIndex: 200000 }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle
                id="alert-dialog-title"
                style={{ backgroundColor: "#927e61" }}
              >
                {"Please Change Client Seed to Submit"}
              </DialogTitle>
              <DialogActions style={{ backgroundColor: "#927e61" }}>
                <Button
                  onClick={() => this.setState({ noSeedChange: false })}
                  color="primary"
                  autoFocus
                >
                  Okay
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          <div>
            <Dialog
              open={this.state.seedChange}
              style={{ zIndex: 200000 }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle
                id="alert-dialog-title"
                style={{ backgroundColor: "#927e61" }}
              >
                {"Seed Pair Updated"}
              </DialogTitle>
              <DialogActions style={{ backgroundColor: "#927e61" }}>
                <Button
                  onClick={() =>
                    this.setState({
                      fairness: false,
                      seedChange: false,
                    })
                  }
                  color="primary"
                  autoFocus
                >
                  Okay
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          <div>
            <Dialog
              open={this.state.poor}
              style={{ zIndex: 200000 }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle
                id="alert-dialog-title"
                style={{ backgroundColor: "#927e61" }}
              >
                {"Please Deposit Funds"}
              </DialogTitle>
              <DialogActions style={{ backgroundColor: "#927e61" }}>
                <Button
                  onClick={() => this.setState({ poor: false })}
                  color="primary"
                  autoFocus
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ poor: false });
                    this.props.deposit();
                  }}
                  color="primary"
                  autoFocus
                >
                  Go To Bank
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
        <ScoreTable
          rows={this.props.rows}
          getNewRows={this.props.getNewRows}
          validuser={this.props.validuser}
        />
      </div>
    );
  }
}
