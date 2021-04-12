import { Button, TextField } from "@material-ui/core";
import React from "react";
import "../Style/Settings.css";

export default class Settings extends React.Component {
  render() {
    return (
      <div className="settings-wrapper">
        <div className="settings">
          <h2 className="settings-header">Change Password</h2>
          <TextField
            variant="outlined"
            style={{ width: "300px" }}
            label="Current Password"
            InputLabelProps={{
              style: { color: "#fff" },
            }}
          />
          <br />
          <br />
          <TextField
            variant="outlined"
            style={{ width: "300px" }}
            label="New Password"
            InputLabelProps={{
              style: { color: "#fff" },
            }}
          />
          <br />
          <br />
          <TextField
            variant="outlined"
            style={{ width: "300px" }}
            label="Confirm New Password"
            InputLabelProps={{
              style: { color: "#fff" },
            }}
          />
          <br />
          <br />
          <Button style={{ width: "300px" }} id="update-password">
            Update
          </Button>
          <br />
          <br />
          <br />
          <br />
          <h2 className="settings-header">Email</h2>
          <TextField
            variant="outlined"
            style={{ width: "300px" }}
            label="Email"
            InputLabelProps={{
              style: { color: "#fff" },
            }}
          />
          <br />
          <br />
          <Button style={{ width: "300px" }} id="update-password">
            Update
          </Button>
        </div>
      </div>
    );
  }
}
