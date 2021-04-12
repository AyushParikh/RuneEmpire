class CrashSeeds {
  constructor(dao) {
    this.dao = dao;
  }

  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS crashSeeds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seed TEXT);`;
    return this.dao.run(sql);
  }

  create(seed) {
    return this.dao.run("INSERT INTO crashSeeds (seed) VALUES (?)", [seed]);
  }

  delete() {
    return this.dao.run(
      `DELETE FROM crashSeeds WHERE id = (SELECT MAX(id) FROM crashSeeds);`
    );
  }

  deleteAll() {
    return this.dao.all(`DELETE FROM crashSeeds`);
  }

  getById(id) {
    return this.dao.run(`SELECT * from crashSeeds WHERE id = ?`, [id]);
  }

  getAll() {
    return this.dao.all(`SELECT * FROM crashSeeds`);
  }
}

module.exports = CrashSeeds;
