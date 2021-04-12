import React from "react";
import { useParams } from "react-router-dom";
import { TextField, Button } from "@material-ui/core";

import "../Style/ResetPassword.css";
import Axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2";

export default function ResetPassword(props) {
  const { id } = useParams();

  const [password, setPassword] = React.useState("");
  const [confPassword, setConfPassword] = React.useState("");
  const [account, setAccount] = React.useState();

  React.useEffect(() => {
    Axios.get(`${window.baseURL}/validLink/${id}`).then((response) => {
      if (response.data) {
        setAccount(response.data.username);
      } else {
        Swal.fire({
          title: "Invalid Link",
          icon: "error",
        }).then(() => {
          window.location = "/";
        });
      }
    });
  }, []);

  function submit() {
    Axios.post(`${window.baseURL}/resetPassword`, {
      newPassword: password,
      username: account,
      seed: id,
    }).then(() => {
      Swal.fire({
        title: "Password Changed",
        icon: "success",
      });
    });
  }

  return (
    <div className="reset-pass">
      <div className="wrapper">
        <TextField
          label="New Password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <TextField
          label="Confirm Password"
          value={confPassword}
          type="password"
          onChange={(e) => setConfPassword(e.target.value)}
        />
        <br />
        <Button onClick={submit}>Submit</Button>
      </div>
    </div>
  );
}
