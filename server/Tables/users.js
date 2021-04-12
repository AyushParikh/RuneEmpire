class Users {
  constructor(dao) {
    this.dao = dao;
  }

  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
      username TEXT PRIMARY KEY, password TEXT, email TEXT, seed TEXT, money REAL, level INT, mute BOOLEAN,
       time INT, dateMuted INT, betsMade INT DEFAULT 0, wins INT DEFAULT 0, losses INT DEFAULT 0,
       wagered REAL DEFAULT 0, profit REAL DEFAULT 0);`; //level 1 = USER, level 2 = MODERATOR, level 3 = ADMIN
    return this.dao.run(sql);
  }

  create(name, password, email, seed, money, level, mute, time) {
    return this.dao.run(
      "INSERT INTO users (username, password, email, seed, money, level) VALUES (?, ?, ?, ?, ?, ?)",
      [name, password, email, seed, money, level]
    );
  }

  updateSeed(newSeed, username) {
    return this.dao.run(`UPDATE users SET seed = ? WHERE username = ?`, [
      newSeed,
      username,
    ]);
  }

  updateWagers(name, betsMade, wins, losses, wagered, profit) {
    return this.dao.run(
      `UPDATE users SET betsMade = ?, wins = ?, losses = ?, wagered = ?, profit = ? WHERE username = ?`,
      [betsMade, wins, losses, wagered, profit, name]
    );
  }

  delete(id) {
    return this.dao.run(`DELETE FROM projects WHERE id = ?`, [id]);
  }

  getByUsername(username) {
    return this.dao.get(`SELECT * FROM users WHERE username = ?`, [username]);
  }

  getByEmail(email) {
    return this.dao.get(`SELECT * FROM users WHERE email = ?`, [email]);
  }

  getUserSeed(username) {
    return this.dao.get(`SELECT seed FROM users WHERE username = ?`, [
      username,
    ]);
  }

  setUserSeed(newSeed, username) {
    return this.dao.update(`UPDATE users SET seed = ? WHERE username = ?`, [
      newSeed,
      username,
    ]);
  }

  updatePassword(password, username) {
    return this.dao.update(`UPDATE users SET password = ? WHERE username = ?`, [
      password,
      username,
    ]);
  }

  getAll() {
    return this.dao.all(`SELECT * FROM users`);
  }

  getMods() {
    return this.dao.all(`Select username FROM users WHERE level > 2`);
  }

  getCash(username) {
    return this.dao.get(`SELECT money FROM users WHERE username = ?`, [
      username,
    ]);
  }

  setCash(username, cash) {
    return this.dao.update(`UPDATE users SET money = ? WHERE username = ?`, [
      cash,
      username,
    ]);
  }

  muteUser(mute, username, time) {
    var date = (Date.now() / 1000).toFixed(0);
    return this.dao.update(
      `UPDATE users SET mute = ?, time = ?, dateMuted = ? WHERE username = ?`,
      [mute, time, date, username]
    );
  }

  setLevel(username, level) {
    return this.dao.update(`UPDATE users SET level = ? WHERE username = ?`, [
      level,
      username,
    ]);
  }
}

module.exports = Users;
