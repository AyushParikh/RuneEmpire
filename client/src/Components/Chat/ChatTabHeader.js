import React from "react";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";

import "../../Style/ChatTabHeader.css";

export default class ChatTabHeader extends React.Component {
  render() {
    return (
      <div className="chat-nav-bar">
        <div className="chat-icon" onClick={this.props.hideChat}>
          <ChatBubbleIcon />
          <hr className="chat-icon-line" />
        </div>
      </div>
    );
  }
}
