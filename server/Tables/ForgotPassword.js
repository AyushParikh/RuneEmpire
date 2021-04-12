class ForgotPassword {
  constructor(dao) {
    this.dao = dao;
  }

  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS forgotPassword (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seed TEXT, created INT, username TEXT, used INT DEFAULT 0)`;
    return this.dao.run(sql);
  }

  create(seed, created, username) {
    return this.dao.run(
      `INSERT INTO forgotPassword (seed, created, username) VALUES (?, ?, ?)`,
      [seed, created, username]
    );
  }

  setUsed(seed) {
    return this.dao.run(`UPDATE forgotPassword SET used = 1 WHERE seed = ?`, [
      seed,
    ]);
  }

  get(seed) {
    return this.dao.get(`SELECT * FROM forgotPassword WHERE seed = ?`, [seed]);
  }
}

module.exports = ForgotPassword;
