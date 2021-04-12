import React from "react";
import TextField from "@material-ui/core/TextField";

import "../Style/Login.css";

export default class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      confirmPass: "",
      email: "",
      usernameTaken: false,
      lengthWrong: false,
      notEmail: false,
      passwordsDiff: false,
      error: false,
    };
  }

  handleUsername = (e) => {
    this.setState({ username: e.target.value });
  };

  handlePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  handleEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  validateEmail(email) {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  }

  //TODO check if user already exsists
  submitRegister = async () => {
    this.setState({
      usernameTaken: false,
      lengthWrong: false,
      notEmail: false,
      passwordsDiff: false,
      error: false,
    });
    if (this.state.username.length > 3 && this.state.password.length > 5) {
      if (!this.validateEmail(this.state.email)) {
        this.setState({ notEmail: true, error: true });
        return;
      }
      if (this.state.password !== this.state.confirmPass) {
        this.setState({ passwordsDiff: true, error: true });
        return;
      }
      var user = await fetch(`${window.baseURL}/createUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
          email: this.state.email,
          level: 1,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data === true) {
            this.login();
          } else {
            this.setState({ usernameTaken: true, error: true });
          }
        });
    } else {
      this.setState({ lengthWrong: true, error: true });
    }
  };

  login = async () => {
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
      this.submitRegister();
    }
  };

  render() {
    return (
      <div className="login-page" style={{ width: this.props.pageWidth }}>
        <h1 className="login-title">Register</h1>
        {this.state.usernameTaken && (
          <div style={{ color: "red", textAlign: "center" }}>
            Username Is Already In Use!
          </div>
        )}
        {this.state.passwordsDiff && (
          <div style={{ color: "red", textAlign: "center" }}>
            Passwords Do Not Match!
          </div>
        )}
        {this.state.notEmail && (
          <div style={{ color: "red", textAlign: "center" }}>
            Please Enter A Valid Email!
          </div>
        )}
        {this.state.lengthWrong && (
          <div style={{ color: "red", textAlign: "center" }}>
            Password Must Contain At Least 5 Characters
          </div>
        )}
        <div className="username">
          <TextField
            error={this.state.error}
            label="Username"
            className="username-input"
            value={this.state.username}
            onChange={this.handleUsername}
          />
        </div>
        <div className="email">
          <TextField
            error={this.state.error}
            value={this.state.email}
            onChange={this.handleEmail}
            label="Email"
            className="email-input"
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
          />
        </div>
        <div className="password">
          <TextField
            error={this.state.error}
            value={this.state.confirmPass}
            onChange={(e) => this.setState({ confirmPass: e.target.value })}
            label="Confirm Password"
            className="password-input"
            type="password"
            onKeyDown={this.submitWithEnter}
          />
        </div>
        <div className="register-button-wrapper">
          <button className="register-button" onClick={this.submitRegister}>
            Register
          </button>
        </div>
      </div>
    );
  }
}
