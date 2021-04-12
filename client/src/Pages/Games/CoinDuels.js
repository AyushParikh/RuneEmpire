import React from "react";
import Swal from "sweetalert2";

import "../../Style/CoinDuels.css";
import Axios from "axios";
import Millify from "millify";
import { result, join } from "lodash";
import { Button } from "@material-ui/core";
import ScoreTable from "../../Components/ScoreTable";

export default class CoinDuels extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gamesOngoing: [],
      countdowns: [],
      playersInGames: {},
      yourGame: [],
    };

    this.flip = this.flip.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.initSocket = this.initSocket.bind(this);
    this.addGame = this.addGame.bind(this);
  }

  componentDidMount() {
    this.initSocket();
  }

  initSocket() {
    const { socket } = this.props;
    if (socket) {
      socket.emit("GetCoinGames");
      socket.on("LogIn", () => {
        window.location = "/login";
      });
      socket.on("CoinGames", ({ gamesOngoing: games, coinGames: players }) => {
        this.setState({
          gamesOngoing: games,
          playersInGames: players,
          yourGame: [],
        });
        const keys = Object.keys(players);
        for (var i = 0; i < keys.length; i++) {
          const element = keys[i];
          if (players[element]) {
            if (
              players[element].player1.name ===
              window.localStorage.getItem("name")
            ) {
              const myGames = this.state.yourGame;
              myGames.push(i);
              this.setState({ yourGame: myGames });
            }
          }
        }
      });
      socket.on("GameJoined", async (players, gameId) => {
        const games = this.state.playersInGames;
        games[gameId] = players;
        const myGames = this.state.yourGame;
        myGames.push(gameId);
        await this.setState({ playersInGames: games, yourGame: myGames });
        if (games[gameId].player1 && games[gameId].player2) {
          var i = 3;
          const countdown = this.state.countdowns;
          countdown[gameId] = i;
          this.setState({ countdowns: countdown });
          i--;
          const timer = setInterval(() => {
            const countdown = this.state.countdowns;
            countdown[gameId] = i;
            this.setState({ countdowns: countdown });
            i--;
          }, 1000);
          this.setState({});
          setTimeout(() => {
            clearInterval(timer);
            this.startFlip(gameId);
          }, 3000);
        }
      });
      socket.on("CoinFlipped", (gameId) => {
        this.flip(gameId);
      });
    } else {
      requestAnimationFrame(this.initSocket);
    }
  }

  startFlip(gameId) {
    const { socket } = this.props;
    socket.emit("FlipCoin", gameId);
  }

  flip(gameId) {
    Axios.post(`${window.baseURL}/coinFlip/result`, {
      clientSeed:
        this.state.playersInGames[gameId].player1.client +
        this.state.playersInGames[gameId].player2.client,
      nonce: 0,
      bet: parseFloat(this.state.playersInGames[gameId].player1.bet),
    }).then((response) => {
      this.setState({ coinClass: "" });
      const res = response.data;
      setTimeout(() => {
        var result = "";
        var winner = "";
        if (res.flip <= 0.5) {
          result = "heads";
          winner = true;
        } else {
          result = "tails";
          winner = false;
        }
        this.setState({
          [gameId]: {
            result: result,
            winner: winner,
          },
        });
      }, 200);
    });
  }

  async resetGame(gameId) {
    const winner = this.state[gameId].winner ? "player1" : "player2";
    await this.setState({
      [gameId]: {
        finalWinner: winner,
        result: this.state[gameId].result,
        yourGame: false,
      },
    });
    setTimeout(() => {
      const players = this.state.playersInGames[gameId];
      this.removeUsers(gameId);
      this.props.getBank();
      setTimeout(() => {
        const { socket } = this.props;
        socket.emit("CancelDuel");
      }, 200);
    }, 2000);
  }

  removeUsers(gameId) {
    const { socket } = this.props;
    console.log(this.state[gameId]);
    socket.emit(
      "GameOver",
      gameId,
      this.state[gameId].finalWinner,
      window.localStorage.token
    );
  }

  addGame() {
    const { socket } = this.props;
    socket.emit("AddDuel");
    this.joinCoinGame(this.state.gamesOngoing.length, true);
  }

  joinCoinGame(gameId, player1) {
    const { socket } = this.props;
    if (player1) {
      Swal.fire({
        title: "Bet Amount?",
        html:
          "<div>Bet: </div>" +
          '<input id="swal-input1" class="swal2-input placeholder="Bet">' +
          "<div>Client Seed: </div>" +
          '<input id="swal-input2" class="swal2-input">',
        focusConfirm: false,
        preConfirm: () => {
          const clientSeed = document.getElementById("swal-input2").value;
          const result = document.getElementById("swal-input1");
          const bet = this.formatBet(result.value);
          if (bet) {
            if (!isNaN(parseFloat(bet))) {
              if (this.props.bank >= parseFloat(bet)) {
                socket.emit(
                  "JoinCoin",
                  gameId,
                  window.localStorage.getItem("token"),
                  bet,
                  clientSeed
                );
                this.props.setBank(-parseFloat(bet));
              } else {
                Axios.get(
                  `${
                    window.baseURL
                  }/checkValidUser/${window.localStorage.getItem("token")}`
                ).then((response) => {
                  if (response.data !== false) {
                    Swal.fire({
                      title: "You dont have enough money",
                      icon: "error",
                    });
                  } else {
                    window.location = "/login";
                  }
                });
              }
            }
          } else {
            Swal.fire({
              title: "Please Input Bet Amount",
              icon: "error",
            });
            socket.emit("CancelDuel");
          }
        },
        showCancelButton: true,
      }).then((result) => {
        if (result.dismiss) {
          socket.emit("CancelDuel");
        }
      });
    } else {
      const bet = this.state.playersInGames[gameId].player1.bet;
      if (this.props.bank >= parseFloat(bet)) {
        Swal.fire({
          title: "Your Client Seed",
          input: "text",
          text: "Client Seed: ",
          showCancelButton: true,
        }).then((result) => {
          if (!result.dismiss) {
            socket.emit(
              "JoinCoin",
              gameId,
              window.localStorage.getItem("token"),
              bet,
              result.value
            );
            this.props.setBank(-parseFloat(bet));
          }
        });
      } else {
        Swal.fire({
          title: "You dont have enough money",
          icon: "error",
        });
      }
    }
  }

  formatBet(bet) {
    var finalString = bet.toString().toLowerCase();
    finalString = finalString.replace("t", "000000000000");
    finalString = finalString.replace("b", "000000000");
    finalString = finalString.replace("m", "000000");
    finalString = finalString.replace("k", "000");
    return finalString;
  }

  cancelBet(gameID) {
    const { socket } = this.props;
    socket.emit("CancelGame", window.localStorage.getItem("token"), gameID);
    console.log(this.state.playersInGames[gameID]);
    this.props.setBank(
      parseFloat(this.state.playersInGames[gameID].player1.bet)
    );
  }

  render() {
    const keys = Object.values(this.state.playersInGames);
    for (let i = 0; i < keys.length; i++) {
      const element = keys[i];
      if (element === null) {
        keys.splice(i, 1);
      }
    }
    return (
      <div>
        <div id="coin-page">
          <div id="coin-game">
            {this.state.gamesOngoing.map((game, i) => {
              const players = this.state.playersInGames[i];
              return (
                <>
                  <div className="coin-wrapper">
                    <div className="player1-join">
                      {this.state.playersInGames[i] &&
                        this.state.playersInGames[i].player1 && (
                          <div>
                            <div
                              style={{
                                color:
                                  this.state[i] &&
                                  this.state[i].finalWinner === "player1" &&
                                  "green",
                              }}
                              className="player-1-name"
                            >
                              {this.state.playersInGames[i].player1.name}
                            </div>
                            <div
                              style={{
                                color:
                                  this.state[i] &&
                                  this.state[i].finalWinner === "player1" &&
                                  "green",
                              }}
                              className="player-1-bet"
                            >
                              Bet:
                              {Millify(
                                this.state.playersInGames[i].player1.bet
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                    <div
                      className="player2-join"
                      style={{
                        background: !this.state.playersInGames[i] && "none",
                      }}
                    >
                      {this.state.playersInGames[i] &&
                        this.state.playersInGames[i].player2 && (
                          <div>
                            <div
                              style={{
                                color:
                                  this.state[i] &&
                                  this.state[i].finalWinner === "player2" &&
                                  "green",
                              }}
                              className="player-2-name"
                            >
                              {this.state.playersInGames[i].player2.name}
                            </div>
                            <div
                              style={{
                                color:
                                  this.state[i] &&
                                  this.state[i].finalWinner === "player2" &&
                                  "green",
                              }}
                              className="player-2-bet"
                            >
                              Bet:
                              {Millify(
                                this.state.playersInGames[i].player2.bet
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="anim-wrapper">
                      <div
                        onAnimationEnd={() => this.resetGame(i)}
                        className={`coin ${
                          this.state[i] && this.state[i].result
                        }`}
                      >
                        <div className="side-a">
                          <div className="player1-coin">
                            {this.state.playersInGames[i] &&
                              this.state.playersInGames[i].player1 &&
                              this.state.playersInGames[i].player1.name}
                          </div>
                        </div>
                        <div className="side-b">
                          <div className="player2-coin">
                            {this.state.playersInGames[i] &&
                              this.state.playersInGames[i].player2 &&
                              this.state.playersInGames[i].player2.name}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="counter">
                      {this.state.countdowns[i] &&
                      this.state.countdowns[i] !== 0
                        ? this.state.countdowns[i]
                        : null}
                    </div>
                    {this.state.yourGame.includes(i) &&
                      !this.state.playersInGames[i].player2 && (
                        <div className="cancel-coin">
                          <Button onClick={() => this.cancelBet(i)}>
                            Cancel Bet
                          </Button>
                        </div>
                      )}
                    {players ? (
                      !players.player2 && (
                        <button
                          className="player2-join"
                          onClick={() => {
                            const players = this.state.playersInGames[i];
                            this.joinCoinGame(i, false);
                          }}
                        >
                          Join Game
                        </button>
                      )
                    ) : (
                      <button
                        className="player1-join"
                        onClick={() => {
                          const players = this.state.playersInGames[i];
                          this.joinCoinGame(i, true);
                        }}
                      >
                        Join Game
                      </button>
                    )}
                  </div>
                  {(i + 1) % 3 === 0 && <div className="coin-break"></div>}
                </>
              );
            })}
            {keys.length >= 6 && (
              <button onClick={this.addGame} className="add-game">
                Add Game
              </button>
            )}
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
