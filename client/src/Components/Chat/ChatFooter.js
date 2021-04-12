import React from "react";
import { Button, TextField } from "@material-ui/core";
import { COMMUNITY_CHAT } from "../Events";
import Swal from "sweetalert2";

import "../../Style/ChatFooter.css";

export default class ChatFooter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textValue: 0,
      message: "",
      help: null,
    };
  }

  submitMessage = (overWriteMessage) => {
    const { socket } = this.props;
    if (this.state.message.length > 0) {
      fetch(`${window.baseURL}/chat/newMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: window.localStorage.token,
          message: overWriteMessage || this.state.message,
          systemMessage: overWriteMessage ? true : false,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.userMuted) {
            Swal.fire({
              title: "You are Muted",
              text: "Please come back after your account had been released",
              icon: "error",
              background: "var(--background)",
              confirmButtonText: "Okay",
            });
          }
          if (data !== false) {
            this.setState({ message: "", textValue: 0 });
            socket.emit(COMMUNITY_CHAT);
          } else {
            window.location = "/login";
          }
        });
    }
  };

  handleNumberString = (string) => {
    var finalString = string.toString().toLowerCase();
    finalString = finalString.replace("t", "000000000000");
    finalString = finalString.replace("b", "000000000");
    finalString = finalString.replace("m", "000000");
    finalString = finalString.replace("k", "000");
    return finalString;
  };

  tipUser(username, amount) {
    const { socket } = this.props;
    fetch(`${window.baseURL}/getUserBalance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
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
        } else if (username === window.localStorage.getItem("name")) {
          Swal.fire({
            title: "Cannot Tip Yourself",
            text: "Please enter a valid username",
            icon: "error",
            background: "var(--background)",
            confirmButtonText: "Okay",
          });
        } else {
          var finalString = this.handleNumberString(amount);
          if (this.props.bank - parseFloat(finalString) > 0) {
            socket.emit("changeBalance", {
              user: username,
              money: parseFloat(finalString),
            });
            this.props.setBank(-parseFloat(finalString));
            socket.on("moneyChanged", (money) => {
              Swal.fire({
                title: "User Tipped",
                icon: "success",
                background: "var(--background)",
                confirmButtonText: "Okay",
              });
              this.submitMessage(
                `${window.localStorage.getItem(
                  "name"
                )} has tipped ${username} for ${amount}`
              );
            });
          } else {
            Swal.fire({
              title: "You dont have the money",
              icon: "error",
              background: "var(--background)",
              confirmButtonText: "Okay",
            });
          }
        }
      });
  }

  muteUser(username, muteTime) {
    const { socket } = this.props;
    fetch(`${window.baseURL}/getUserBalance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
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
        } else if (username === window.localStorage.getItem("name")) {
          Swal.fire({
            title: "Cannot Mute Yourself",
            text: "Please enter a valid username",
            icon: "error",
            background: "var(--background)",
            confirmButtonText: "Okay",
          });
        } else {
          fetch(`${window.baseURL}/muteUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: username,
              time: muteTime * 60,
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
              this.setState({ message: "" });
            });
        }
      });
  }

  rain(amount, number) {
    const { socket } = this.props;
    socket.emit(
      "rain",
      this.handleNumberString(amount),
      number,
      window.localStorage.getItem("token")
    );
  }

  keyEvents = (keyCode, value) => {
    var command = value.split(" ");
    if (command[0] === "/tip") {
      this.setState({ help: "/tip [username] [ammount]" });
    } else if (this.props.mod && command[0] === "/mute") {
      this.setState({ help: "/mute [username] [time minutes]" });
    } else if (command[0] === "/rain") {
      this.setState({ help: "/rain [amount] [num people to receive]" });
    } else {
      this.setState({ help: null });
    }
    if (keyCode === 13) {
      if (command[0] === "/tip") {
        if (command[1] && command[2]) {
          this.tipUser(command[1], command[2]);
        } else {
          Swal.fire({
            title: "Input Values Invalid",
            icon: "error",
          });
        }
      } else if (this.props.mod && command[0] === "/mute") {
        if (command[1] && command[2]) {
          this.muteUser(command[1], command[2]);
        } else {
          Swal.fire({
            title: "Input Values Invalid",
            icon: "error",
          });
        }
      } else if (command[0] === "/rain") {
        if (command[1] && command[2]) {
          this.rain(command[1], command[2]);
          this.setState({ message: "", help: "" });
        } else {
          Swal.fire({
            title: "Input Values Invalid",
            icon: "error",
          });
        }
      } else {
        this.submitMessage();
      }
    }
  };

  render() {
    return (
      <div className="chat-footer">
        <div className="chat-text-area-wrapper">
          <TextField
            className="chat-text-area"
            placeholder="Type a message..."
            value={this.state.message}
            onChange={(e) => {
              if (e.target.value.length <= 200)
                this.setState({
                  message: e.target.value,
                  textValue: e.target.value.length,
                });
              this.keyEvents(e.keyCode, e.target.value);
            }}
            helperText={this.state.help}
            onKeyDown={(e) => this.keyEvents(e.keyCode, e.target.value)}
          />
        </div>
        <div className="under-chat-text">
          <div className="char-count">{this.state.textValue}/200</div>
          <div className="send">
            <Button onClick={() => this.keyEvents(13, this.state.message)}>
              Send
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
