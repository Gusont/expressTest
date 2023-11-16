
const express = require('express');
const app = express();

console.log('i---ndex.js');
// 定义路由处理程序
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// 启动服务器
app.listen(8089, () => {
  console.log('Server started on port 3000');
});

module.exports = app;