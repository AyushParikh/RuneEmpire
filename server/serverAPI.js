const express = require("express");
var cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
var bodyParser = require("body-parser");
const secret = "mysecretsshhh";
var bcrypt = require("bcryptjs");
var Provably = require("./ProvablyFair").generateFloats;
var tables = require("./TableManager");
const { reset } = require("nodemon");
const { user, scores } = require("./TableManager");
var usersTable = tables.user();
var historyTable = tables.scores();
var chatTable = tables.chat();
var houseEdge = tables.house();
var forgotPass = tables.forgot();

const nodemailer = require("nodemailer");

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function authenticate(newToken) {
  try {
    var user = jwt.verify(newToken, secret); // checks whether token is verified or not
    return user; // returns true if verified
  } catch (err) {
    return false;
  }
  // TODO currently crashes if somehow people manage to pass an invalid token back (we do have checks for this). write a .then .catch for this
}

// Users
/*-----------------------------------------------------------------------------------------*/

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

app.post("/createUser", function (req, res) {
  usersTable.getByUsername(req.body.username).then((user) => {
    if (user === undefined) {
      //insert User into Database
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          console.error("there was an error", err);
        } else {
          bcrypt.hash(req.body.password, salt, (err, passwordHash) => {
            if (err) console.error("there was an error, err");
            else {
              var seed = makeSeed(64);
              usersTable.create(
                req.body.username,
                passwordHash,
                req.body.email,
                seed,
                0,
                req.body.level
              );
              res.send(true);
            }
          });
        }
      });
    } else {
      res.send(false);
    }
  });
});

app.post("/login", function (req, res) {
  usersTable.getByUsername(req.body.username).then((user) => {
    if (user === undefined) {
      res.send(false);
    } else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        let token = jwt.sign(user, secret);
        let response = {
          message: "Token Created, Authentication Successful!",
          token: token,
        };
        res.json({
          token: token,
          username: req.body.username,
        }); // returns that token
      } else {
        res.send(false);
      }
    }
  });
});

app.get("/user/:username", (req, res) => {
  usersTable.getByUsername(req.params.username).then((user) => {
    const info = {
      username: req.params.username,
      bets: user.betsMade,
      wins: user.wins,
      losses: user.losses,
      wagered: user.wagered,
      profit: user.profit,
    };
    res.send(info);
  });
});

app.post("/user/:token", (req, res) => {
  const user = authenticate(req.params.token);
  usersTable.getByUsername(user.username).then((user) => {
    usersTable
      .updateWagers(
        user.username,
        user.betsMade + 1,
        req.body.win ? user.wins + 1 : user.wins,
        req.body.loss ? user.losses + 1 : user.losses,
        parseFloat(user.wagered) + parseFloat(req.body.wager),
        req.body.profit
          ? parseFloat(user.profit) + parseFloat(req.body.profit)
          : parseFloat(user.profit)
      )
      .then(() => {
        res.send(true);
      });
  });
});

app.post("/login/resetPass", function (req, res) {
  usersTable.getByEmail(req.body.email).then((user) => {
    if (user === undefined) {
      res.send(true);
    } else {
      const seed = randomString(32);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "no.reply.runeempire@gmail.com",
          pass: "fiverrProject1!",
        },
      });

      forgotPass.create(seed, Date.now(), user.username).then(() => {
        const mailOptions = {
          from: "no.reply.runeempire@gmail.com",
          to: req.body.email,
          subject: "Account Password Reset",
          html:
            "<h1>Password Recovery Email</h1><br><div>Follow this link to reset you password: <a href='http://localhost:3000/" +
            seed +
            "'>Reset Password</a><br>If you did not request this email please do not interact with it as it may be an attempt to breach security.<br><br>Regards<br><b>The RuneEmpire Team</b></div>",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.send(false);
          } else {
            console.log("Email sent: " + info.response);
            res.send(true);
          }
        });
      });
    }
  });
});

app.get("/validLink/:link", (req, res) => {
  forgotPass
    .get(req.params.link)
    .then((link) => {
      if (!link.used) {
        res.send({ username: link.username });
      } else {
        res.send(false);
      }
    })
    .catch(() => res.send(false));
});

app.post("/resetPassword", (req, res) => {
  //update user password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error("there was an error", err);
    } else {
      bcrypt.hash(req.body.newPassword, salt, (err, passwordHash) => {
        if (err) console.error("there was an error, err");
        else {
          usersTable
            .updatePassword(passwordHash, req.body.username)
            .then(() => {
              forgotPass.setUsed(req.body.seed).then(() => {
                res.send(true);
              });
            });
          res.send(true);
        }
      });
    }
  });
});

// checks valid user
app.get("/checkValidUser/:token", (req, res) => {
  const newToken = req.params.token;
  var result = authenticate(newToken);
  if (result !== false) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.get("/userCash/:token", (req, res) => {
  const token = req.params.token;
  if (token !== null) {
    var user = authenticate(token);
    usersTable
      .getCash(user.username)
      .then((userCash) => {
        res.send({
          cash: userCash.money,
        });
      })
      .catch((err) => res.send(false));
  }
});

app.post("/setUserCash/:token", (req, res) => {
  const token = req.params.token;
  if (token !== null) {
    var user = authenticate(token);
    usersTable.setCash(user.username, req.body.cash);
    res.send(true);
  }
});

app.get("/seed/:token", (req, res) => {
  const token = req.params.token;
  if (token !== null) {
    var user = authenticate(token);
    usersTable.getUserSeed(user.username).then((seed) => {
      if (seed !== undefined) {
        var result = hashSeed(seed.seed, 10);
        res.send(result);
      }
    });
  }
});

function hashSeed(seed, salt) {
  return bcrypt.hashSync(seed, salt);
}

app.get("/newSeed/:token", (req, res) => {
  const token = req.params.token;
  if (token !== null) {
    var user = authenticate(token);
    usersTable.setUserSeed(makeSeed(64), user.username);
    historyTable.showOldSeeds(user.username);
    res.send(true);
  } else res.send(false);
});

app.get("/checkAdmin/:token", (req, res) => {
  const token = req.params.token;
  if (token !== null) {
    var user = authenticate(token);
    res.send({ level: user.level });
  }
});

app.post("/getUserBalance", (req, res) => {
  if (req.body.username != null) {
    usersTable
      .getByUsername(req.body.username)
      .then((user) => {
        res.send({ balance: user.money });
      })
      .catch((err) => res.send({ noUser: true }));
  }
});

app.post("/changeUserBalance", (req, res) => {
  if (req.body.username != null) {
    usersTable
      .getCash(req.body.username)
      .then((cash) => {
        var cashChange = parseInt(cash.money) + parseInt(req.body.changeAmount);
        if (cashChange <= 0) {
          cashChange = 0;
        }
        usersTable
          .setCash(req.body.username, cashChange)
          .then(() => {
            res.send(true);
          })
          .catch((err) => res.send({ error: true }));
      })
      .catch((err) => res.send({ error: true }));
  }
});

app.post("/validUser", (req, res) => {
  usersTable
    .getByUsername(req.body.username)
    .then((user) => {
      if (user !== undefined) {
        res.send(true);
      } else {
        res.send(false);
      }
    })
    .catch((err) => res.send(false));
});

app.post("/muteUser", (req, res) => {
  usersTable.muteUser(true, req.body.username, req.body.time).then(() => {
    res.send(true);
  });
});

app.post("/changeUserLevel", (req, res) => {
  usersTable
    .setLevel(req.body.username, req.body.level)
    .then(() => res.send(true));
});

//Dice
/*-----------------------------------------------------------------------------------------------*/

app.post("/dice/getResult/:token", (req, res) => {
  const token = req.params.token;
  if (token !== null) {
    var user = authenticate(token);

    usersTable.getUserSeed(user.username).then((seed) => {
      var result = Provably({
        serverSeed: seed.seed,
        clientSeed: req.body.clientSeed,
        nonce: req.body.nonce,
        cursor: 0,
        count: req.body.count,
      });

      res.send(result);
    });
  }
});

app.post("/getServerSeedUnhashed", (req, res) => {
  historyTable.getUserSeed(req.body.gameID).then((seed) => {
    res.send(seed);
  });
});

app.get("/gameID", (req, res) => {
  historyTable.getMaxRow().then((max) => {
    res.send({
      id: max[0] ? max[0].id : 1,
    });
  });
});

app.get("/game/:id", (req, res) => {
  historyTable.get(req.params.id).then((row) => {
    const result = {
      game: row.game,
      username: row.username,
      time: row.time,
      wager: row.wager,
      multiplier: row.multiplier,
      profit: row.profit,
      clientSeed: row.clientSeed,
      nonce: row.nonce,
      serverHash: row.serverHash,
      serverUnhash:
        row.serverSeedShow === 1
          ? row.serverUnhash
          : "Server seed not revealed yet",
    };

    res.send(result);
  });
});

app.post("/dice/addScore/:token", (req, res) => {
  const token = req.params.token;
  if (token !== null) {
    var user = authenticate(token);
    usersTable.getUserSeed(user.username).then((seed) => {
      historyTable.insert(
        req.body.game,
        user.username,
        new Date(),
        req.body.wager,
        req.body.multiplier,
        req.body.profit,
        req.body.clientSeed,
        req.body.nonce,
        req.body.serverHash,
        seed.seed
      );
      res.send(true);
    });
  }
});

app.post("/games/getScoresData/:rowsToGet", (req, res) => {
  var rowsToGet = req.params.rowsToGet;
  if (req.body.table === 0) {
    historyTable.getAll(rowsToGet).then((scores) => {
      res.send(scores);
    });
  } else if (req.body.table === 1) {
    var user = authenticate(req.body.token);
    historyTable
      .getUserBets(user.username, req.params.rowsToGet)
      .then((bets) => {
        res.send(bets);
      })
      .catch((err) => console.log(err));
  } else if (req.body.table === 2) {
    historyTable.getHighBets(req.params.rowsToGet).then((bets) => {
      res.send(bets);
    });
  } else {
    res.send(false);
  }
});

app.post("/blackjack/fairness/:token", (req, res) => {
  const user = jwt.verify(req.params.token, secret);
  usersTable
    .getByUsername(user.username)
    .then((u) => {
      const result = Provably({
        serverSeed: u.seed,
        clientSeed: req.body.clientSeed,
        nonce: req.body.nonce,
        cursor: 0,
        count: req.body.count,
      });
      const cards = [];

      for (let i = 0; i < result.length; i++) {
        const element = result[i];
        cards.push(Math.floor(element * 52));
      }

      res.send({ result: cards });
    })
    .catch((err) => {
      console.log(err);
      res.send(false);
    });
});

app.post("/roulette/fairness/:token", (req, res) => {
  const user = jwt.verify(req.params.token, secret);
  usersTable
    .getByUsername(user.username)
    .then((u) => {
      const result = Provably({
        serverSeed: u.seed,
        clientSeed: req.body.clientSeed,
        nonce: req.body.nonce,
        cursor: 0,
        count: req.body.count,
      });

      const POCKETS = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
      ];

      const pocket = POCKETS[Math.floor(result * 38)];

      res.send({ result: pocket });
    })
    .catch((err) => {
      res.send(false);
    });
});

//Chat
/*----------------------------------------------------------------------------------------------*/

app.post("/chat/newMessage", (req, res) => {
  const token = req.body.token;
  if (token !== null) {
    var user = authenticate(token);
    if (user) {
      const currentTime = Math.floor(Date.now() / 1000);

      usersTable.getByUsername(user.username).then((result) => {
        if (currentTime <= result.dateMuted + result.time) {
          res.send({ userMuted: true });
        } else {
          if (result !== false) {
            const name = req.body.systemMessage
              ? "[RUNE_EMPIRE]"
              : result.username;
            chatTable.create(name, req.body.message, result.level);
            res.send(true);
          } else {
            res.send(false);
          }
        }
      });
    } else {
      res.send(false);
    }
  } else {
    res.send(false);
  }
});

app.get("/getChat", (req, res) => {
  chatTable.getAll().then((messages) => {
    res.send(messages);
  });
});

app.get("/getMod", (req, res) => {
  usersTable.getMods().then((users) => {
    res.send(users);
  });
});

app.post("/coinPayout", (req, res) => {
  console.log(req.body);
  if (req.body.winner === "player1") {
    const player1 = req.body.players.player1;
    usersTable.getCash(player1.name).then((cash) => {
      houseEdge.get().then((edge) => {
        usersTable
          .setCash(
            player1.name,
            cash.money +
              parseFloat(player1.bet) * (1 - edge.edge / 100) +
              parseFloat(player1.bet)
          )
          .then(() => {
            res.send(true);
          });
      });
    });
  } else if (req.body.winner === "player2") {
    const player2 = req.body.players.player2;
    usersTable.getCash(player2.name).then((cash) => {
      houseEdge.get().then((edge) => {
        usersTable
          .setCash(
            player2.name,
            cash.money +
              parseFloat(player2.bet) * (1 - edge.edge / 100) +
              parseFloat(player2.bet)
          )
          .then(() => {
            res.send(true);
          });
      });
    });
  }
});

function randomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.post("/coinFlip/result", (req, res) => {
  const serverSeed = randomString(64);
  const data = {
    serverSeed: serverSeed,
    clientSeed: req.body.clientSeed,
    nonce: req.body.nonce,
    cursor: 0,
    count: 1,
  };
  const result = Provably(data);

  res.send({ flip: result, data: data });
});

module.exports = {
  app,
  authenticate,
};
