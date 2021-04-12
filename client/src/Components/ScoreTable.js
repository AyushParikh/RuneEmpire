import React from "react";
import ReactCSSTransitionGroup from "react-transition-group"; // ES6
import millify from "millify";
import {
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
} from "@material-ui/core";
import shortid from "shortid";
import Axios from "axios";

export default class ScoreTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: 10,
      table: 0,
      key: 0,
      game: {},
      player: {},
      rowIDs: [],
      maxRow: 10,
    };

    this.changeTable = this.changeTable.bind(this);
  }

  changeTable(table) {
    this.setState({ table });
    this.props.getNewRows(this.state.rows, table);
  }

  getGameInfo(row) {
    Axios.get(`${window.baseURL}/game/${row.id}`).then((response) => {
      const result = response.data;
      const game = {
        title: row.game,
        id: row.id,
        bet: millify(row.wager),
        mult: row.multiplier,
        username: result.username,
        payout: millify(row.profit),
        sshash: result.serverHash,
        ssunhash: result.serverUnhash,
        client: result.clientSeed,
        nonce: result.nonce,
      };
      this.setState({ showBet: true, game });
    });
  }

  getPlayerInfo(name) {
    Axios.get(`${window.baseURL}/user/${name}`).then((response) => {
      const info = {
        name: response.data.name,
        bets: response.data.bets,
        wins: response.data.wins,
        losses: response.data.losses,
        wagered: millify(response.data.wagered),
        profit: millify(response.data.profit),
      };
      this.setState({ player: info, showPlayer: true });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (this.props.rows.length > 0) {
        if (this.props.rows[0].id > this.state.maxRow) {
          const rowIDs = {};
          for (let i = 0; i < 10; i++) {
            rowIDs[i] = shortid.generate();
          }
          this.setState({ rowIDs, maxRow: this.props.rows[0].id });
        }
      }
    }
  }

  render() {
    const rows = this.props.rows;
    const { table } = this.state;
    return (
      <>
        <div className="table" style={{ marginTop: this.props.margin }}>
          <div className="bet-type">
            <Button
              className="my-bets"
              style={{
                borderBottom: table === 1 && "3px solid white",
                borderRadius: 0,
              }}
              onClick={() => {
                if (this.state.table !== 1) {
                  this.changeTable(1);
                }
              }}
              disabled={!this.props.validuser}
            >
              My Bets
            </Button>
            <Button
              className="all-bets"
              style={{
                borderBottom: table === 0 && "3px solid white",
                borderRadius: 0,
              }}
              onClick={() => {
                if (this.state.table !== 0) {
                  this.changeTable(0);
                }
              }}
            >
              All Bets
            </Button>
            <Button
              className="high-bets"
              style={{
                borderBottom: table === 2 && "3px solid black",
                borderRadius: 0,
              }}
              onClick={() => {
                if (this.state.table !== 2) {
                  this.changeTable(2);
                }
              }}
            >
              High Rollers
            </Button>
            <Select
              className="table-row-num"
              onChange={(e) => {
                this.setState({ rows: e.target.value });
                console.log(this.props);
                this.props.getNewRows(e.target.value, this.state.table);
              }}
              value={this.state.rows}
            >
              <MenuItem value={10} className="select-val">
                10
              </MenuItem>
              <MenuItem value={20} className="select-val">
                20
              </MenuItem>
              <MenuItem value={50} className="select-val">
                50
              </MenuItem>
            </Select>
          </div>
          <table border="0" cellPadding="0" cellSpacing="0">
            <thead>
              <tr>
                <th>Game</th>
                {window.innerWidth > 600 && <th>ID</th>}
                <th>Username</th>
                {window.innerWidth > 600 && <th>Time</th>}
                {window.innerWidth > 600 && <th>Wager</th>}
                <th>Payout</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const date = new Date(parseInt(row.time));
                return (
                  <tr key={this.state.rowIDs[i]} className="table-row">
                    <td>
                      <Button
                        onClick={() => {
                          this.getGameInfo(row);
                        }}
                      >
                        {row.game}
                      </Button>
                    </td>
                    {window.innerWidth > 600 && (
                      <td>
                        <b>{row.id}</b>
                      </td>
                    )}
                    <td>
                      <Button
                        onClick={() => {
                          this.getPlayerInfo(row.username);
                        }}
                      >
                        {row.username}
                      </Button>
                    </td>
                    {window.innerWidth > 600 && (
                      <td>
                        <b>
                          {date.getHours() +
                            ":" +
                            (date.getMinutes() < 10 ? "0" : "") +
                            date.getMinutes()}
                        </b>
                      </td>
                    )}
                    {window.innerWidth > 600 && (
                      <td>
                        <b>{millify(row.wager)}</b>
                      </td>
                    )}
                    <td>
                      <b>{row.multiplier}x</b>
                    </td>
                    <td>
                      <b>{millify(row.profit.toFixed(2))}</b>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          <Dialog
            open={this.state.showBet}
            style={{ zIndex: 200000 }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle
              id="alert-dialog-title"
              style={{ backgroundColor: "#927e61" }}
            >
              {"Game Info"}
            </DialogTitle>
            <DialogContent
              id="alert-dialog-content"
              style={{ backgroundColor: "#927e61", width: "100%" }}
            >
              <div className="game-title">
                {this.state.game.title + " " + this.state.game.id}
              </div>
              <div className="bet-info">
                <div>Bet: {this.state.game.bet}</div>
                <div>Mult: {this.state.game.mult}</div>
                <div>Profit: {this.state.game.payout}</div>
              </div>
              <div className="result">
                <div className="result-server-unhash">
                  Server Seed:
                  <TextField
                    variant="outlined"
                    value={this.state.game.ssunhash}
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="result-client-seed">
                  Client Seed:
                  <TextField
                    variant="outlined"
                    value={this.state.game.client}
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="result-server-hash">
                  Server Seed (Hash):
                  <TextField
                    variant="outlined"
                    value={this.state.game.sshash}
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="result-nonce">
                  Nonce:{" "}
                  <TextField
                    variant="outlined"
                    value={this.state.game.nonce}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions style={{ backgroundColor: "#927e61" }}>
              <Button
                onClick={() =>
                  this.setState({
                    showBet: false,
                  })
                }
                color="primary"
                autoFocus
              >
                Okay
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <div>
          <Dialog open={this.state.showPlayer} style={{ zIndex: 200000 }}>
            <DialogTitle
              id="alert-dialog-title"
              style={{ backgroundColor: "#927e61" }}
            >
              {"User Info"}
            </DialogTitle>
            <DialogContent
              id="alert-dialog-content"
              style={{ backgroundColor: "#927e61" }}
            >
              <div className="player-title">
                Username: {this.state.player.username}
              </div>
              <div className="player-info">
                <div className="info-titles">
                  <div>Bets</div>
                  <div>Wins</div>
                  <div>Losses</div>
                  <div>Wagered</div>
                  <div>Profit</div>
                </div>
                <div className="info-contents">
                  <div>{this.state.player.bets}</div>
                  <div>{this.state.player.wins}</div>
                  <div>{this.state.player.losses}</div>
                  <div>{this.state.player.wagered}</div>
                  <div>{this.state.player.profit}</div>
                </div>
              </div>
            </DialogContent>
            <DialogActions style={{ backgroundColor: "#927e61" }}>
              <Button
                onClick={() =>
                  this.setState({
                    showPlayer: false,
                  })
                }
                color="primary"
                autoFocus
              >
                Okay
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </>
    );
  }
}
