var crypto = require("crypto");
var _ = require("lodash");

// Random number generation based on following inputs: serverSeed, clientSeed, nonce and cursor
function* byteGenerator({ serverSeed, clientSeed, nonce, cursor }) {
  // Setup curser variables
  let currentRound = Math.floor(cursor / 32);
  let currentRoundCursor = cursor;
  currentRoundCursor -= currentRound * 32;

  // Generate outputs until cursor requirement fullfilled
  while (true) {
    // HMAC function used to output provided inputs into bytes
    const hmac = crypto.createHmac("sha256", serverSeed);
    hmac.update(`${clientSeed}:${nonce}:${currentRound}`);
    const buffer = hmac.digest();

    // Update curser for next iteration of loop
    while (currentRoundCursor < 32) {
      yield Number(buffer[currentRoundCursor]);
      currentRoundCursor += 1;
    }
    currentRoundCursor = 0;
    currentRound += 1;
  }
}

// Convert the hash output from the rng byteGenerator to floats
function generateFloats({ serverSeed, clientSeed, nonce, cursor, count }) {
  // Random number generator function
  const rng = byteGenerator({ serverSeed, clientSeed, nonce, cursor });
  // Declare bytes as empty array
  const bytes = [];

  // Populate bytes array with sets of 4 from RNG output
  while (bytes.length < count * 4) {
    bytes.push(rng.next().value);
  }
  // Return bytes as floats using lodash reduce function
  return _.chunk(bytes, 4).map((bytesChunk) =>
    bytesChunk.reduce((result, value, i) => {
      const divider = 256 ** (i + 1);
      const partialResult = value / divider;
      return result + partialResult;
    }, 0)
  );
}

function crashResult(hashChain, blockHash, houseEdge) {
  const gameHash = hashChain.pop();
  if (gameHash) {
    const hmac = crypto.createHmac("sha256", gameHash.seed);

    // blockHash is the hash of bitcoin block 601,201

    hmac.update(
      "0000000000000000000aec2fe61dd7af9348bc82bd0a4fb030119d8cbd7143c4"
    );

    const hex = hmac.digest("hex").substr(0, 8);
    const int = parseInt(hex, 16);
    const crashpoint = Math.max(1, (2 ** 32 / (int + 1)) * (1 - 0.01 / 100.0));
    return crashpoint;
  } else {
    return false;
  }
}

module.exports = {
  generateFloats: generateFloats,
  crash: crashResult,
};
