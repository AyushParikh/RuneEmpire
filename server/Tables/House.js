class House {
  constructor(dao) {
    this.dao = dao;
  }

  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS house (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      edge REAL)`;
    return this.dao.run(sql);
  }

  create(edge) {
    return this.dao.run("INSERT INTO house (edge) VALUES (?)", [edge]);
  }

  get() {
    return this.dao.get(`SELECT edge FROM house`);
  }

  update(edge) {
    return this.dao.update(`UPDATE house SET edge = ? WHERE id = 1`, [edge]);
  }

  delete(id) {
    return this.dao.run(`DELETE FROM projects WHERE id = ?`, [id]);
  }

  getAll() {
    return this.dao.all(`SELECT * FROM chat`);
  }
}

module.exports = House;
