import axios from "axios";

/**
 * Randomize array element order in-place using
 * Durstenfeld (based on Fisher–Yates') algorithm.
 * http://stackoverflow.com/a/12646864/7627609
 *
 * @param      {Array}  array   Input array
 * @return     {Array}  { Shuffled array }
 */
export function shuffleArray(array, clientSeed, nonce) {
  // todo make promise and await backend
  return new Promise((resolve) => {
    axios
      .post(
        `${window.baseURL}/blackjack/fairness/${window.localStorage.getItem(
          "token"
        )}`,
        {
          clientSeed: clientSeed,
          nonce: nonce,
          count: 52,
        }
      )
      .then((result) => {
        const cards = [];
        const fairnessResult = result.data.result.reverse();
        for (let i = 0; i < fairnessResult.length; i++) {
          const element = fairnessResult[i];
          cards.push(array[element]);
        }
        resolve(cards);
      });
  });
}
