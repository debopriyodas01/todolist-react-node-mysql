const { v4: uuid } = require('uuid');
const { pool } = require('../utils/db');

class TodoRecord {
  constructor(obj) {
    // 1. Safeguard against empty row contexts or invalid objects
    const inputTodo = obj && obj.todo ? String(obj.todo) : '';

    // 2. Fallback gracefully instead of throwing a validation error on list loops
    if (!inputTodo || inputTodo.length < 3 || inputTodo.length > 50) {
      this.todo = "Malformed Todo Record";
    } else {
      this.todo = inputTodo;
    }

    this.id = obj && obj.id ? obj.id : null;
  }

  // Fetch all existing database todo entities
  static async listAll() {
    const [results] = await pool.execute('SELECT * FROM `todos`');
    return results.map((obj) => new TodoRecord(obj));
  }

  // FIXED: Pass the zero-index element array item cleanly to the constructor initialization loop
  static async getOne(id) {
    const [results] = await pool.execute(
      'SELECT * FROM `todos` WHERE `id` = ?',
      [id]
    );
    return results.length === 0 ? null : new TodoRecord(results[0]);
  }

  // Insert raw tasks directly into the master MySQL container space
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

  // Commit text alterations back to the persistent table engine
  async update(id, todo) {
    await pool.execute(
      'UPDATE `todos` SET `todo` = ? WHERE `id` = ?', 
      [todo, id]
    );
  }

  // Clear rows cleanly out of the tracking systems
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
