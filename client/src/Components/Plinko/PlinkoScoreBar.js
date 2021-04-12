import React from "react";
import { getScores } from "./PlinkoGameScores";
import makeColours from "./PlinkoScoreColours";
import beep from "../../Sounds/beepSound.wav";
import sound from "../Sound";

import "../../Style/Plinko.css";
import Millify from "millify";

export default class ScoreBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      offset: 53,
      nudge: 20,
      scores: ["5.6", "2.1", "1.1", "1", "0.5", "1", "1.1", "2.1", "5.6"],
      width: 30,
      backgroundWidth: 50,
      backgroundColor: [
        "#ff003f",
        "#ff302f",
        "#ff6020",
        "#ff9010",
        "#ffc000",
        "#ff9010",
        "#ff6020",
        "#ff302f",
        "#ff003f",
      ],
      backgroundShadowColor: [
        "#7e0727",
        "#c80100",
        "#b93500",
        "#a95b00",
        "#997300",
        "#a95b00",
        "#b93500",
        "#c80100",
        "#7e0727",
      ],
      fontSize: 15,
      hover: false,
      currentHoverScore: 0,
      currentScorePos: 0,
      isAnimating: false,
      volume: 1,
    };
  }

  //renderscore bar based on user row input
  //TODO sometimes 16 (maybe others breaks)
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      var x = getScores();
      this.setState({ scores: x });

      var colours = makeColours(this.props.rows);

      this.setState({
        offset: colours.offset,
        width: colours.width,
        backgroundWidth: colours.backgroundWidth,
        nudge: colours.nudge,
        backgroundColor: colours.newBackground,
        backgroundShadowColor: colours.newShadow,
        fontSize: colours.fontSize,
        volume: this.props.volume,
      });
    }
  }

  //TODO this is the frame rate issue I think
  startAnimation = () => {
    if (this.props.score !== null) {
      var scoresHit = document.getElementsByClassName("center-score-point");
      var scorePos = this.props.posX + this.props.rows / 2;

      var posY = 0;
      this.animateScoreDown(
        scoresHit[scorePos].parentElement.parentElement.parentElement,
        posY
      );

      var mySound = new sound(beep);
      mySound.volume(this.state.volume);
      mySound.play();
    }
  };

  animateScoreDown = (scoreElement, posY) => {
    if (posY >= 7.5) {
      this.animateScoreUp(scoreElement, posY);
    } else {
      posY += 1.5;
      scoreElement.style.paddingTop = posY + "px";
      requestAnimationFrame(() => this.animateScoreDown(scoreElement, posY));
    }
  };

  animateScoreUp = (scoreElement, posY) => {
    if (posY <= 0) {
      return;
    } else {
      posY -= 1;
      scoreElement.style.paddingTop = posY + "px";
      requestAnimationFrame(() => this.animateScoreUp(scoreElement, posY));
    }
  };

  handleHoverOver = (value, pos) => {
    this.setState({
      hover: true,
      currentHoverScore: value,
      currentScorePos: pos,
    });
  };

  handleHoverOff = () => {
    this.setState({ hover: false });
  };

  formatBet(bet) {
    var finalString = bet.toString().toLowerCase();
    finalString = finalString.replace("t", "000000000000");
    finalString = finalString.replace("b", "000000000");
    finalString = finalString.replace("m", "000000");
    finalString = finalString.replace("k", "000");
    return finalString;
  }

  render() {
    return (
      <div style={{ display: "flex" }}>
        {this.state.scores.map((score, i) => (
          <div className="score">
            <div
              onMouseOver={() => this.handleHoverOver(score, i)}
              onMouseLeave={this.handleHoverOff}
              className="score-background"
              style={{
                width: this.state.backgroundWidth,
                left: this.state.offset * i + this.state.nudge - 10 + "px",
                backgroundColor: this.state.backgroundColor[i],
                boxShadow: `0px 3px 0px ${this.state.backgroundShadowColor[i]}, 0px 5px 1px rgba(0,0,0,.4)`,
              }}
            >
              <span
                className="text"
                id={i}
                className="score-point"
                style={{
                  fontWeight: "bold",
                  fontSize: this.state.fontSize,
                }}
              >
                <div className="center-score-point">{score}</div>
              </span>
            </div>
          </div>
        ))}
        {this.state.hover && (
          <div className="win-chance-box">
            <div className="win-chance-profit">
              <span>Profit:</span>
              <div>
                {console.log(this.state.currentHoverScore, this.props.bet)}
                {Millify(
                  this.state.currentHoverScore * this.formatBet(this.props.bet)
                )}
              </div>
            </div>
            <div className="win-chance-percent">
              <span>Win Chance:</span>
              <div>
                {ScoreWinChance(this.state.currentScorePos, this.props.rows)}
                <span className="percent-sign">%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function ScoreWinChance(scorePos, rows) {
  return (
    (sFact(rows) / (sFact(scorePos) * sFact(rows - scorePos))) *
    Math.pow(0.5, scorePos) *
    Math.pow(0.5, rows - scorePos) *
    100
  ).toFixed(4);
}

function sFact(num) {
  var rval = 1;
  for (var i = 2; i <= num; i++) rval = rval * i;
  return rval;
}
