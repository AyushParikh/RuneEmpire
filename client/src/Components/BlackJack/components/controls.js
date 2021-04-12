import React, { PropTypes } from "react";
import CSSTransitionGroup from "react-addons-css-transition-group";
import millify from "millify";
import {
  BsArrowLeftRight,
  BsArrowRight,
  BsArrowDown,
  BsArrowBarUp,
} from "react-icons/bs";

/**
 * Control component
 *
 * Renders:
 * deal button
 * hit button
 * stand button
 *
 * @return {ReactElement} markup
 */

/**
 * Control component where player controls how to play the game.
 *
 * @class      Controls (name)
 * @param      {Object}       props               Component properties
 * @param      {Bool}         props.inProgress    Is game in progress
 * @param      {Bool}         props.gameOver      Are game's results shown
 * @param      {Function}     props.deal          Run when Deal button is clicked
 * @param      {Function}     props.hit           Run when Hit button is clicked
 * @param      {Function}     props.stand         Run when Stand button is clicked
 * @return     {ReactElement} markup
 */
const Controls = ({
  inProgress,
  gameOver,
  deal,
  hit,
  stand,
  bet,
  handleBet,
  playerHand,
  split,
  splitHand,
  double,
  formatBet,
  nonPlayable,
}) => {
  return (
    <div className="controls">
      <CSSTransitionGroup
        transitionName="buttons"
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}
      >
        <div className="blackjack-bet">
          <div className="bet-amount bj-bet">
            Bet amount:
            <div className="bet-amount-input">
              <input
                disabled={inProgress}
                className="bet-input"
                value={bet}
                onChange={(e) => handleBet(e.target.value)}
              />
              <button
                disabled={inProgress}
                className="bet-input-mult"
                onClick={async () => {
                  var result = formatBet(bet);
                  result *= 0.5;
                  if (!isNaN(result)) {
                    handleBet(millify(result, { precision: 0 }));
                  }
                }}
              >
                0.5x
              </button>
              <button
                disabled={inProgress}
                className="bet-input-mult"
                onClick={async () => {
                  var result = formatBet(bet);
                  result *= 2;
                  if (result > 999999999999999) {
                    return;
                  }
                  if (!isNaN(result)) {
                    handleBet(millify(result, { precision: 0 }));
                  }
                }}
              >
                2x
              </button>
            </div>
          </div>
        </div>

        {!inProgress && !gameOver && (
          <div className="button-container">
            <button className="deal blackjack-buttons" onClick={deal}>
              <i className="icon-right"></i>
              <span>Bet</span>
            </button>
          </div>
        )}

        {/*
         * Show game buttons when the game is in progress or
         * the game is over (displaying results) - in that case,
         * disable them
         */}
        {(inProgress || (!inProgress && gameOver)) && (
          <>
            <div className="button-container">
              <button
                className="hit blackjack-buttons"
                onClick={hit}
                disabled={gameOver || nonPlayable}
              >
                <BsArrowRight size={40} />
                <span>Hit</span>
              </button>
              <button
                className="stand blackjack-buttons"
                onClick={stand}
                disabled={gameOver || nonPlayable}
              >
                <BsArrowDown size={40} />
                <span>Stand</span>
              </button>
            </div>
            <div className="button-container">
              <button
                className="split blackjack-buttons"
                onClick={splitHand}
                disabled={gameOver || !split || nonPlayable}
              >
                <BsArrowLeftRight size={40} />
                <span>Split</span>
              </button>
              <button
                className="double blackjack-buttons"
                onClick={double}
                disabled={gameOver || nonPlayable}
              >
                <BsArrowBarUp size={40} />
                <span>Double</span>
              </button>
            </div>
          </>
        )}
      </CSSTransitionGroup>
    </div>
  );
};

export default Controls;
