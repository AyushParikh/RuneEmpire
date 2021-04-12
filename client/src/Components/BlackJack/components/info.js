import React, { PropTypes } from "react";
import CSSTransitionGroup from "react-addons-css-transition-group";

/**
 * Info component where game info is rendered.
 *
 * @class      Info (name)
 * @param      {Object}          props                Component properties
 * @param      {Bool|undefined}  props.isWin          Indicated player's win
 * @param      {String|Bool}     props.winPercentage  Shows win percentage when truthy
 * @return     {ReactElement} markup
 */
const Info = ({ isWin, winPercentage }) => {
  /**
   * Gets the game outcome.
   *
   * @param      {Bool|null}  win  The win.
   * @return     {string}     The outcome.
   */
  const getOutcome = (win) => {
    switch (win) {
      case true:
        return "WIN!";
      case false:
        return "LOST!";
      case null:
        return "PUSH!";
    }
  };

  /**
   * { function_description }
   *
   * @param      {boolean}        isWin   Indicates if player won.
   * @return     {ReactElement}   markup
   */
  const renderOutcome = (isWin) => {
    return (
      isWin !== undefined && (
        <div className="outcome" data-win={isWin}>
          {getOutcome(isWin)}
        </div>
      )
    );
  };

  return (
    <div className="info">
      <CSSTransitionGroup
        transitionName="outcome"
        transitionEnterTimeout={2000}
        transitionLeaveTimeout={300}
      >
        {renderOutcome(isWin)}
      </CSSTransitionGroup>
    </div>
  );
};

export default Info;
