import React from "react";
import ReactDOM from "react-dom";

import App from "../../Components/BlackJack/components/app";
// import game classes
import Hand from "../../Components/BlackJack/game/hand";
import Deck from "../../Components/BlackJack/game/deck";
// import game logic
import { getWinner, dealerDrawing } from "../../Components/BlackJack/game";

import "../../Components/BlackJack/css/index.scss";
import ScoreTable from "../../Components/ScoreTable";

// create instances of game classes
const deck = new Deck();
const dealerHand = new Hand();
const playerHand = new Hand();
const playerSplit = new Hand();

export default function BlackJack(props) {
  return (
    <div>
      <App
        deck={deck}
        dealerHand={dealerHand}
        playerHand={playerHand}
        playerSplit={playerSplit}
        getWinner={getWinner}
        dealerDrawing={dealerDrawing}
        bank={props.bank}
        setBank={props.setBank}
        houseEdge={props.houseEdge}
        clientSeed={props.clientSeed}
        setClient={props.setClient}
        getRows={props.getRows}
        updateTable={props.updateTable}
        socket={props.socket}
      />
      <ScoreTable
        rows={props.rows}
        getNewRows={props.getNewRows}
        validuser={props.validuser}
      />
    </div>
  );
}
