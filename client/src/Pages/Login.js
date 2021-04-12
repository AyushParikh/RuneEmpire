import React from "react";
import TextField from "@material-ui/core/TextField";
import Link from "react-router-dom/Link";

import "../Style/Login.css";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      error: false,
    };
  }

  handleUsername = (e) => {
    this.setState({ username: e.target.value });
  };

  handlePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  submitLogin = async () => {
    await fetch(`${window.baseURL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data !== false) {
          window.localStorage.setItem("token", data.token);
          window.localStorage.setItem("name", this.state.username);
          window.location = "/";
        } else {
          this.setState({ error: true });
        }
      });
  };

  submitWithEnter = (e) => {
    if (e.keyCode === 13) {
      this.submitLogin();
    }
  };

  render() {
    return (
      <div className="login-page" style={{ width: this.props.pageWidth }}>
        <h1 className="login-title">Login</h1>
        <div
          className="error-text"
          style={{ display: this.state.error ? "block" : "none" }}
        >
          Wrong Username or Password!
        </div>
        <div className="username">
          <TextField
            error={this.state.error}
            label="Username"
            className="username-input"
            value={this.state.username}
            onChange={this.handleUsername}
          />
        </div>
        <div className="password">
          <TextField
            error={this.state.error}
            value={this.state.password}
            onChange={this.handlePassword}
            label="Password"
            className="password-input"
            type="password"
            onKeyDown={this.submitWithEnter}
          />
        </div>
        <div className="login-button-wrapper">
          <Link to="/login/resetPassword">Forgot password?</Link>
          <button className="login-button" onClick={this.submitLogin}>
            Login
          </button>
        </div>
      </div>
    );
  }
}
