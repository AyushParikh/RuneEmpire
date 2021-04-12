import React from "react";
import "./Style/App.css";
import NavBar from "./Components/NavBar";
import ChatTab from "./Components/Chat/ChatTab";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Dice from "./Pages/Games/Dice";
import Plinko from "./Pages/Games/Plinko";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import Register from "./Pages/Register";
import clientSocket from "socket.io-client";
import {
  COMMUNITY_CHAT,
  MESSAGE_RECEIVED,
  MESSAGE_SENT,
  TYPING,
  USER_CONNECTED,
  USER_DISCONNECTED,
} from "./Components/Events";
import Swal from "sweetalert2";
import { PrivateRoute } from "./Components/PrivateRoute";
import ModPage from "./Pages/ModPage";
import makeSeed from "./Components/CreateClientSeed";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
// import Crash from "./Pages/Games/Crash";
import BlackJack from "./Pages/Games/BlackJack";
import CoinDuels from "./Pages/Games/CoinDuels";
import Roulette from "./Pages/Games/Roulette";
import ScoreTable from "./Components/ScoreTable";
import Axios from "axios";
import { isEmpty, isNull } from "lodash";
import ResetPassword from "./Pages/ResetPassword";
import Millify from "millify";
import Settings from "./Pages/Settings";
import logo from "./Images/Logo.png";

window.baseURL =
  process.env.NODE_ENV === "development"
    ? `http://${window.location.hostname}:4000`
    : "";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bank: 0,
      validuser: false,
      openChat: false,
      pchat: [],
      socket: null,
      message: [],
      chats: [],
      userAdmin: false,
      userMod: false,
      userLevel: 1,
      pageWidth: "calc(100vw - 400px)",
      clientSeed: null,
      houseEdge: null,
      casino: true,
      chatOpen: true,
      rows: [],
      rowsToGet: 10,
      curTable: 0,
    };

    this.setPageWidth = this.setPageWidth.bind(this);
    this.getRows = this.getRows.bind(this);
    this.getBank = this.getBank.bind(this);
    this.updateTable = this.updateTable.bind(this);

    this.windowResize = this.windowResize.bind(this);
  }

  checkAdmin = () => {
    fetch(
      `${window.baseURL}/checkAdmin/` + window.localStorage.getItem("token")
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.level > 1) {
          //Admin
          this.setState({ userMod: true });
        }
        this.setState({ userLevel: data.level, validuser: true });
      });
  };

  componentDidMount() {
    console.log(
      "%cThis is a browser feature intended for developers. Do not paste any code here given to you by someone else. It may compromise your account or have other negative side effects!",
      "color: #ff5555; font-size: 20px"
    );
    this.initSocket();
    fetch(
      `${window.baseURL}/checkValidUser/` + window.localStorage.getItem("token")
    )
      .then((response) => response.json())
      .then((data) => {
        if (data === false) {
          this.setState({ bank: 0, validuser: false });
        } else {
          this.checkAdmin();
          this.initBank();
        }
      });
    var newClient = makeSeed(32);
    this.setState({
      clientSeed: newClient,
    });
    window.localStorage.setItem("client", newClient);

    window.addEventListener("resize", this.windowResize);
    this.windowResize();
  }

  windowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (width < 1300) {
      this.setPageWidth(false);
    } else {
      this.setPageWidth(true);
    }
  }

  initSocket = async () => {
    const socket = clientSocket(`${window.baseURL}`);
    await this.setState({ socket });
    socket.on("gotEdge", (edge) => {
      this.setState({ houseEdge: edge });
    });
    socket.on("updateMoney", () => {
      this.initBank();
    });
    socket.on("newRow", () => {
      this.getRows();
    });
    socket.on("50m", (username, winnings, game) => {
      fetch(`${window.baseURL}/chat/newMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: window.localStorage.token,
          message: `User ${username} just won ${Millify(winnings)} on ${game}`,
          systemMessage: true,
        }),
      }).then(() => {
        socket.emit(COMMUNITY_CHAT);
      });
    });
    this.setUser({ name: window.localStorage.getItem("name") }, socket);
    socket.on(USER_DISCONNECTED, this.checkForPC);
    this.getHouseEdge(socket);
    this.getRows();
  };

  updateTable() {
    const socket = this.state.socket;
    socket.emit("getRows");
  }

  async getRows(table) {
    if (table === 2) {
      Axios.post(
        `${window.baseURL}/games/getScoresData/${this.state.rowsToGet + 1}`,
        { table: 2 }
      ).then((response) => {
        if (response.data === this.state.rows) {
          return;
        }
        this.setState({ rows: response.data });
      });
    } else if (table === 1) {
      Axios.post(
        `${window.baseURL}/games/getScoresData/${this.state.rowsToGet + 1}`,
        { table: 1, token: window.localStorage.getItem("token") }
      ).then((response) => {
        if (response.data === this.state.rows) {
          return;
        }
        this.setState({ rows: response.data });
      });
    } else {
      Axios.post(
        `${window.baseURL}/games/getScoresData/${this.state.rowsToGet + 1}`,
        { table: 0 }
      ).then((response) => {
        if (response.data === this.state.rows) {
          return;
        }
        this.setState({ rows: response.data });
      });
    }
  }

  getHouseEdge(socket) {
    socket.emit("getEdge");
    socket.on("gotEdge", (edge) => {
      this.setState({ houseEdge: edge });
    });
  }

  setUser = (user, socket) => {
    socket.emit(USER_CONNECTED, user);
    this.setState({ user });
  };

  async initBank() {
    await fetch(
      `${window.baseURL}/userCash/` + window.localStorage.getItem("token")
    )
      .then((response) => response.json())
      .then((data) => {
        if (data !== false) {
          if (this.state.bank !== data.cash)
            this.setState({ bank: data.cash, validuser: true });
        } else {
          this.setState({ validuser: false });
          window.localStorage.clear();
        }
      });
  }

  handleBank = async (valueChange) => {
    if (this.state.bank + valueChange < 0) {
      this.setState({ bank: 0 });
    } else {
      await this.setState({ bank: this.state.bank + valueChange });
      fetch(
        `${window.baseURL}/setUserCash/` + window.localStorage.getItem("token"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cash: this.state.bank,
          }),
        }
      );
    }
  };

  setPageWidth(isChat) {
    if (!isChat) {
      this.setState({ pageWidth: "100vw", chatOpen: false });
    } else {
      this.setState({ pageWidth: "calc(100vw - 400px)", chatOpen: true });
    }

    var elem = document.getElementById("purechat-container");
    if (elem) {
      setTimeout(() => this.checkPChatPos(elem), 10);
    }
  }

  checkPChatPos(elem) {
    var elem1, elem2;
    elem2 = elem.getElementsByClassName(
      "purechat-launcher-frame-bottom-right"
    )[0];
    elem1 = elem.getElementsByClassName(
      "purechat-messenger-frame-bottom-right"
    )[0];

    var chat = this.state.chatOpen;

    var stop = false;
    if (elem1 !== undefined && elem1 !== null) {
      if (chat) {
        elem1.style.right = 410 + "px";
        elem1.style.bottom = `${0}px`;
      } else {
        elem1.style.right = 10 + "px";
        elem1.style.bottom = `${0}px`;
      }

      stop = true;
    }
    if (elem2 !== undefined && elem2 !== null) {
      if (chat) {
        elem2.style.right = 410 + "px";
        elem2.style.bottom = `${0}px`;
      } else {
        elem2.style.right = 10 + "px";
        elem2.style.bottom = `${0}px`;
      }
      stop = true;
    }
    if (!stop) {
      requestAnimationFrame(() => this.checkPChatPos(elem));
    }
  }

  setClient(value) {
    this.setState({
      clientSeed: value,
    });
  }

  getBank() {
    Axios.get(
      `${window.baseURL}/userCash/${window.localStorage.getItem("token")}`
    ).then((response) => {
      this.setState({ bank: response.data.cash });
    });
  }

  render() {
    return (
      <Router>
        <div className="page">
          <NavBar
            bank={this.state.bank}
            setBank={this.handleBank}
            validuser={this.state.validuser}
            deposit={this.handleDepositWithdraw}
            userAdmin={this.state.userAdmin}
            userMod={this.state.userMod}
            pageWidth={this.state.pageWidth}
            chatOpen={this.state.chatOpen}
            casino={this.state.casino}
            openChat={() => this.setPageWidth(true)}
          />
          <ChatTab
            socket={this.state.socket}
            setWidth={this.setPageWidth}
            chatOpen={this.state.chatOpen}
            casino={this.state.casino}
            bank={this.state.bank}
            setBank={this.handleBank}
            mod={this.state.userAdmin || this.state.userMod}
            getBank={this.getBank}
          />
        </div>
        <Switch>
          <Route exact path="/">
            <Home
              pageWidth={this.state.pageWidth}
              socket={this.state.socket}
              rows={this.state.rows}
              getNewRows={async (newRows, table) => {
                await this.setState({ rowsToGet: newRows });
                this.getRows(table);
              }}
              validuser={this.state.validuser}
            />
          </Route>
          <Route exact path="/admin">
            {this.state.userMod ? (
              <ModPage
                level={this.state.userLevel}
                pageWidth={this.state.pageWidth}
                socket={this.state.socket}
              />
            ) : (
              <div className="dice-page">You Should Not Be Here</div>
            )}
          </Route>
          <Route
            exact
            path="/dice"
            render={(props) => (
              <Dice
                bank={this.state.bank}
                setBank={this.handleBank}
                clientSeed={this.state.clientSeed}
                houseEdge={this.state.houseEdge}
                socket={this.state.socket}
                pageWidth={this.state.pageWidth}
                deposit={this.handleDepositWithdraw}
                setClient={this.setClient.bind(this)}
                updateTable={this.updateTable}
                getRows={this.getRows}
                rows={this.state.rows}
                getNewRows={async (newRows, table) => {
                  await this.setState({ rowsToGet: newRows });
                  this.getRows(table);
                }}
                validuser={this.state.validuser}
              />
            )}
          />
          <Route
            exact
            path="/plinko"
            render={(props) => (
              <Plinko
                bank={this.state.bank}
                setBank={this.handleBank}
                clientSeed={this.state.clientSeed}
                houseEdge={this.state.houseEdge}
                socket={this.state.socket}
                pageWidth={this.state.pageWidth}
                deposit={this.handleDepositWithdraw}
                setClient={this.setClient.bind(this)}
                updateTable={this.updateTable}
                getRows={this.getRows}
                rows={this.state.rows}
                getNewRows={async (newRows, table) => {
                  await this.setState({ rowsToGet: newRows });
                  this.getRows(table);
                }}
                validuser={this.state.validuser}
              />
            )}
          />
          <Route
            exact
            path="/login"
            render={() => <Login pageWidth={this.state.pageWidth} />}
          />
          <Route exact path="/login/resetPassword">
            <ForgotPassword />
          </Route>
          <Route
            exact
            path="/register"
            render={() => <Register pageWidth={this.state.pageWidth} />}
          />
          <Route
            exact
            path="/coinDuels"
            render={() => (
              <CoinDuels
                bank={this.state.bank}
                setBank={this.handleBank}
                clientSeed={this.state.clientSeed}
                houseEdge={this.state.houseEdge}
                socket={this.state.socket}
                pageWidth={this.state.pageWidth}
                updateTable={this.updateTable}
                getRows={this.getRows}
                rows={this.state.rows}
                getNewRows={async (newRows, table) => {
                  await this.setState({ rowsToGet: newRows });
                  this.getRows(table);
                }}
                validuser={this.state.validuser}
                getBank={this.getBank}
              />
            )}
          />
          <Route
            exact
            path="/blackjack"
            render={() => (
              <BlackJack
                setBank={this.handleBank}
                houseEdge={this.state.houseEdge}
                bank={this.state.bank}
                clientSeed={this.state.clientSeed}
                setClient={this.setClient.bind(this)}
                updateTable={this.updateTable}
                getRows={this.getRows}
                socket={this.state.socket}
                rows={this.state.rows}
                getNewRows={async (newRows, table) => {
                  await this.setState({ rowsToGet: newRows });
                  this.getRows(table);
                }}
                validuser={this.state.validuser}
              />
            )}
          />
          <Route
            exact
            path="/roulette"
            render={() => (
              <Roulette
                setBank={this.handleBank}
                houseEdge={this.state.houseEdge}
                bank={this.state.bank}
                clientSeed={this.state.clientSeed}
                setClient={this.setClient.bind(this)}
                updateTable={this.updateTable}
                getRows={this.getRows}
                socket={this.state.socket}
                rows={this.state.rows}
                getNewRows={async (newRows, table) => {
                  await this.setState({ rowsToGet: newRows });
                  this.getRows(table);
                }}
                validuser={this.state.validuser}
              />
            )}
          />
          <Route exact path="/settings">
            <Settings />
          </Route>
          <Route path="/:id">
            <ResetPassword />
          </Route>
        </Switch>
        <div className="footer" style={{ width: this.state.pageWidth }}>
          <div className="footer-logo">
            <img src={logo} className="logo" />
          </div>
          {window.innerWidth > 950 && (
            <div className="footer-text">
              © 2020 by RuneEmpire.com All Rights Reserved. We are not
              affiliated with Jagex LTD© or Runescape© By creating an account,
              depositing or withdrawing you are agreeing to the Terms Of
              Service. <br /> Help · Terms Of Service / Privacy · FAQ · Status
            </div>
          )}
        </div>
      </Router>
    );
  }
}
export default App;
