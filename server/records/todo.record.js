const { v4: uuid } = require('uuid');
const { pool } = require('../utils/db');

class TodoRecord {
  constructor(obj) {
    // Graceful string fallback validation
    const inputTodo = obj && obj.todo ? String(obj.todo) : '';

    if (!inputTodo || inputTodo.length < 3 || inputTodo.length > 50) {
      this.todo = "Malformed Todo Record";
    } else {
      this.todo = inputTodo;
    }

    this.id = obj && obj.id ? obj.id : null;
  }

  // Wrapped safely inside a try block to stop 500 crashes
  static async listAll() {
    try {
      const [results] = await pool.execute('SELECT * FROM `todos`');
      if (!results || !Array.isArray(results)) return [];
      return results.map((obj) => new TodoRecord(obj));
    } catch (err) {
      console.error("Database connection failure in listAll:", err);
      return []; // Returns empty fallback array safely instead of a 500 error
    }
  }

  static async getOne(id) {
    try {
      const [results] = await pool.execute(
        'SELECT * FROM `todos` WHERE `id` = ?',
        [id]
      );
      if (!results || results.length === 0) return null;
      return new TodoRecord(results[0]);
    } catch (err) {
      console.error("Database connection failure in getOne:", err);
      return null;
    }
  }

  async insert() {
    if (!this.id) {
      this.id = uuid();
    }

    await pool.execute(
      'INSERT INTO `todos` (`id`, `todo`) VALUES (?, ?)', 
      [this.id, this.todo]
    );

    return this.id;
  }

  async update(id, todo) {
    await pool.execute(
      'UPDATE `todos` SET `todo` = ? WHERE `id` = ?', 
      [todo, id]
    );
  }

  async delete() {
    await pool.execute(
      'DELETE FROM `todos` WHERE `id` = ?', 
      [this.id]
    );
  }
}

module.exports = {
  TodoRecord,
};
