// SQLite Controller

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./horikita.db');

// Function to create table
async function createTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      name TEXT NOT NULL,
      balance INTEGER DEFAULT 0
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      itemId TEXT NOT NULL,
      name TEXT NOT NULL,
      price INTEGER NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS user_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      itemId TEXT NOT NULL,
      quantity INTEGER NOT NULL
    );
  `);
}

// Function to add user
async function addUser(userId, name) {
  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO users (userId, name)
      VALUES (?, ?);
    `, [userId, name], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

// Function to getUser
async function getUser(userId) {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT * FROM users
      WHERE userId = ?;
    `, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Function to add item
async function addItem(itemId, name, price) {
  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO items (itemId, name, price)
      VALUES (?, ?, ?);
    `, [itemId, name, price], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

// Function to getItem
async function getItem(itemId) {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT * FROM items
      WHERE itemId = ?;
    `, [itemId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Function to addUserItem
async function addUserItem(userId, itemId, quantity) {
  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO user_items (userId, itemId, quantity)
      VALUES (?, ?, ?);
    `, [userId, itemId, quantity], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

// Function to getUserItem
async function getUserItem(userId, itemId) {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT * FROM user_items
      WHERE userId = ? AND itemId = ?;
    `, [userId, itemId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Function to updateUserBalance
async function updateUserBalance(userId, balance) {
  return new Promise((resolve, reject) => {
    db.run(`
      UPDATE users
      SET balance = ?
      WHERE userId = ?;
    `, [balance, userId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

// Function to updateUserItemQuantity
async function updateUserItemQuantity(userId, itemId, quantity) {
  return new Promise((resolve, reject) => {
    db.run(`
      UPDATE user_items
      SET quantity = ?
      WHERE userId = ? AND itemId = ?;
    `, [quantity, userId, itemId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

module.exports = {
  createTable,
  addUser,
  getUser,
  addItem,
  getItem,
  addUserItem,
  getUserItem,
  updateUserBalance,
  updateUserItemQuantity
};