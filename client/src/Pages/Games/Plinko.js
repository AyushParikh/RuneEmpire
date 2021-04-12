import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import ScoreBar from "../../Components/Plinko/PlinkoScoreBar";
import FairnessPopup from "../../Components/Fairness";
import makeSeed from "../../Components/CreateClientSeed";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/EditOutlined";
import millify from "millify";
import { Slider } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Prompt } from "react-router";

import "../../Style/Plinko.css";
import {
  Particle,
  run,
  remakePegs,
  getBalls,
} from "../../Components/Plinko/PlinkoGame";
import Axios from "axios";
import ScoreTable from "../../Components/ScoreTable";

const UPDATE_TABLE_INTERVAL = 5000;
let ballSizes = [15, 13, 11, 10, 9, 9, 9, 8, 8];

//for some unknown reason does not render any pegs if put in state. Will be worth looking at moving in futer though
let pegRows = 8;
let pegs = {
  pegs: [],
};

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

export default class Plinko extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      manual: true,
      bet: 5000,
      winnings: 0,
      risk: "low",
      row: 8,
      playing: true,
      maxParticles: false,
      houseEdge: null,
      scoreBarWidth: 54,
      scoreHit: null,
      scoreHitPos: null,
      plinkoPath: [],
      previousScores: [],
      nonce: 0,
      fairness: false,
      clientSeed: null,
      serverSeedHashed: "",
      noSeedChange: false,
      seedChange: false,
      gameID: 0,
      boxId: 0,
      rows: [],
      rowsToGet: 10,
      numBets: 0,
      currentBets: 0,
      volume: 1,
      betMil: true,
    };

    this.scoreRef = React.createRef();
    this.setEdge = this.setEdge.bind(this);
  }

  componentDidMount() {
    this.init();

    setTimeout(() => {
      this.setEdge();
      this.setState({ playing: false });
    }, 500);
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

  setEdge(interval) {
    const { socket } = this.props;
    socket.emit("getEdge");
    socket.on("gotEdge", (edge) => {
      if (!this.state.playing && getBalls() <= 0) {
        setTimeout(async () => {
          this.setRows();
          await this.setState({
            houseEdge: this.props.houseEdge / 100,
          });
          var houseEdge = 1 - this.state.houseEdge;
          remakePegs(pegRows, pegs, this.state.risk, houseEdge);
          clearInterval(interval);
        }, 0);
      }
    });
  }

  addToDiceDB = async (profit, multiplier) => {
    var finalString = this.formatBet(this.state.bet);
    if (parseFloat(finalString) > 0) {
      fetch(
        `${window.baseURL}/dice/addScore/` +
          window.localStorage.getItem("token"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            game: "Plinko",
            wager: parseFloat(finalString),
            multiplier: multiplier,
            //win or lose condition
            profit: profit,
            clientSeed: this.state.clientSeed,
            nonce: this.state.nonce - 1,
            serverHash: this.state.serverSeedHashed,
          }),
        }
      );
    }
  };

  async init() {
    await fetch(`${window.baseURL}/gameID`)
      .then((response) => response.json())
      .then((data) => this.setState({ gameID: data.id }));

    this.setState({
      tempClient: this.props.clientSeed,
      clientSeed: this.props.clientSeed,
    });
    this.randomiseServerSeed();
    this.handleWinAmount();

    pegRows = 8;
    this.setRows();
    run(pegRows, pegs, this.state.risk, this.getScore, 0);
    const { socket } = this.props;
    socket.emit("getEdgeMount");
    socket.on("gotEdgeMount", (edge) => {
      var houseEdge = 1 - edge / 100;
      remakePegs(pegRows, pegs, this.state.risk, houseEdge);
      this.setScoreBar();
    });
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

  /*--------------------------------------------------------*/

  handleRiskChange = async (event) => {
    await this.setState({ risk: event.target.value });
    var houseEdge = 1 - this.state.houseEdge;
    remakePegs(pegRows, pegs, this.state.risk, houseEdge);
    this.setScoreBar();
  };

  handleRowChange = (event) => {
    this.setState({ row: event.target.value });
    pegRows = event.target.value;
    this.setRows();
    var houseEdge = 1 - this.state.houseEdge;
    remakePegs(pegRows, pegs, this.state.risk, houseEdge);
    this.setScoreBar();
  };

  setScoreBar = () => {
    if (pegRows === 8) {
      this.setState({ scoreBarWidth: 54 });
    } else if (pegRows === 9 || pegRows === 10) {
      this.setState({ scoreBarWidth: 52 });
    } else if (pegRows === 11 || pegRows === 14) {
      this.setState({ scoreBarWidth: 51 });
    } else if (pegRows === 12 || pegRows === 16) {
      this.setState({ scoreBarWidth: 50 });
    } else if (pegRows === 13 || pegRows === 15) {
      this.setState({ scoreBarWidth: 48 });
    } else {
      alert("Error please refresh!");
    }
  };

  /*--------------------------------------------------------*/

  getScore = (score, posX) => {
    this.setState({
      scoreHit: score,
      scoreHitPos: posX / 2,
      gameID: this.state.gameID + 1,
    });
    this.scoreRef.current.startAnimation();
    var finalString = this.formatBet(this.state.bet);
    this.props.setBank(parseFloat(finalString) * score);
    const winnings =
      parseFloat(finalString) * score - this.formatBet(this.state.bet);
    Axios.post(
      `${window.baseURL}/user/${window.localStorage.getItem("token")}`,
      {
        win: true,
        wager: this.formatBet(this.state.bet),
        profit: winnings,
      }
    );
    if (parseFloat(this.formatBet(this.state.bet)) > 50000000 && winnings > 0) {
      const { socket } = this.props;
      socket.emit(
        "50m",
        window.localStorage.getItem("token"),
        winnings,
        "Plinko"
      );
    }
    this.props.getRows();
    this.props.updateTable();
    this.addToDiceDB(parseFloat(finalString) * score, score);

    var prevScores = this.state.previousScores;
    var newScore = {
      score: score,
      visableSeed: false,
    };
    prevScores.push(newScore);
    this.setState({ previousScores: prevScores });

    if (!this.state.manual) this.handleResultAuto();
    else this.outOfPlay();
  };

  formatBet(bet) {
    var finalString = bet.toString().toLowerCase();
    finalString = finalString.replace("t", "000000000000");
    finalString = finalString.replace("b", "000000000");
    finalString = finalString.replace("m", "000000");
    finalString = finalString.replace("k", "000");
    return finalString;
  }

  outOfPlay = () => {
    this.setState({ playing: false });
  };

  setRows = () => {
    var result = {
      pegs: [],
    };
    for (var i = 0; i < pegRows; i++) {
      var tempPegs = [];
      for (var j = 0; j < i + 3; j++) {
        tempPegs.push(j + 1);
      }
      result.pegs.push(tempPegs);
    }
    pegs = result;
  };

  setType = () => {
    this.setState({ manual: !this.state.manual });
  };

  handleBet = async (e) => {
    var finalString = e.target.value;

    if (parseFloat(finalString) > 999999999999999) {
      return;
    }

    await this.setState({
      bet: finalString,
    });
    this.handleWinAmount();
  };

  handleWinAmount = (e) => {
    this.setState({ winnings: 0 });
  };

  handleResultAuto = () => {
    if (this.state.currentBets < this.state.numBets) {
      this.handleResult();

      this.setState({ currentBets: this.state.currentBets + 1 });
    } else {
      this.setState({ currentBets: 0, playing: false });
      clearInterval(this.state.autoInterval);
    }
  };

  handleResult = async () => {
    var finalString = this.formatBet(this.state.bet);
    if (parseFloat(finalString) > 999999999999999) {
      return;
    }
    if (this.props.bank >= parseFloat(finalString)) {
      this.setState({ playing: true });

      await fetch(
        `${window.baseURL}/dice/getResult/` +
          window.localStorage.getItem("token"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientSeed: this.state.clientSeed,
            nonce: this.state.nonce,
            count: pegRows,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => this.setState({ plinkoPath: data }));

      if (this.state.plinkoPath[0] > 0.5) {
        var nudge = 5;
      } else {
        var nudge = -5;
      }

      new Particle(
        405 + nudge,
        0,
        ballSizes[pegRows - 8],
        pegRows,
        this.handleMaxParticles,
        this.handleUnsetMaxParticles,
        this.state.plinkoPath
      );

      if (!this.state.maxParticles) {
        this.setState({ nonce: this.state.nonce + 1 });
        this.props.setBank(parseFloat(-finalString));
      }
    } else {
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
    }
  };

  handleMaxParticles = () => {
    this.setState({ maxParticles: true });
  };

  handleUnsetMaxParticles = () => {
    this.setState({ maxParticles: false });
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
        <div className="plinko-page" style={{ width: this.props.pageWidth }}>
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
                  disabled={this.state.playing}
                  id="manual"
                  style={{
                    backgroundColor:
                      this.state.manual && "var(--very-dark-back)",
                  }}
                  onClick={this.setType}
                >
                  Manual
                </Button>
                <Button
                  disabled={this.state.playing}
                  id="auto"
                  style={{
                    backgroundColor:
                      !this.state.manual && "var(--very-dark-back)",
                  }}
                  onClick={this.setType}
                >
                  Auto
                </Button>
              </div>
              <div className="manual-side">
                <div className="bet-amount">
                  Bet amount:
                  <div className="bet-amount-input">
                    <input
                      disabled={this.state.playing}
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
                <div className="risk">
                  <InputLabel id="risk-header">Risk:</InputLabel>
                  <Select
                    disabled={this.state.playing}
                    id="risk-dropdown"
                    value={this.state.risk}
                    onChange={this.handleRiskChange}
                  >
                    <MenuItem value={"low"} id="risk-low">
                      Low
                    </MenuItem>
                    <MenuItem value={"medium"} id="risk-medium">
                      Medium
                    </MenuItem>
                    <MenuItem value={"high"} id="risk-high">
                      High
                    </MenuItem>
                  </Select>
                </div>
                <div className="rows">
                  <InputLabel id="rows-header">Rows:</InputLabel>
                  <Select
                    disabled={this.state.playing}
                    id="rows-dropdown"
                    value={this.state.row}
                    onChange={this.handleRowChange}
                  >
                    <MenuItem value={8} id="row-8">
                      8
                    </MenuItem>
                    <MenuItem value={9} id="row-9">
                      9
                    </MenuItem>
                    <MenuItem value={10} id="row-10">
                      10
                    </MenuItem>
                    <MenuItem value={11} id="row-11">
                      11
                    </MenuItem>
                    <MenuItem value={12} id="row-12">
                      12
                    </MenuItem>
                    <MenuItem value={13} id="row-13">
                      13
                    </MenuItem>
                    <MenuItem value={14} id="row-14">
                      14
                    </MenuItem>
                    <MenuItem value={15} id="row-15">
                      15
                    </MenuItem>
                    <MenuItem value={16} id="row-16">
                      16
                    </MenuItem>
                  </Select>
                </div>
                {!this.state.manual && (
                  <div className="win-amount">
                    Number of Bets:
                    <input
                      disabled={this.state.playing}
                      type="number"
                      style={{
                        border: "solid 3px var(--very-dark-back)",
                      }}
                      className="win-amount-text"
                      value={this.state.numBets}
                      onChange={(e) =>
                        this.setState({ numBets: e.target.value })
                      }
                    />
                  </div>
                )}
                <div className="bet">
                  <Button
                    disabled={this.state.playing}
                    className="bet-button"
                    style={{ backgroundColor: "#009900" }}
                    onClick={
                      this.state.manual
                        ? this.handleResult
                        : this.handleResultAuto
                    }
                  >
                    Bet
                  </Button>
                </div>
              </div>
            </div>
            <div className="plinko-game-wrapper">
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
              <div className="plinko-game"></div>
              <div
                className="plinko-footer"
                style={{ width: this.state.scoreBarWidth + "%" }}
              >
                <ScoreBar
                  ref={this.scoreRef}
                  rows={pegRows}
                  bet={this.state.bet}
                  score={this.state.scoreHit}
                  posX={this.state.scoreHitPos}
                  volume={this.state.volume}
                  houseEdge={this.state.houseEdge}
                />
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
