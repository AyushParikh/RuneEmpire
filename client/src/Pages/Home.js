import React from "react";
import dice from "../Images/diceVid.mp4";
import plinko from "../Images/plinko.mp4";
import crash from "../Images/crashVid.mp4";
import blackjack from "../Images/blackjackVid.mp4";
import roulette from "../Images/roulette.mp4";
import { Link } from "react-router-dom";

import "../Style/Home.css";
import ScoreTable from "../Components/ScoreTable";

const UPDATE_TABLE_INTERVAL = 5000;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="home" style={{ width: this.props.pageWidth }}>
          <div className="games">
            <HomeGif
              video={dice}
              className="game"
              videoClassName="img"
              gameName="Dice"
              to="/dice"
            />
            <HomeGif
              video={plinko}
              className="game"
              videoClassName="img"
              gameName="Plinko"
              to="/plinko"
            />
            <HomeGif
              video={crash}
              className="game"
              videoClassName="img"
              gameName="Coin Duels"
              to="/coinDuels"
            />
            <HomeGif
              video={blackjack}
              className="game"
              videoClassName="img"
              gameName="Blackjack"
              to="/blackjack"
            />
            <HomeGif
              video={roulette}
              className="game"
              videoClassName="img"
              gameName="Roulette"
              to="/roulette"
            />
          </div>
        </div>
        <ScoreTable
          rows={this.props.rows}
          getNewRows={this.props.getNewRows}
          validuser={this.props.validuser}
        />
      </div>
    );
  }
}

function HomeGif(props) {
  return (
    <Link className={props.className} to={props.to}>
      <video
        src={props.video}
        alt={props.gameName}
        onMouseOver={(event) => {
          event.target.volume = 0;
          event.target.play();
        }}
        onMouseOut={(event) => {
          event.target.currentTime = 0;
          event.target.pause();
        }}
        width="100%"
        className={props.videoClassName}
      />
      <div className="text">{props.gameName}</div>
    </Link>
  );
}
