import React from "react";
import logo from "../Images/Logo.png";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChatIcon from "@material-ui/icons/ChatBubble";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import millify from "millify";

import "../Style/NavBar.css";
import { Link } from "react-router-dom";

const timeoutLength = 100;

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: false,
      totalWagered: 0,
      loggedIn: false,
      userMod: false,
      pageWidth: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      if (this.props.validuser === true) {
        this.setState({ loggedIn: true });
      }
      if (this.props.userMod) {
        this.setState({ userMod: true });
      }
      if (this.props.casino) this.setState({ pageWidth: this.props.pageWidth });
      else this.setState({ pageWidth: "100vw" });
    }
  }

  handleClick = (event) => {
    this.setState({ menu: !this.state.menu });
  };

  logout = () => {
    this.setState({ loggedIn: !this.state.loggedIn, menu: false });
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("name");
    window.location.reload();
  };

  render() {
    const open = this.state.mouseOverButton || this.state.mouseOverMenu;
    return (
      <div className="nav-bar" style={{ width: this.state.pageWidth }}>
        <Link className="logo-wrapper" to="/">
          <img src={logo} alt="" className="oscasino-img" />
        </Link>
        {this.state.loggedIn ? (
          <div className="nav-contents">
            <li
              className="link"
              style={{
                display: this.props.casino ? "flex" : "none",
                cursor: "default",
              }}
            >
              <div style={{ textDecoration: "none" }}>
                {millify(this.props.bank)}
              </div>
              <div
                className="link-hover purechat-button-expand"
                onMouseEnter={this.enterButton}
                onMouseLeave={this.leaveButton}
                onClick={this.props.deposit}
                style={{
                  cursor: "pointer",
                }}
              >
                Deposit
              </div>
            </li>
            <ClickAwayListener
              onClickAway={() => this.setState({ menu: false })}
            >
              <div className="menu">
                <Button
                  id="menu-button"
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={this.handleClick}
                >
                  <MenuIcon />
                </Button>

                <div
                  className="menu-wrapper"
                  style={{ display: this.state.menu ? "block" : "none" }}
                >
                  <ul className="menu-items">
                    {this.state.userMod && (
                      <Link
                        className="menu-item"
                        style={{ textDecoration: "none" }}
                        to="/admin"
                      >
                        <SupervisorAccountIcon
                          style={{
                            position: "relative",
                            float: "left",
                            margin: "5px 5px",
                            width: 20,
                            height: 20,
                          }}
                        />
                        <div className="menu-item-text">Admin</div>
                      </Link>
                    )}
                    <Link
                      className="menu-item"
                      style={{ textDecoration: "none" }}
                      to="/settings"
                    >
                      <SettingsIcon
                        style={{
                          position: "relative",
                          float: "left",
                          margin: "5px 5px",
                          width: 20,
                          height: 20,
                        }}
                      />
                      <div className="menu-item-text">Settings</div>
                    </Link>
                    <button
                      className="menu-item"
                      style={{ textDecoration: "none" }}
                      onClick={this.logout}
                    >
                      <ExitToAppIcon
                        style={{
                          position: "relative",
                          float: "left",
                          margin: "5px 5px",
                          width: 20,
                          height: 20,
                        }}
                      />
                      <div className="menu-item-text">Logout</div>
                    </button>
                  </ul>
                </div>
              </div>
            </ClickAwayListener>
          </div>
        ) : (
          <div className="login-direct">
            <Link to="/Login" className="login-direct-button">
              LogIn
            </Link>
            <Link to="/register" className="register-direct-button">
              Register
            </Link>
          </div>
        )}
      </div>
    );
  }
}
