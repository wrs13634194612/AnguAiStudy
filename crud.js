const db = require('./db');

// 创建表（仅需运行一次）
async function initializeTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      age INT DEFAULT 0
    );
  `;
  await db.query(sql);
  console.log('✅ 用户表已创建！');
}

// 查询所有用户
async function getAllUsers() {
  const [rows] = await db.query('SELECT * FROM users');
  return rows;
}

// 查询单个用户（根据ID）
async function getUserById(id) {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0]; // 返回单个用户对象或 null
}

// 插入用户
async function createUser(user) {
  const [result] = await db.query(
    'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
    [user.name, user.email, user.age]
  );
  return { id: result.insertId, ...user };
}

// 更新用户
async function updateUser(id, user) {
  const [result] = await db.query(
    'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
    [user.name, user.email, user.age, id]
  );
  return { id, ...user };
}

// 删除用户
async function deleteUser(id) {
  const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
  return { affectedRows: result.affectedRows };
}

module.exports = {
  initializeTable,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
