const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crud = require('./crud');

const app = express();
app.use(bodyParser.json());
// 开启跨域支持（允许所有来源访问）
app.use(cors());

// 初始化表（运行前执行一次）
(async () => {
  await crud.initializeTable();
})();

// API 路由
app.get('/users', async (req, res) => {
  const users = await crud.getAllUsers();
  res.json(users);
});

// 新增：根据ID查询用户
app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await crud.getUserById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (err) {
    console.error('查询用户错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

app.post('/users', async (req, res) => {
  const newUser = await crud.createUser(req.body);
  res.status(201).json(newUser);
});

app.put('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const updatedUser = await crud.updateUser(id, req.body);
  res.json(updatedUser);
});

app.delete('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await crud.deleteUser(id);
  res.json({ message: `Deleted ${result.affectedRows} user(s)` });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
