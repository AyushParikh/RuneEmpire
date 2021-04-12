import React from "react";
import TextField from "@material-ui/core/TextField";
import Link from "react-router-dom/Link";
import Swal from "sweetalert2/dist/sweetalert2.js";

import "../Style/Login.css";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      error: false,
    };
  }

  handleEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  submitReset = async () => {
    await fetch(`${window.baseURL}/login/resetPass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.fire({
          title:
            "If the email is found on our servers you will receive a link within the next 15 minutes",
          icon: "sucess",
          background: "var(--background)",
          confirmButtonText: "Okay",
        });
      });
  };

  submitWithEnter = (e) => {
    if (e.keyCode === 13) {
      this.submitReset();
    }
  };

  render() {
    return (
      <div
        className="login-page"
        style={{
          width: this.props.pageWidth,
        }}
      >
        <h1 className="login-title">Reset Password</h1>
        <div className="username">
          <TextField
            error={this.state.error}
            label="Email"
            className="username-input"
            value={this.state.email}
            onChange={this.handleEmail}
          />
        </div>
        <div className="reset-buttons-wrapper">
          <button className="reset-button" onClick={this.submitReset}>
            Reset Password
          </button>
        </div>
      </div>
    );
  }
}
