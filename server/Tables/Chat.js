class Users {
  constructor(dao) {
    this.dao = dao;
  }

  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS chat (
      id INTEGER PRIMARY KEY,
      username TEXT, message TEXT, level INT);`; //level 1 = USER, level 2 = MODERATOR, level 3 = ADMIN
    return this.dao.run(sql);
  }

  create(name, message, level) {
    return this.dao.run("INSERT INTO chat (username, message, level) VALUES (?, ?, ?)", [
      name,
      message,
      level,
    ]);
  }

  delete(id) {
    return this.dao.run(`DELETE FROM projects WHERE id = ?`, [id]);
  }

  getAll() {
    return this.dao.all(
      `SELECT * FROM (SELECT * FROM chat ORDER BY id DESC LIMIT 50) ORDER BY id ASC;`
    );
  }
}

module.exports = Users;
