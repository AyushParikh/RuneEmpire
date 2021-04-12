var tables = require("./TableManager");
var chatTable = tables.chat();
var userTable = tables.user();
var scoreTable = tables.scores();
var houseTable = tables.house();
var { createChat, createMessage } = require("./Sockets/Factories");
var crashTable = tables.crash();
var usersTable = tables.user();

const io = require("./server").io;

function makeSeed(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const {
  USER_CONNECTED,
  USER_DISCONNECTED,
  PRIVATE_MESSAGE,
  COMMUNITY_CHAT,
  MESSAGE_RECEIVED,
  MESSAGE_SENT,
} = require("./Sockets/Events");
const { user } = require("./TableManager");
const { JsonWebTokenError } = require("jsonwebtoken");
const { authenticate } = require("./serverAPI");
const { white } = require("chalk");

let connectedUser = {};

let coinGames = {};
let gamesOngoing = [0, 1, 2, 3, 4, 5];

var hashChain = [];

module.exports = function (socket) {
  let sendMessageToChatFromUser;

  socket.on(USER_CONNECTED, (user) => {
    if (user.name) {
      user.socketId = socket.id;
      connectedUser[user.name] = user;

      sendMessageToChatFromUser = sendMessageToChat(user.name);
    }

    socket.emit(USER_CONNECTED, connectedUser);
    chatTable.getAll().then((messages) => {
      socket.emit("FromAPI", messages);
    });

    socket.on("disconnect", () => {
      if (user.name in connectedUser) {
        //io.emit(USER_DISCONNECTED, user.name);
        connectedUser = removeUser(connectedUser, user.name);
      }
    });
  });

  socket.on(COMMUNITY_CHAT, () => {
    chatTable.getAll().then((messages) => {
      io.emit("FromAPI", messages);
    });
  });

  socket.on("getEdge", () => {
    houseTable.get().then((edge) => {
      io.emit("gotEdge", edge.edge);
    });
  });

  socket.on("getEdgeMount", () => {
    houseTable.get().then((edge) => {
      io.emit("gotEdgeMount", edge.edge);
    });
  });

  socket.on("changeEdge", (newEdge) => {
    houseTable.update(newEdge).then(() => {
      io.emit("gotEdge", newEdge);
    });
  });

  socket.on("changeBalance", ({ user, money }) => {
    userTable.getCash(user).then((curCash) => {
      userTable
        .setCash(user, parseFloat(curCash.money) + parseFloat(money))
        .then(() => {
          socket.emit("moneyChanged");
          io.emit("updateMoney");
        });
    });
  });

  socket.on("getRows", () => {
    socket.broadcast.emit("newRow");
  });

  socket.on("rain", async (amount, number, token) => {
    const numUsers = Object.keys(connectedUser);

    const user = authenticate(token);

    var userCash = await userTable.getCash(user.username);
    await userTable.setCash(
      user.username,
      parseFloat(userCash.money) - parseFloat(amount)
    );

    const usersWithoutTipper = [];
    for (let i = 0; i < numUsers.length; i++) {
      const element = numUsers[i];
      if (element !== user.username) {
        usersWithoutTipper.push(element);
      }
    }

    if (usersWithoutTipper.length > 0) {
      for (let i = 0; i < number; i++) {
        var player = Math.floor(Math.random() * usersWithoutTipper.length);
        var userSelected = usersWithoutTipper[player];
        var curCash = await userTable.getCash(userSelected);
        await userTable.setCash(
          userSelected,
          Math.floor(parseFloat(curCash.money) + parseFloat(amount / number))
        );
      }
      io.emit("makeitrain", true);
    } else {
      io.emit("makeitrain", false);
    }
  });

  socket.on("AddDuel", () => {
    gamesOngoing.push(gamesOngoing.length);
    io.emit("CoinGames", { gamesOngoing, coinGames });
  });

  socket.on("CancelDuel", () => {
    if (gamesOngoing.length > 6) {
      if (!coinGames[gamesOngoing[gamesOngoing.length - 1]]) {
        delete coinGames[gamesOngoing[gamesOngoing.length - 1]];
        gamesOngoing.splice(gamesOngoing.length - 1, 1);
        io.emit("CoinGames", { gamesOngoing, coinGames });
      }
    }
  });

  socket.on("GetCoinGames", () => {
    io.emit("CoinGames", { gamesOngoing, coinGames });
  });

  socket.on("CancelGame", (token, gameId) => {
    const user = authenticate(token);
    if (user) {
      coinGames[gameId] = null;
      io.emit("CoinGames", { gamesOngoing, coinGames });
    }
  });

  socket.on("JoinCoin", (gameId, token, bet, client) => {
    const user = require("./serverAPI").authenticate(token);
    if (user) {
      if (
        coinGames[gameId] &&
        coinGames[gameId].player1.name !== user.username
      ) {
        if (!coinGames[gameId].player2) {
          coinGames[gameId] = {
            player1: {
              name: coinGames[gameId].player1.name,
              bet: coinGames[gameId].player1.bet,
              client: coinGames[gameId].player1.client,
            },
            player2: { name: user.username, bet: bet, client: client },
          };
          setTimeout(() => endCoinGame(gameId), 11000);
        }
      } else {
        coinGames[gameId] = {
          player1: { name: user.username, bet: bet, client: client },
        };
      }
      io.emit("GameJoined", coinGames[gameId], gameId);
    } else {
      socket.emit("LogIn");
    }
  });

  socket.on("FlipCoin", (gameId) => {
    io.emit("CoinFlipped", gameId);
  });

  socket.on("GameOver", (gameId, winner, token) => {
    if (coinGames[gameId]) {
      const curUser = authenticate(token);
      const player1 = coinGames[gameId].player1;
      const player2 = coinGames[gameId].player2;
      if (winner === "player1") {
        userTable.getCash(player1.name).then((cash) => {
          houseTable.get().then((edge) => {
            const newCash =
              parseFloat(cash.money) +
              parseFloat(player1.bet) * (1 - edge.edge / 100) +
              parseFloat(player1.bet);
            userTable.setCash(player1.name, newCash).then(() => {
              endCoinGame(gameId);
            });
          });
        });
      } else if (winner === "player2") {
        userTable.getCash(player2.name).then((cash) => {
          houseTable.get().then((edge) => {
            const newCash =
              parseFloat(cash.money) +
              parseFloat(player2.bet) * (1 - edge.edge / 100) +
              parseFloat(player2.bet);
            userTable.setCash(player2.name, newCash).then(() => {
              endCoinGame(gameId);
            });
          });
        });
      }
    }
  });

  socket.on("50m", (token, winnings, game) => {
    const user = authenticate(token);
    io.emit("50m", user.username, winnings, game);
  });
};

function endCoinGame(gameId) {
  delete gamesOngoing[gameId];
  coinGames[gameId] = null;
  io.emit("CoinGames", { gamesOngoing, coinGames });
}

function sendMessageToChat(sender) {
  return (chatId, message) => {
    io.emit(
      `${MESSAGE_RECEIVED}-${chatId}`,
      createMessage({ message, sender })
    );
  };
}

function removeUser(userList, username) {
  let newList = Object.assign({}, userList);
  delete newList[username];
  return newList;
}
