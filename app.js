const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


// 获取所有用户（GET /users）
app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users'); // ✅ 正确
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 创建用户（POST /users）
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query( // ❌ 移除解构
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    res.status(201).json({
      id: result.insertId, // ✅ 直接访问对象属性
      name,
      email
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 更新用户（PUT /users/:id）
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const result = await pool.query( // ❌ 移除解构
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id]
    );
    res.json({
      id,
      name,
      email,
      affectedRows: result.affectedRows // ✅ 访问属性
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 删除用户（DELETE /users/:id）
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query( // ❌ 移除解构
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    res.json({
      message: 'User deleted',
      affectedRows: result.affectedRows // ✅ 访问属性
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
