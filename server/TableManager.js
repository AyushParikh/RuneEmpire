const Promise = require("bluebird");
const AppDAO = require("./dao");
const Users = require("./Tables/users");
const Dice = require("./Tables/DiceScores");
const Chat = require("./Tables/Chat");
const House = require("./Tables/House");
const crashSeeds = require("./Tables/CrashSeeds");
const forgotPass = require("./Tables/ForgotPassword");

const dao = new AppDAO("./Database/OSRSCasDB.db");
const usersTable = new Users(dao);
const diceTable = new Dice(dao);
const chatTable = new Chat(dao);
const houseTable = new House(dao);
const crashSeedsTable = new crashSeeds(dao);
const forgotPassTable = new forgotPass(dao);

function createNewTableUser() {
  usersTable.createTable().catch((err) => {
    console.log("Error: ");
    console.log(JSON.stringify(err));
  });
  return usersTable;
}

function createNewTableDice() {
  diceTable.createTable().catch((err) => {
    console.log("Error:");
    console.log(JSON.stringify(err));
  });
  return diceTable;
}

function createNewChatTable() {
  chatTable.createTable().catch((err) => {
    console.log("Error:");
    console.log(JSON.stringify(err));
  });
  return chatTable;
}

function createHouseTable() {
  houseTable
    .createTable()
    .then((table) => {
      houseTable.get().then((edge) => {
        if (edge == null) {
          houseTable.create(2);
        }
      });
    })
    .catch((err) => {
      console.log("Error:");
      console.log(JSON.stringify(err));
    });
  return houseTable;
}

function createCrashSeedTable() {
  crashSeedsTable.createTable().catch((err) => {
    console.log("Error:");
    console.log(JSON.stringify(err));
  });
  return crashSeedsTable;
}

function forgotPassword() {
  forgotPassTable.createTable().catch((err) => {
    console.log("ERROR:");
    console.lof(JSON.stringify(err));
  });
  return forgotPassTable;
}

module.exports = {
  user: createNewTableUser,
  scores: createNewTableDice,
  chat: createNewChatTable,
  house: createHouseTable,
  crash: createCrashSeedTable,
  forgot: forgotPassword,
};
