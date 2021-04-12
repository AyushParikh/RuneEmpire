const express = require("express");
var cors = require("cors");
const app = express();
var fs = require("fs");
var path = require("path");
var chalk = require("chalk");
var bodyParser = require("body-parser");
const appPort = 4000;

var appAPI = require("./serverAPI");

let canvasInfo;

function setCanvasInfo(newInfo) {
  return new Promise((response) => {
    canvasInfo = newInfo;
    response(canvasInfo);
  });
}

function getCanvasInfo() {
  return canvasInfo;
}

module.exports = {
  setCanvas: setCanvasInfo,
  getCanvasInfo: getCanvasInfo,
};

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(appAPI.app);

// A fully built client should be in a directory called 'client' in the server's root.
// As it uses client side routing, we are always going to return the client regardless of path.
// We have no idea what URLs are right unless we code that in here manually.
if (fs.existsSync(path.resolve("client"))) {
  app.use("/", express.static("client"));
  app.use((req, res) => {
    res.sendFile(path.resolve("client/index.html"));
  });
} else {
  console.log(
    chalk.bgYellow.black(" WARNING "),
    "No pre-built client app has been found. Any requests that don't match an endpoint will return an error page."
  );
  app.use("/", (req, res) =>
    res.send(
      '<h1 align="center">No built client application has been detected.</h1>'
    )
  );
}

var server = app.listen(process.env.PORT || appPort, () =>
  console.log(
    `Listening at http://localhost:${appPort} And http://192.168.1.235:4001 Press Enter to Stop Service`
  )
);

var io = (module.exports.io = require("socket.io")(server));

var SocketManager = require("./SocketManager");

io.on("connection", SocketManager);
