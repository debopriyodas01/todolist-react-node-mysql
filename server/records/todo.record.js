const { v4: uuid } = require('uuid');
const { pool } = require('../utils/db');

class TodoRecord {
  constructor(obj) {
    const inputTodo = obj && obj.todo ? String(obj.todo) : '';

    if (!inputTodo || inputTodo.length < 3 || inputTodo.length > 50) {
      this.todo = "Malformed Todo Record";
    } else {
      this.todo = inputTodo;
    }

    this.id = obj && obj.id ? obj.id : null;
  }

  // Fetch all items from the table safely
  static async listAll() {
    try {
      const [results] = await pool.execute('SELECT * FROM `todos`');
      return results.map((obj) => new TodoRecord(obj));
    } catch (err) {
      console.error("CRITICAL: Database error in listAll:", err);
      throw err; // Forwards to Express error handler safely
    }
  }

  // Pure positional placeholder mapping (?) instead of conflicting named loops
  static async getOne(id) {
    try {
      const [results] = await pool.execute(
        'SELECT * FROM `todos` WHERE `id` = ?',
        [id]
      );
      return results.length === 0 ? null : new TodoRecord(results[0]);
    } catch (err) {
      console.error("CRITICAL: Database error in getOne:", err);
      throw err;
    }
  }

  // Secure write transactions
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

  // Straight positional values mapping
  async update(id, todo) {
    await pool.execute(
      'UPDATE `todos` SET `todo` = ? WHERE `id` = ?', 
      [todo, id]
    );
  }

  // Clear rows cleanly
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
