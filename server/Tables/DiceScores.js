class DiceScores {
  constructor(dao) {
    this.dao = dao;
  }

  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS dice_scores (
      id INTEGER PRIMARY KEY, game TEXT, username TEXT, time TEXT, wager REAL, multiplier REAL, profit REAL,
      clientSeed TEXT, nonce INTEGER, serverHash TEXT, serverUnhash TEXT, serverSeedShow INT DEFAULT 0);`; //level 1 = USER, level 2 = MODERATOR, level 3 = ADMIN
    return this.dao.run(sql);
  }

  insert(
    game,
    username,
    time,
    wager,
    multiplier,
    profit,
    clientSeed,
    nonce,
    serverHash,
    serverUnhash
  ) {
    return this.dao.run(
      "INSERT INTO dice_scores (game, username, time, wager, multiplier, profit, clientSeed, nonce, serverHash, serverUnhash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        game,
        username,
        time,
        wager,
        multiplier,
        profit,
        clientSeed,
        nonce,
        serverHash,
        serverUnhash,
      ]
    );
  }

  get(id) {
    return this.dao.get(`SELECT * FROM dice_scores WHERE id = ?`, [id]);
  }

  getMaxRow() {
    return this.dao.all(`SELECT * FROM dice_scores ORDER BY id DESC LIMIT 1`);
  }

  updateSeed(newSeed, username) {
    return this.dao.run(`UPDATE users SET seed = ? WHERE username = ?`, [
      newSeed,
      username,
    ]);
  }

  showOldSeeds(name) {
    return this.dao.run(
      `UPDATE dice_scores set serverSeedShow = 1 WHERE username = ?`,
      [name]
    );
  }

  delete(id) {
    return this.dao.run(`DELETE FROM projects WHERE id = ?`, [id]);
  }

  getUserSeed(gameID) {
    return this.dao.all(`SELECT * FROM dice_scores WHERE id = ?`, [gameID]);
  }

  getUserBets(username, rowsToGet) {
    return this.dao.all(
      `SELECT * FROM (SELECT * FROM dice_scores WHERE username = ? ORDER BY id DESC LIMIT ?)`,
      [username, rowsToGet]
    );
  }

  getHighBets(rowsToGet) {
    return this.dao.all(
      `SELECT * FROM (SELECT * FROM dice_scores WHERE wager > 50000000 ORDER BY id DESC LIMIT ?)`,
      [rowsToGet]
    );
  }

  getAll(rowsToGet) {
    return this.dao.all(
      `SELECT * FROM (SELECT * FROM dice_scores ORDER BY id DESC LIMIT ?)`,
      [rowsToGet]
    );
  }
}

module.exports = DiceScores;
