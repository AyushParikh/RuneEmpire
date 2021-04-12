import React from "react";
import roulette from "../../Images/wheel.png";
/** @jsx jsx */
import { css, keyframes, jsx } from "@emotion/core";
import rouletteSound from "../../Sounds/rouletteSound.wav";

import "../../Style/RouletteGame.css";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  withStyles,
  Slider,
} from "@material-ui/core";
import { rouletteOdds, rouletteNumbers } from "../../Components/Constants";
import Millify from "millify";
import Axios from "axios";
import FairnessPopup from "../../Components/Fairness";
import zIndex from "@material-ui/core/styles/zIndex";
import sound from "../../Components/Sound";
import ScoreTable from "../../Components/ScoreTable";
import winNoise from "../../Sounds/beepSound.wav";
import loseNoise from "../../Sounds/LoseSoundDice.wav";

function createAnimation(degrees) {
  const spin = keyframes`
    from{
      transform: rotate(0);
    }
    to{
      transform: rotate(${degrees}deg)
    }
  `;
  return spin;
}

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
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

export default class RouletteGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animate: false,
      animation: "",
      noAnimation: "",
      spin: "",
      bets: rouletteOdds,
      bet: 5000,
      fullBet: 0,
      rouletteNumbers: rouletteNumbers,
      outcome: null,
      topRow: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
      middleRow: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
      bottomRow: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
      red: [3, 9, 12, 18, 21, 27, 30, 36, 5, 14, 23, 32, 1, 7, 16, 19, 25, 34],
      black: [
        6,
        15,
        24,
        33,
        2,
        8,
        11,
        17,
        20,
        26,
        29,
        35,
        4,
        10,
        13,
        22,
        28,
        31,
      ],
      playing: false,
      clientSeed: window.localStorage.getItem("client") || "",
      nonce: 0,
      previousScores: [],
      volume: 1,
    };

    this.endGame = this.endGame.bind(this);
    this.renderCoins = this.renderCoins.bind(this);
    this.playGame = this.playGame.bind(this);
    this.clearBets = this.clearBets.bind(this);
  }

  formatBet(bet) {
    var finalString = bet.toString().toLowerCase();
    finalString = finalString.replace("t", "000000000000");
    finalString = finalString.replace("b", "000000000");
    finalString = finalString.replace("m", "000000");
    finalString = finalString.replace("k", "000");
    return finalString;
  }

  componentDidMount() {
    const spin = createAnimation(-360);
    this.setState({ spin });
    this.randomiseServerSeed();
  }

  hoverColor(tiles, hoverColor) {
    const numbers = document.getElementsByClassName(tiles);
    for (let i = 0; i < numbers.length; i++) {
      const element = numbers[i];
      element.style.backgroundColor = hoverColor;
    }
  }

  addBet(odds, number, color) {
    if (!isNaN(parseFloat(this.formatBet(this.state.bet)))) {
      if (
        this.props.bank -
          (parseFloat(this.state.fullBet) +
            parseFloat(this.formatBet(this.state.bet))) >
        0
      ) {
        const currentBets = this.state.bets;

        currentBets[number].push({ odds, color, bet: this.state.bet });

        this.setState({
          bets: currentBets,
          fullBet:
            parseFloat(this.state.fullBet) +
            parseFloat(this.formatBet(this.state.bet)),
        });
      }
    }
  }

  async generateOutcome() {
    const provablyRes = await Axios.post(
      `${window.baseURL}/roulette/fairness/${window.localStorage.getItem(
        "token"
      )}`,
      {
        clientSeed: window.localStorage.getItem("client"),
        nonce: this.state.nonce,
        count: 1,
      }
    );
    this.setState({ nonce: this.state.nonce + 1 });
    const provablyData = provablyRes.data;
    const numberGen = provablyData.result;
    const spin2 = createAnimation(
      // 360 * 6 + 9.725 * Math.floor(Math.random() * 37)

      360 * 6 +
        require("../../Components/Constants").rouletteWheelDegrees * numberGen
    );

    const animation = css`
      width: inherit;
      height: inherit;
      position: relative;
      animation: ${spin2} 7s cubic-bezier(0, 0, 0.25, 1) forwards;
    `;

    const noAnimation = css`
      width: inherit;
      height: inherit;
      position: relative;
    `;

    this.setState({
      animation,
      noAnimation,
      outcome: this.state.rouletteNumbers[numberGen],
    });

    var mySound = new sound(rouletteSound);
    mySound.volume(this.state.volume);
    mySound.play();
    this.setState({ mySound });
  }

  quickBank(bets, pos) {
    const odds = parseInt(bets[pos][0].odds);
    const winnings =
      parseFloat(this.formatBet(this.state.bet)) *
        odds *
        (1 - this.props.houseEdge / 100) +
      parseFloat(this.formatBet(this.state.bet));
    this.props.setBank(winnings);
    const won = true;
    var winSound = new sound(winNoise);
    winSound.play();
    Axios.post(
      `${window.baseURL}/user/${window.localStorage.getItem("token")}`,
      {
        loss: true,
        wager: this.formatBet(this.state.fullBet),
        profit: parseFloat(this.formatBet(-this.state.fullBet)) + winnings,
      }
    );
    if (parseFloat(this.formatBet(this.state.bet)) > 50000000) {
      const { socket } = this.props;
      socket.emit(
        "50m",
        window.localStorage.getItem("token"),
        winnings,
        "Roulette"
      );
    }
    console.log(odds);
    this.addToDiceDB(parseFloat(winnings), odds);
    return won;
  }

  checkOdds(bets) {
    const result = this.state.outcome;
    if (parseFloat(this.state.fullBet) > 0) {
      var won = false;
      // Any number
      if (bets[this.state.outcome].length > 0) {
        won = this.quickBank(bets, this.state.outcome);
      }

      // Thirds odds
      if (result > 0 && result <= 12 && bets["1-12"].length > 0) {
        won = this.quickBank(bets, "1-12");
      } else if (result > 12 && result <= 24 && bets["13-24"].length > 0) {
        won = this.quickBank(bets, "13-24");
      } else if (result > 24 && result <= 36 && bets["25-36"].length > 0) {
        won = this.quickBank(bets, "25-36");
      }

      // Doubles odds
      if (result > 0 && result <= 18 && bets["1-18"].length > 0) {
        won = this.quickBank(bets, "1-18");
      } else if (result > 18 && result <= 36 && bets["19-36"].length > 0) {
        won = this.quickBank(bets, "19-36");
      }

      // Even/Odd
      if (result % 2 === 0 && bets["EVEN"].length > 0) {
        won = this.quickBank(bets, "EVEN");
      } else if (result % 2 !== 0 && bets["ODD"].length > 0) {
        won = this.quickBank(bets, "ODD");
      }

      //Red/Black
      if (
        (won =
          this.state.red.includes(this.state.outcome) && bets["RED"].length > 0)
      ) {
        won = this.quickBank(bets, "RED");
      } else if (
        this.state.black.includes(this.state.outcome) &&
        bets["BLACK"].length > 0
      ) {
        won = this.quickBank(bets, "BLACK");
      }

      // 2:1 Odds
      if (
        this.state.topRow.includes(this.state.outcome) &&
        bets["2-1-1"].length > 0
      ) {
        won = this.quickBank(bets, "2-1-1");
      } else if (
        this.state.middleRow.includes(this.state.outcome) &&
        bets["2-1-2"].length > 0
      ) {
        won = this.quickBank(bets, "2-1-2");
      } else if (
        this.state.bottomRow.includes(this.state.outcome) &&
        bets["2-1-3"].length > 0
      ) {
        won = this.quickBank(bets, "2-1-3");
      }

      console.log(won);
      if (!won) {
        var loseSound = new sound(loseNoise);
        loseSound.play();
        Axios.post(
          `${window.baseURL}/user/${window.localStorage.getItem("token")}`,
          {
            win: true,
            wager: this.formatBet(this.state.fullBet),
            profit: this.formatBet(-this.state.fullBet),
          }
        );
        this.addToDiceDB(
          parseFloat(-parseFloat(this.formatBet(this.state.bet))),
          0
        );
      }
    }

    this.props.getRows();
  }

  endGame() {
    const bets = this.state.bets;
    this.checkOdds(bets);
    this.state.mySound.remove();

    const keys = Object.keys(bets);
    for (let i = 0; i < keys.length; i++) {
      const element = keys[i];
      bets[element] = [];
    }

    this.setState({ bets: bets, playing: false, fullBet: 0 });
  }

  clearBets() {
    const bets = this.state.bets;
    const keys = Object.keys(bets);
    for (let i = 0; i < keys.length; i++) {
      const element = keys[i];
      bets[element] = [];
    }

    this.setState({ bets: bets, playing: false, fullBet: 0 });
  }

  renderCoins(number) {
    var totalBet = 0;
    for (let i = 0; i < this.state.bets[number].length; i++) {
      const element = this.state.bets[number][i];
      totalBet += parseFloat(this.formatBet(element.bet));
    }

    return this.state.bets[number].map((coin, i) => {
      return (
        i < 10 && (
          <div
            className="coin-roulette"
            style={{ top: `calc(2px - ${i / 2}px)`, color: "black" }}
          >
            {Millify(totalBet)}
          </div>
        )
      );
    });
  }

  async playGame() {
    const bet = parseFloat(this.formatBet(this.state.bet));
    if (this.props.bank > bet) {
      const betKeys = Object.keys(this.state.bets);
      var hasBet = false;
      for (let i = 0; i < betKeys.length; i++) {
        const element = betKeys[i];
        const bets = this.state.bets;
        if (bets[element].length > 0) {
          hasBet = true;
          break;
        }
      }
      if (hasBet) {
        this.props.setBank(-this.state.fullBet);
      }
      this.generateOutcome();
      await this.setState({ animate: false });
      setTimeout(() => {
        this.setState({ animate: true, playing: true });
      }, 100);
    }
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

  addToDiceDB = async (result, odds) => {
    var finalResult = this.formatBet(this.state.fullBet);
    if (parseFloat(finalResult) > 0) {
      fetch(
        `${window.baseURL}/dice/addScore/` +
          window.localStorage.getItem("token"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            game: "Roulette",
            wager: parseFloat(finalResult),
            multiplier: odds,
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

  render() {
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
        <div className="dice-page">
          <div className="dice-game-wrapper">
            <div className="side-bar">
              <div className="bet-amount">
                Bet amount:
                <div className="bet-amount-input">
                  <input
                    className="bet-input"
                    disabled={this.state.playing}
                    value={this.state.bet}
                    onChange={(e) => this.setState({ bet: e.target.value })}
                  />
                  <button className="bet-input-mult">0.5x</button>
                  <button className="bet-input-mult">2x</button>
                </div>
              </div>
              <div className="bet">
                <Button
                  className="bet-button"
                  style={{ backgroundColor: "#009900" }}
                  onClick={this.playGame}
                  disabled={this.state.playing}
                >
                  Bet
                </Button>
              </div>
            </div>
            <div className="dice-game">
              <div className="roulette-game">
                <div className="wheel">
                  <div
                    css={css`
                      animation: ${this.state.spin} 10s linear infinite;
                      background-image: url(${roulette});
                      background-repeat: no-repeat;
                      background-position: center;
                      background-size: 300px;
                      width: 100%;
                      height: 100%;
                    `}
                  >
                    <div
                      css={
                        this.state.animate
                          ? this.state.animation
                          : this.state.noAnimation
                      }
                      onAnimationEnd={this.endGame}
                    >
                      <div
                        css={css`
                          width: 15px;
                          height: 120px;
                          position: absolute;
                          left: 50%;
                          top: calc(50% - 50px);
                          transform: translate(-50%, -50%);
                        `}
                      >
                        <div
                          css={css`
                            width: 12px;
                            height: 12px;
                            background-color: white;
                            border-radius: 50%;
                            position: absolute;
                            left: 50%;
                            top: 0%;
                            transform: translate(-50%, -50%);
                          `}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bet-tiles">
                  <div className="zeros">
                    <button
                      disabled={this.state.playing}
                      className="zero"
                      onClick={() => this.addBet("35", "0", "none")}
                    >
                      0{this.renderCoins("0")}
                    </button>
                    <button
                      disabled={this.state.playing}
                      className="zero"
                      onClick={() => this.addBet("35", "00", "none")}
                    >
                      00{this.renderCoins("00")}
                    </button>
                  </div>
                  <div className="top-row">
                    <div className="numbers">
                      {this.state.topRow.map((number) => {
                        var cn = null;
                        if (this.state.red.includes(number)) {
                          cn = "number red";
                        } else {
                          cn = "number black";
                        }
                        return (
                          <button
                            disabled={this.state.playing}
                            className={cn}
                            onClick={() =>
                              this.addBet("35", number.toString(), "none")
                            }
                          >
                            {number}
                            {this.renderCoins(number)}
                          </button>
                        );
                      })}
                      <button
                        disabled={this.state.playing}
                        className="number two-one"
                        onClick={() => this.addBet("2", "2-1-1", "none")}
                      >
                        2:1
                        {this.renderCoins("2-1-1")}
                      </button>
                    </div>
                  </div>
                  <div className="middle-row">
                    <div className="numbers">
                      {this.state.middleRow.map((number) => {
                        var cn = null;
                        if (this.state.red.includes(number)) {
                          cn = "number red";
                        } else {
                          cn = "number black";
                        }
                        return (
                          <button
                            disabled={this.state.playing}
                            className={cn}
                            onClick={() =>
                              this.addBet("35", number.toString(), "none")
                            }
                          >
                            {number}
                            {this.renderCoins(number)}
                          </button>
                        );
                      })}
                      <button
                        disabled={this.state.playing}
                        className="number two-one"
                        onClick={() => this.addBet("2", "2-1-2", "none")}
                      >
                        2:1
                        {this.renderCoins("2-1-2")}
                      </button>
                    </div>
                  </div>
                  <div className="bottom-row">
                    <div className="numbers">
                      {this.state.bottomRow.map((number) => {
                        var cn = null;
                        if (this.state.red.includes(number)) {
                          cn = "number red";
                        } else {
                          cn = "number black";
                        }
                        return (
                          <button
                            disabled={this.state.playing}
                            className={cn}
                            onClick={() =>
                              this.addBet("35", number.toString(), "none")
                            }
                          >
                            {number}
                            {this.renderCoins(number)}
                          </button>
                        );
                      })}
                      <button
                        disabled={this.state.playing}
                        className="number two-one"
                        onClick={() => this.addBet("2", "2-1-3", "none")}
                      >
                        2:1
                        {this.renderCoins("2-1-3")}
                      </button>
                    </div>
                  </div>
                  {/* TODO get and filter by type to highlight i.e even/odd */}
                  <div className="thirds-odds">
                    <button
                      disabled={this.state.playing}
                      className="third"
                      onClick={() => this.addBet("2", "1-12", "none")}
                    >
                      1 to 12
                      {this.renderCoins("1-12")}
                    </button>
                    <button
                      disabled={this.state.playing}
                      className="third"
                      onClick={() => this.addBet("2", "13-24", "none")}
                    >
                      13 to 24
                      {this.renderCoins("13-24")}
                    </button>
                    <button
                      disabled={this.state.playing}
                      className="third"
                      onClick={() => this.addBet("2", "25-36", "none")}
                    >
                      25 to 36
                      {this.renderCoins("25-36")}
                    </button>
                  </div>
                  <div className="small-odds">
                    <button
                      disabled={this.state.playing}
                      className="small"
                      onClick={() => this.addBet("1", "1-18", "none")}
                    >
                      1 to 18
                      {this.renderCoins("1-18")}
                    </button>
                    <button
                      disabled={this.state.playing}
                      className="small"
                      onClick={() => this.addBet("1", "EVEN", "none")}
                    >
                      Even
                      {this.renderCoins("EVEN")}
                    </button>
                    <button
                      disabled={this.state.playing}
                      className="small red"
                      onMouseOver={() => this.hoverColor("red", "#fe4664")}
                      onMouseOut={() => this.hoverColor("red", null)}
                      onClick={() => this.addBet("1", "RED", "none")}
                    >
                      {this.renderCoins("RED")}
                    </button>
                    <button
                      disabled={this.state.playing}
                      className="small black"
                      onMouseOver={() => this.hoverColor("black", "#4e6777")}
                      onMouseOut={() => this.hoverColor("black", null)}
                      onClick={() => this.addBet("1", "BLACK", "none")}
                    >
                      {this.renderCoins("BLACK")}
                    </button>
                    <button
                      disabled={this.state.playing}
                      className="small"
                      onClick={() => this.addBet("1", "ODD", "none")}
                    >
                      Odd
                      {this.renderCoins("ODD")}
                    </button>
                    <button
                      disabled={this.state.playing}
                      className="small"
                      onClick={() => this.addBet("1", "19-36", "none")}
                    >
                      19 to 36
                      {this.renderCoins("19-36")}
                    </button>
                  </div>
                </div>
                <button
                  className="small clear"
                  onClick={this.clearBets}
                  disabled={this.state.playing}
                >
                  Clear Bets
                </button>
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
