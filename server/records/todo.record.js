const { v4: uuid } = require('uuid');
const { pool } = require('../utils/db');

class TodoRecord {
  constructor(obj) {
    // 1. Guard against null or undefined input objects safely
    const inputTodo = obj && obj.todo ? String(obj.todo) : '';

    // 2. Perform safe string length validation checks
    if (!inputTodo || inputTodo.length < 3 || inputTodo.length > 50) {
      // If a database row fails validation (stale data), fallback safely instead of throwing a hard crash
      this.todo = "Malformed Todo Record";
    } else {
      this.todo = inputTodo;
    }

    // Assign the ID safely, defaulting to null if it's a completely new uninserted record
    this.id = obj && obj.id ? obj.id : null;
  }

  // Fetch all items from the table and instantiate them safely through the constructor
  static async listAll() {
    const [results] = await pool.execute('SELECT * FROM `todos`');
    return results.map((obj) => new TodoRecord(obj));
  }

  // Fetch a single record securely using structured query placeholders
  static async getOne(id) {
    const [results] = await pool.execute(
      'SELECT * FROM `todos` WHERE `id` = ?',
      [id]
    );
    return results.length === 0 ? null : new TodoRecord(results[0]);
  }

  // Insert a new record into your persistent Master MySQL container schema
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

  // Update an existing item text value mapping accurately via the primary key index
  async update(id, todo) {
    await pool.execute(
      'UPDATE `todos` SET `todo` = ? WHERE `id` = ?', 
      [todo, id]
    );
  }

  // Permanently delete a record row from the active environment
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
