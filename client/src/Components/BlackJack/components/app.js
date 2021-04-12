import React, { Component, PropTypes } from "react";
import Info from "./info";
import Hand from "./hand";
import Controls from "./controls";
import { calculateWinPercentage } from "../game";
import swal from "sweetalert2";
import millify from "millify";
import FairnessPopup from "../../Fairness";
import { Slider, withStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Axios from "axios";
import BlackjackSound from "../../../Sounds/blackjackSound.wav";
import sound from "../../Sound";
import winNoise from "../../../Sounds/beepSound.wav";
import loseNoise from "../../../Sounds/LoseSoundDice.wav";

const RESET_ROUND_TIME = 3000;

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

/**
 * Entry point for the view layer of the app
 *
 * Renders:
 * Info component
 * Hand (dealer) component
 * Hand (player) component
 * Control component (buttons)
 *
 * @return {ReactElement} markup
 */
class App extends Component {
  /**
   * Constructor
   *
   * @param      {object}    props                Component properties
   * @param      {object}    props.deck           Deck instance
   * @param      {object}    props.playerHand     Hand instance
   * @param      {object}    props.dealerHand     Hand instance
   * @param      {function}  props.getWinner      Decides the winner
   * @param      {function}  props.dealerDrawing  Dealer's AI
   *
   */
  constructor(props) {
    super(props);

    /**
     * @type {object}
     * @property {Integer} winCount
     * @property {Integer} roundCount
     * @property {Bool} inProgress
     * @property {Array} playerHand
     * @property {Array} dealerHand
     * @property {Bool|String} winPercentage
     * @property {Bool} isWin
     */
    this.state = {
      winCount: 0,
      roundCount: 0,
      inProgress: false,
      playerHand: [],
      playerSplit: [],
      dealerHand: [],
      winPercentage: false,
      isWin: undefined,
      bet: 5000,
      split: false,
      isSplit: false,
      activeHand: 1,
      clientSeed: null,
      tempClient: null,
      nonce: 0,
      previousScores: [],
      serverSeedHashed: null,
      volume: 1,
    };
  }

  componentDidMount() {
    const { clientSeed } = this.props;
    this.setState({
      clientSeed: clientSeed,
      tempClient: clientSeed,
    });

    this.randomiseServerSeed();
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      const { clientSeed } = this.props;
      this.setState({
        clientSeed: clientSeed,
        tempClient: clientSeed,
      });
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

  /**
   * Handle deal new cards event (new round).
   * Deals cards to player and dealer.
   * Sets application state to update the app view.
   */
  async onDeal() {
    let { deck, playerHand, dealerHand } = this.props;
    const { roundCount, nonce, clientSeed } = this.state;

    await deck.start(clientSeed, nonce);
    const bet = parseFloat(this.formatBet(this.state.bet));
    this.props.setBank(-bet);

    // clear timeout in case the
    // deal button is pressed before
    // the game was reset
    this.clearTimeout();
    this.resetRound();

    // deal cards
    playerHand.draw(deck.deal());

    playerHand.draw(deck.deal());

    dealerHand.draw(deck.deal());

    dealerHand.draw(deck.deal());
    var mySound = new sound(BlackjackSound);
    mySound.volume(this.state.volume);
    mySound.play();
    // second card to dealer
    // remains in the hand instance
    // but not in the view until
    // the player stands

    const insuranceCard = dealerHand.cards[0].rank;

    const blackjackCards = ["A"];

    if (blackjackCards.includes(insuranceCard)) {
      this.setState({ showInsurance: true });
    }

    // set state to update the view
    this.setState(
      (prevState, props) => ({
        playerHand: playerHand.cards,
        // first card and second dummy card
        // for dealer's hand view
        dealerHand: [dealerHand.cards[0], { rank: "dummy", suit: "" }],
        playerScore: playerHand.scoreTotal,
        roundCount: ++prevState.roundCount,
        inProgress: true,
        split: playerHand.cards[0].rank === playerHand.cards[1].rank,
        nonPlayable: false,
        nonce: this.state.nonce + 1,
      }),
      () => {
        // automatically stand if blackjack is drawn!
        return playerHand.hasBlackjack ? this.onStand() : null;
      }
    );
  }

  /**
   * Handle player's new hit event.
   */
  onHit() {
    let { deck, playerHand, playerSplit } = this.props;

    if (this.state.split) {
      this.setState({ split: false });
    }

    var hand;

    if (this.state.isSplit) {
      if (this.state.activeHand) {
        hand = playerHand;
      } else {
        hand = playerSplit;
      }
    } else {
      hand = playerHand;
    }

    // draw one card
    hand.draw(deck.deal());
    var mySound = new sound(BlackjackSound);
    mySound.volume(this.state.volume);
    mySound.play();

    // update the view
    this.setState(
      {
        [this.state.activeHand ? "playerHand" : "playerSplit"]: hand.cards,
        [this.state.activeHand ? "playerScore" : "splitScore"]: hand.scoreTotal,
      },
      () => {
        // automatically stand if bust
        return hand.isBust ? this.onStand() : null;
      }
    );
  }

  /**
   * Handles player's stand event (round finished).
   * Dealers hits here - view layer does not know
   * anything about the logic.
   * Determines the winner
   * Updates the view
   */
  onStand() {
    const {
      playerHand,
      deck,
      getWinner,
      dealerDrawing,
      playerSplit,
    } = this.props;
    let { dealerHand } = this.props;

    if (dealerHand.scoreTotal < 21) {
      // let dealer draw
      dealerDrawing(dealerHand, deck, playerHand, this.state.isSplit);
    }

    // prepare state to be updated
    const dealerScore = dealerHand.scoreTotal;
    var isWin = getWinner(playerHand.scoreTotal, dealerScore);
    if (this.state.isSplit && !isWin) {
      isWin = getWinner(playerSplit.scoreTotal, dealerScore);
    }
    const winCount =
      isWin === true ? ++this.state.winCount : this.state.winCount;
    const winPercentage = calculateWinPercentage(
      winCount,
      this.state.roundCount
    );
    const bet = parseFloat(this.formatBet(this.state.bet));

    if (isWin) {
      const winnings = bet * 2 * (1 - this.props.houseEdge / 100);
      this.props.setBank(winnings);
      this.addToDiceDB(winnings);
      var winSound = new sound(winNoise);
      winSound.play();
      Axios.post(
        `${window.baseURL}/user/${window.localStorage.getItem("token")}`,
        {
          win: true,
          wager: this.formatBet(this.state.bet),
          profit: winnings - bet,
        }
      );
      if (parseFloat(this.formatBet(this.state.bet)) > 50000000) {
        const { socket } = this.props;
        socket.emit(
          "50m",
          window.localStorage.getItem("token"),
          winnings,
          "Blackjack"
        );
      }
    } else {
      if (this.state.hasInsurance && dealerScore === 21) {
        this.props.setBank(
          (bet / 2) * (2 / 1) * (1 - this.props.houseEdge / 100)
        );
        this.addToDiceDB(
          (bet / 2) * (2 / 1) * (1 - this.props.houseEdge / 100)
        );
        const loseSound = new sound(loseNoise);
        loseSound.play();
        Axios.post(
          `${window.baseURL}/user/${window.localStorage.getItem("token")}`,
          {
            loss: true,
            wager: this.formatBet(this.state.bet),
            profit:
              (bet / 2) * (2 / 1) * (1 - this.props.houseEdge / 100) - bet,
          }
        );
      } else {
        if (isWin === null) {
          this.props.setBank(bet);
          const loseSound = new sound(loseNoise);
          loseSound.play();
        } else {
          this.addToDiceDB(-bet);
          const loseSound = new sound(loseNoise);
          loseSound.play();
          Axios.post(
            `${window.baseURL}/user/${window.localStorage.getItem("token")}`,
            {
              loss: true,
              wager: this.formatBet(this.state.bet),
              profit: -bet,
            }
          );
        }
      }
    }

    this.props.getRows();
    this.props.updateTable();

    this.setState(
      (prevState, props) => ({
        winCount,
        winPercentage,
        dealerHand: dealerHand.cards,
        dealerScore,
        inProgress: false,
        isWin,
        isSplit: false,
        showInsurance: false,
        hasInsurance: false,
      }),
      () => {
        // hide cards and prepare for the next round
        window.setTimeout(() => {
          this.resetRound();
          deck.reset();
          this.setState({
            isWin: undefined,
            split: false,
            isSplit: false,
            activeHand: 1,
          });
        }, RESET_ROUND_TIME);
      }
    );
  }

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
            game: "Blackjack",
            wager: parseFloat(finalResult),
            multiplier: result > 0 ? 2 : 0,
            //win or lose condition
            profit: result,
            clientSeed: this.state.clientSeed,
            nonce: this.state.nonce,
            serverHash: this.state.serverSeedHashed,
          }),
        }
      );
      this.props.updateTable();
    }
  };

  resetRound() {
    const { playerHand, dealerHand, playerSplit } = this.props;

    // clear hands
    playerHand.clear();
    dealerHand.clear();
    playerSplit.clear();
    // clean-up the view
    this.setState({
      isWin: undefined,
      isSplit: false,
      playerHand: [],
      dealerHand: [],
      playerScore: undefined,
      dealerScore: undefined,
    });
  }

  /**
   * Clear timeout if defined
   */
  clearTimeout() {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
  }

  /**
   * Clear timeout when component unmounts.
   * This is not necessary for this app because
   * this component will only umnount when the
   * browser tab/window is closed, but still
   * it is good to clean-up
   */
  componentWillUnmount() {
    this.clearTimeout();
  }

  handleBet(value) {
    this.setState({ bet: value });
  }

  split() {
    const deck = this.props.deck;
    const playerFullHand = this.props.playerHand;
    const playerFullSplit = this.props.playerSplit;
    const { playerHand } = this.state;
    const playerSplit = [],
      newPlayerHand = [];
    var splitScore = 0,
      newHandScore = 0;
    playerSplit.push(playerHand[0]);
    newPlayerHand.push(playerHand[1]);

    playerFullHand.clear();
    playerFullSplit.clear();
    playerFullHand.setHand(newPlayerHand);
    playerFullSplit.setHand(playerSplit);

    //fill hands after split
    playerFullHand.draw(deck.deal());
    playerFullSplit.draw(deck.deal());

    const newHand1 = playerFullHand.cards,
      newHand2 = playerFullSplit.cards;

    for (let i = 0; i < newHand1.length; i++) {
      const element = newHand1[i];
      newHandScore += element.rank;
    }

    for (let j = 0; j < newHand2.length; j++) {
      const element = newHand2[j];
      splitScore += element.rank;
    }

    this.setState({
      isSplit: true,
      split: false,
      playerSplit: playerSplit,
      playerHand: newPlayerHand,
      playerScore: newHandScore,
      splitScore: splitScore,
    });
  }

  async double() {
    const bet = parseFloat(this.formatBet(this.state.bet));
    if (this.props.bank > bet) {
      await this.setState({ bet: millify(bet * 2) });
      this.onHit();
      this.setState({ nonPlayable: true });
      setTimeout(() => this.onStand(), 500);
    } else {
      swal.fire({
        title: "Insufficient Funds",
        icon: "error",
      });
    }
  }

  stand() {
    if (this.state.isSplit && this.state.activeHand === 1) {
      this.setState({ activeHand: 0 });
      return;
    }
    this.setState({ nonPlayable: true });
    setTimeout(() => this.onStand(), 500);
  }

  formatBet(bet) {
    var finalString = bet.toString().toLowerCase();
    finalString = finalString.replace("t", "000000000000");
    finalString = finalString.replace("b", "000000000");
    finalString = finalString.replace("m", "000000");
    finalString = finalString.replace("k", "000");
    return finalString;
  }

  startBet = async () => {
    var finalResult = this.formatBet(this.state.bet);
    window
      .fetch(
        `${window.baseURL}/checkValidUser/` +
          window.localStorage.getItem("token")
      )
      .then((response) => response.json())
      .then((data) => {
        if (data !== false) {
          if (this.props.bank > parseFloat(finalResult)) {
            this.onDeal();
          }
        } else {
          window.location = "/login";
        }
      });
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

  /**
   * Render the app component.
   * @return {ReactElement} markup
   */
  render() {
    const {
      roundCount,
      playerHand,
      playerScore,
      dealerScore,
      dealerHand,
      inProgress,
      isWin,
      isSplit,
      activeHand,
      winCount,
      winPercentage,
      bet,
      playerSplit,
      splitScore,
    } = this.state;

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
      <>
        {this.state.showInsurance && (
          <div className="bj-insurance-background">
            <div className="bj-insurance">
              <div className="bj-insurance-header">
                Would you like insurance?
              </div>
              <Button
                onClick={() => {
                  this.props.setBank(-bet / 2);
                  this.setState({ showInsurance: false, hasInsurance: true });
                }}
              >
                Yes
              </Button>
              <Button onClick={() => this.setState({ showInsurance: false })}>
                No
              </Button>
            </div>
          </div>
        )}
        <div className="dice-page">
          <div className="dice-game-wrapper bj-wrapper">
            <div className="app">
              <header>
                <Info isWin={isWin} />
              </header>
              <div className="side-bar bj-side">
                <Controls
                  inProgress={inProgress}
                  gameOver={isWin !== undefined}
                  deal={() => this.startBet()}
                  hit={() => this.onHit()}
                  stand={this.stand.bind(this)}
                  bet={bet}
                  handleBet={this.handleBet.bind(this)}
                  playerHand={playerHand}
                  split={this.state.split}
                  formatBet={this.formatBet}
                  double={this.double.bind(this)}
                  nonPlayable={this.state.nonPlayable}
                  splitHand={this.split.bind(this)}
                />
              </div>
              <section role="main">
                <div className="hand-wrapper">
                  <div className="hand-pos">
                    <div className="dealer-hand">
                      <Hand
                        cards={dealerHand}
                        score={dealerScore}
                        inProgress={inProgress}
                        owner="dealer"
                      />
                    </div>
                    <div style={{ display: "flex" }} className="player-hand">
                      <div
                        style={{
                          width: isSplit ? "50%" : "100%",
                          border: isSplit && activeHand && "1px solid green",
                          borderRadius: 300,
                          position: "relative",
                        }}
                      >
                        <Hand
                          cards={playerHand}
                          score={playerScore}
                          inProgress={inProgress}
                          owner="player"
                        />
                      </div>
                      {isSplit && (
                        <div
                          style={{
                            width: "50%",
                            height: "100%",
                            borderRadius: 300,
                            border: !activeHand && "1px solid green",
                          }}
                        >
                          <Hand
                            cards={playerSplit}
                            score={splitScore}
                            inProgress={inProgress}
                            owner="player"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
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
                onChange={(e, value) => this.setState({ volume: value / 100 })}
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
      </>
    );
  }
}

export default App;
