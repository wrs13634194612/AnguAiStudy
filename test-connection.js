// test-connection.js
const db = require('./db');

async function testConnection() {
  try {
    // 执行简单查询
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    console.log('✅ 连接成功！结果:', rows[0][0]);
  } catch (err) {
    console.error('❌ 连接失败:', err);
  } finally {
    // 关闭连接池
    await db.end();
  }
}

testConnection();
