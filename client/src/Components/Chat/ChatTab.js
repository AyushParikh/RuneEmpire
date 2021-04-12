import React from "react";
import ChatHeader from "./ChatTabHeader";
import ChatFooter from "./ChatFooter";
import socketIOClient from "socket.io-client";
import { USER_CONNECTED, COMMUNITY_CHAT } from "../Events";
import ChatIcon from "@material-ui/icons/ChatBubbleOutline";

import rain from "../../Images/rain.gif";

import "../../Style/ChatTab.css";
import { swal } from "sweetalert2/dist/sweetalert2";

export default class ChatTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      newMessage: false,
      user: null,
      raining: false,
    };

    this.hideChat = this.hideChat.bind(this);
  }

  initSocket = () => {
    const { socket } = this.props;
    socket.on("FromAPI", (data) => {
      if (data.length > this.state.messages.length) {
        this.setState({ newMessage: true });
      } else {
        this.setState({ newMessage: false });
      }
      this.setState({ messages: data });
      var elem = document.getElementsByClassName("chat-content")[0];
      if (elem !== undefined) {
        if (
          elem.scrollTop >= elem.scrollHeight - elem.offsetHeight - 200 &&
          this.state.newMessage
        ) {
          elem.scrollTop = elem.scrollHeight;
        }
      }
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.initSocket();
      var elem = document.getElementById("chat-content");
      if (elem !== undefined && elem !== null) {
        elem.scrollTop = elem.scrollHeight;
      }
    }
  }

  componentDidMount() {
    setTimeout(() => {
      var elem = document.getElementById("chat-content");
      if (elem !== undefined && elem !== null) {
        elem.scrollTop = elem.scrollHeight;
      }
      const { socket } = this.props;
      socket.on("makeitrain", (error) => {
        if (!error) {
          this.setState({ raining: true });
          this.props.getBank();
          window.setTimeout(() => {
            this.setState({ raining: false });
            var money = document.getElementById("raining");
            if (money) {
              money.src = rain;
            }
          }, 4500);
        } else {
          this.props.getBank();
        }
      });
    }, 200);
  }

  async hideChat() {
    this.props.setWidth(!this.props.chatOpen);
  }

  render() {
    return this.props.casino && this.props.chatOpen ? (
      <div className="chat-wrapper">
        <ChatHeader hideChat={this.hideChat} />

        <div id="chat-content">
          {this.state.messages.map((message, i) => (
            <div className="message" key={i}>
              <div
                className="message-user"
                key={i}
                style={{
                  color:
                    message.username === window.localStorage.getItem("name")
                      ? "var(--user-color)"
                      : "var(--global-white)",
                }}
              >
                {message.username}
              </div>
              <div className="message-text" style={{ color: "white" }}>
                {message.message}
              </div>
            </div>
          ))}
        </div>

        <ChatFooter
          socket={this.props.socket}
          user={this.state.user}
          bank={this.props.bank}
          setBank={this.props.setBank}
          mod={this.props.mod}
        />

        <div
          className="make-it-rain"
          style={{ display: this.state.raining ? "block" : "none" }}
        >
          <img src={rain} id="raining" />
        </div>
      </div>
    ) : (
      <div className="chat-closed" style={{ zIndex: "999999999" }}>
        <ChatIcon onClick={this.hideChat} style={{ cursor: "pointer" }} />
      </div>
    );
  }
}
