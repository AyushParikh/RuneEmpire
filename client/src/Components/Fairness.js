import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Button from "@material-ui/core/Button";

export default class FairnessPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      serverSeed: "",
      nonce: 0,
      client: "",
      serverSeedHash: "",
    };
  }

  componentDidMount() {
    if (this.props.unhash) {
      this.getServerSeed();
    } else {
      this.setState({
        nonce: this.props.nonce - (this.props.boxIdLength - this.props.boxId),
        client: this.props.tempClient,
        serverSeedHash: this.props.serverSeed,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        client: this.props.tempClient,
      });
    }
  }

  getServerSeed() {
    fetch(`${window.baseURL}/getServerSeedUnhashed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameID: this.props.gameID - (this.props.boxIdLength - this.props.boxId) + 1,
      }),
    })
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          nonce: data[0].nonce,
          client: data[0].clientSeed,
          serverSeed: data[0].serverUnhash,
          serverSeedHash: data[0].serverHash,
        })
      );
  }

  render() {
    return (
      <ClickAwayListener onClickAway={this.props.close}>
        <div className="fairness-popup-wrapper">
          <div className="fairness-popup">
            <button className="fairness-close" onClick={this.props.close}>
              X
            </button>
            <div className="server-seed-header">Server Seed (Hashed):</div>
            <input className="server-seed" value={this.state.serverSeedHash} readOnly />
            <div className="client-seed-header">Client Seed:</div>
            <input
              className="client-seed"
              value={this.state.client}
              onChange={(e) => {
                this.props.changeTemp(e.target.value);
              }}
              readOnly={!this.props.showButton}
            />
            <div className="nonce-header">Nonce:</div>
            <input className="nonce" value={this.state.nonce} readOnly />

            {this.props.showButton ? (
              <button className="change-seed" onClick={this.props.submit}>
                Submit
              </button>
            ) : (
              <>
                <div className="server-seed-un-header">Server Seed:</div>
                <input
                  className="server-seed-un"
                  value={
                    !this.props.unhash
                      ? "Please Refresh Seed Pair to see Seed"
                      : this.state.serverSeed
                  }
                  readOnly
                />
              </>
            )}
          </div>
        </div>
      </ClickAwayListener>
    );
  }
}
