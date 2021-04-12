import { shuffleArray } from "../utils/array";

/**
 * Creates a deck.
 * Private function used by Deck.
 *
 * @return     {Array}  { standard deck of cards }
 */
function createDeck() {
  const deck = [];
  const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
  const suits = ["D", "H", "S", "C"];

  ranks.forEach((rank) => {
    suits.forEach((suit) => {
      deck.push({ rank, suit });
    });
  });
  return deck;
}

/**
 * Deck of cards store.
 * Private variable used by Deck.
 *
 * @type       {WeakMap}
 */
let _deck = new WeakMap();
/**
 * Create a new Deck.
 * Privately stores deck of cards
 * using WeakMap.
 *
 * @class      Deck (name)
 */
export default class Deck {
  /**
   * Create the deck of cards and shuffle
   */
  create(clientSeed, nonce) {
    return new Promise((resolve) => {
      shuffleArray(createDeck(), clientSeed, nonce).then((result) => {
        _deck.set(this, result);
        resolve(true);
      });
    });
  }

  start(clientSeed, nonce) {
    return new Promise((resolve) => {
      this.create(clientSeed, nonce).then(() => {
        resolve(true);
      });
    });
  }

  /**
   * Get the amount of remaning cards
   *
   * @return     {Integer} { deck size }
   */
  get length() {
    return _deck.get(this).length;
  }

  /**
   * Reset the cards in the deck to allow for provably fair to take place
   */
  reset() {
    this.create();
  }

  /**
   * Deal the last card from the deck
   *
   * @return     {Object} card { last card from the deck }
   * @return     {String} card.rank { card rank }
   * @return     {String} card.suit { card suit }
   */
  deal() {
    let deck = _deck.get(this);

    const card = deck.pop();
    _deck.set(this, deck);

    return card;
  }
}
