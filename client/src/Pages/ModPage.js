import React from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import millify from "millify";
import Swal from "sweetalert2";
import InputAdornment from "@material-ui/core/InputAdornment";

import "../Style/ModPage.css";

export default class ModPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      moneyUser: "",
      moneyAmount: 0,
      userMoney: null,
      sameUser: false,
      muteValid: false,
      muteUsername: "",
      levelValid: false,
      levelUsername: "",
      curLevel: "",
      houseEdge: 0,
      newEdge: 0,
      betMil: true,
    };

    this.searchForUser = this.searchForUser.bind(this);
    this.muteUserCheck = this.muteUserCheck.bind(this);
    this.levelUserCheck = this.levelUserCheck.bind(this);
    this.getEdge = this.getEdge.bind(this);
  }

  componentDidMount() {
    setTimeout(this.getEdge, 100);
  }

  getEdge() {
    const { socket } = this.props;
    socket.emit("getEdge");
    socket.on("gotEdge", (edge) => {
      this.setState({ houseEdge: edge });
    });
  }

  handleNumberStrings = (string) => {
    var finalString = string.toString().toLowerCase();
    finalString = finalString.replace("t", "000000000000");
    finalString = finalString.replace("b", "000000000");
    finalString = finalString.replace("m", "000000");
    finalString = finalString.replace("k", "000");
    return finalString;
  };

  handleAmount = async (e) => {
    var finalString = e.target.value;

    if (parseFloat(finalString) > 999999999999999) {
      return;
    }

    this.setState({
      moneyAmount: finalString,
    });
  };

  submitBalanceWithEnter = (e) => {
    if (e.keyCode === 13) {
      this.searchForUser();
    }
  };

  searchForUser() {
    fetch(`${window.baseURL}/getUserBalance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.moneyUser,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.noUser) {
          Swal.fire({
            title: "No User With This Name",
            text: "Please enter a valid username",
            icon: "error",
            background: "var(--background)",
            confirmButtonText: "Okay",
          });
        } else {
          this.setState({ userMoney: data.balance, sameUser: true });
        }
      });
  }

  handleMoney = (addFunds) => {
    var finalString = this.handleNumberStrings(this.state.moneyAmount);
    if (this.state.sameUser) {
      if (parseFloat(finalString) <= this.state.userMoney || addFunds) {
        const { socket } = this.props;
        socket.emit("changeBalance", {
          user: this.state.moneyUser,
          money: addFunds ? parseFloat(finalString) : parseFloat(-finalString),
        });
        socket.on("moneyChanged", (money) => {
          Swal.fire({
            title: "User Balance Changed",
            icon: "success",
            background: "var(--background)",
            confirmButtonText: "Okay",
          });
          this.searchForUser();
        });
      } else {
        Swal.fire({
          title: "User Does Not Have This Much Money!",
          text: "Please enter a valid amount",
          icon: "error",
          background: "var(--background)",
          confirmButtonText: "Okay",
        });
      }
    } else {
      Swal.fire({
        title: "This is Not the Original User!",
        text: "Please enter the correct user",
        icon: "error",
        background: "var(--background)",
        confirmButtonText: "Okay",
      });
    }
  };

  submitMuteWithEnter = (e) => {
    if (e.keyCode === 13) {
      this.muteUserCheck();
    }
  };

  muteUserCheck() {
    fetch(`${window.baseURL}/validUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.muteUsername,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === true) {
          this.setState({ muteValid: true });
        } else {
          this.setState({ muteValid: false });
          Swal.fire({
            title: "No User With This Name",
            text: "Please enter a valid username",
            icon: "error",
            background: "var(--background)",
            confirmButtonText: "Okay",
          });
        }
      });
  }

  submitLevelWithEnter = (e) => {
    if (e.keyCode === 13) {
      this.levelUserCheck();
    }
  };

  levelUserCheck() {
    fetch(`${window.baseURL}/validUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.levelUsername,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === true) {
          this.setState({ levelValid: true });
        } else {
          this.setState({ levelValid: false });
          Swal.fire({
            title: "No User With This Name",
            text: "Please enter a valid username",
            icon: "error",
            background: "var(--background)",
            confirmButtonText: "Okay",
          });
        }
      });
  }

  handleMute = (oneDay) => {
    fetch(`${window.baseURL}/muteUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.muteUsername,
        time: oneDay ? 86400 : 3600,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.fire({
          title: "User Muted",
          icon: "success",
          background: "var(--background)",
          confirmButtonText: "Okay",
        });
      });
  };

  unMute = () => {
    fetch(`${window.baseURL}/muteUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.muteUsername,
        time: 0,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.fire({
          title: "User Unmuted",
          icon: "success",
          background: "var(--background)",
          confirmButtonText: "Okay",
        });
      });
  };

  handleEdge = () => {
    if (parseFloat(this.state.newEdge) >= 0) {
      const { socket } = this.props;
      socket.emit("changeEdge", this.state.newEdge);
      this.getEdge();
      Swal.fire({
        title: "Edge Changed",
        icon: "success",
        background: "var(--background)",
        confirmButtonText: "Okay",
      });
    }
  };

  changeLevel = () => {
    if (this.state.levelUsername !== window.localStorage.getItem("name")) {
      fetch(`${window.baseURL}/changeUserLevel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.state.levelUsername,
          level: this.state.curLevel,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            Swal.fire({
              title: "User Level Changed",
              icon: "success",
              background: "var(--background)",
              confirmButtonText: "Okay",
            });
          }
        });
    } else {
      Swal.fire({
        title: "You Cannot Change Your Own Level!",
        text: "Please enter a valid user",
        icon: "error",
        background: "var(--background)",
        confirmButtonText: "Okay",
      });
    }
  };

  render() {
    const levels = [
      {
        value: "4",
        label: "Admin",
        levelNeeded: 4,
      },
      {
        value: "3",
        label: "High-Mod",
        levelNeeded: 4,
      },
      {
        value: "2",
        label: "Low-Mod",
        levelNeeded: 3,
      },
      {
        value: "1",
        label: "User",
        levelNeeded: 2,
      },
    ];
    return (
      <div className="mod-page" style={{ width: this.props.pageWidth }}>
        {this.props.level > 2 && (
          <>
            <div className="mod-change-balance">
              <div className="mod-header">Change User Balance</div>
              <div className="mod-body">
                <div className="mod-input">
                  <TextField
                    type="text"
                    label="Username"
                    value={this.state.moneyUser}
                    onChange={(e) =>
                      this.setState({
                        moneyUser: e.target.value,
                        sameUser: false,
                      })
                    }
                    onKeyDown={this.submitBalanceWithEnter}
                  />
                  <button className="search-user" onClick={this.searchForUser}>
                    Search User
                  </button>
                </div>
                <div className="mod-input">
                  <TextField
                    type="text"
                    label="Amount"
                    value={this.state.moneyAmount}
                    onChange={this.handleAmount}
                  />
                  {this.state.userMoney !== null && (
                    <>
                      <div className="user-balance-text">
                        Total User Balance:
                      </div>
                      <div className="user-balance">
                        {millify(this.state.userMoney)}
                      </div>
                    </>
                  )}
                </div>
                <button
                  className="mod-button"
                  onClick={() => this.handleMoney(true)}
                >
                  Add
                </button>
                <button
                  className="mod-button"
                  onClick={() => this.handleMoney(false)}
                >
                  Remove
                </button>
              </div>
            </div>
            <hr />
            <div className="change-user-level">
              <div className="mod-header">Change Users Level</div>
              <div className="mod-body">
                <div className="mod-input">
                  <TextField
                    type="text"
                    label="Username"
                    value={this.state.levelUsername}
                    onChange={(e) =>
                      this.setState({ levelUsername: e.target.value })
                    }
                    onKeyDown={this.submitLevelWithEnter}
                  />
                  {this.state.levelValid && (
                    <div className="mute-user-valid">User Valid</div>
                  )}
                  <button className="search-user" onClick={this.levelUserCheck}>
                    Check Valid
                  </button>
                </div>
                <div className="mod-input">
                  <TextField
                    id="standard-select-currency"
                    select
                    label="Select"
                    value={this.state.curLevel}
                    onChange={(e) =>
                      this.setState({ curLevel: e.target.value })
                    }
                    helperText="Please Select New User Level"
                  >
                    {levels.map(
                      (option) =>
                        this.props.level >= option.levelNeeded && (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        )
                    )}
                  </TextField>
                </div>
                <button
                  className="mod-button"
                  onClick={() => this.changeLevel()}
                >
                  Submit
                </button>
              </div>
            </div>
            <hr />
          </>
        )}
        {this.props.level > 1 && (
          <>
            <div className="mute-user">
              <div className="mod-header">Mute A User</div>
              <div className="mod-body">
                <div className="mod-input">
                  <TextField
                    type="text"
                    label="Username"
                    value={this.state.muteUsername}
                    onChange={(e) =>
                      this.setState({ muteUsername: e.target.value })
                    }
                    onKeyDown={this.submitMuteWithEnter}
                  />
                  {this.state.muteValid && (
                    <div className="mute-user-valid">User Valid</div>
                  )}
                  <button className="search-user" onClick={this.muteUserCheck}>
                    Check Valid
                  </button>
                </div>
                <div className="mute-spacer" />
                <button
                  className="mod-button"
                  onClick={() => this.handleMute(false)}
                >
                  Mute
                </button>
                <button
                  className="mod-button"
                  onClick={() => this.handleMute(true)}
                >
                  Mute for 24h
                </button>
                <button className="mod-button" onClick={() => this.unMute()}>
                  Unmute
                </button>
              </div>
            </div>
            <hr />
          </>
        )}
        {this.props.level === 4 && (
          <>
            <div className="change-House">
              <div className="mod-header">House Edge</div>
              <div className="mod-body house">
                <div className="mod-input">
                  <TextField
                    InputProps={{ readOnly: true }}
                    label="Current Edge"
                    value={this.state.houseEdge}
                    InputProps={{
                      endAdornment: <div>%</div>,
                    }}
                  />
                </div>
                <div className="mod-input">
                  <TextField
                    type="text"
                    label="New Edge"
                    value={this.state.newEdge}
                    InputProps={{
                      endAdornment: <div>%</div>,
                    }}
                    onChange={(e) => {
                      if (isNaN(e.target.value)) {
                        this.setState({ newEdge: this.state.newEdge });
                      } else {
                        if (
                          (parseFloat(e.target.value) <= 100 &&
                            parseFloat(e.target.value) >= 0) ||
                          e.target.value === ""
                        ) {
                          this.setState({ newEdge: e.target.value });
                        } else {
                          this.setState({ newEdge: this.state.newEdge });
                        }
                      }
                    }}
                  />
                </div>
                <button className="mod-button" onClick={this.handleEdge}>
                  Change Edge
                </button>
              </div>
            </div>
            <hr />
            <button
              onClick={() => {
                if (
                  window.confirm("THIS WILL TAKE A LONG TIME. Are you sure?")
                ) {
                  const { socket } = this.props;
                  socket.emit("GenerateCrashSeeds", 1000); //TODO Generate proper ammount of seeds
                }
              }}
            >
              Create Seeds
            </button>
            <br />
            <br />
          </>
        )}
      </div>
    );
  }
}
