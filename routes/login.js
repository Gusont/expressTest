var express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const TIME = require('./dateFormat');
const moment = require('moment');



var router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const dt = new Date();
const newDt = TIME.dateFormatFun(dt);

console.log(newDt, TIME.padZero(3), TIME);

const mdt = moment().format('YYYY-MM-DD HH:mm:ss');
console.log(mdt);


const mysqldb = mysql.createConnection({
  host: 'localhost', // 数据库的 IP 地址
  user: 'root', // 登录数据库的账号
  port: '3306',
  password: 'admin123', // 登录数据库的密码
  database: 'testdb', // 指定要操作哪个数据库
})

// 建立数据库连接
mysqldb.connect((err) => {
  if (err) {
    console.error('数据库连接失败：', err);
    return;
  }

  console.log('成功连接到数据库');

  // 执行创建表的 SQL 查询
  // const createTableQuery = `
  //   CREATE TABLE users (
  //     id INT PRIMARY KEY,
  //     name VARCHAR(50) NOT NULL,
  //     email VARCHAR(100) UNIQUE
  //   )
  // `;
  // 执行创建表的 SQL 查询
  const createNewTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE
    )
  `;
  mysqldb.query(createNewTableQuery, (err, results) => {
    if (err) {
      console.error('创建表失败：', err);
      return;
    }

    console.log('成功创建表');
    
    mysqldb.end();
  });

  
  
  const insertQuery = `
    INSERT INTO users (id, name, email)
    VALUES (2, 'John Boe ', 'joh@example.com')
  `;
    //增
    mysqldb.query(insertQuery,function (err, result) {
            if(err){
            console.log('[INSERT ERROR] - ',err.message);
            return;
            }        
    
          console.log('--------------------------INSERT----------------------------');
          //console.log('INSERT ID:',result.insertId);        
          console.log('INSERT ID:',result);        
          console.log('-----------------------------------------------------------------\n\n');  
    });

  // mysqldb.query(createTableQuery, (err, results) => {
  //   if (err) {
  //     console.error('创建表失败：', err);
  //     return;
  //   }

  //   console.log('成功创建表');
    
  //   mysqldb.end();
  // });
});



// mysqldb.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });

// 连接 MongoDB 数据库
mongoose.connect('mongodb://127.0.0.1:27017/expressTest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
// 检查数据库连接是否成功
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// 定义用户模型
const User = mongoose.model('User', {
  username: String,
  password: String,
});

router.post('/users', async (req, res) => {
  // await User.deleteMany({});
  const { username, password } = req.query
  const user = await User.findOne({ username });
  console.log(user);
  // console.log(user);
  res.send(user);
});
// 注册接口
router.post('/register', async (req, res) => {
  try {
    // const { username, password } = req.body;
    const { username, password } = req.query
    console.log('111---',req.query, req.body, username, password);
    //检查用户名是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // 使用 bcrypt 对密码进行哈希处理
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('hashedPassword---',hashedPassword)
    // // 创建新用户
    const user = new User({ username, password: hashedPassword});
    console.log('222---',user.password,user.username);
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// 登录接口
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.query;
    console.log(req.query);
    console.log(req.params);
    // 检查用户是否存在
    const user = await User.findOne({ username });
    console.log(user.password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // 检查密码是否正确
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // 生成 JWT 令牌
    const token = jwt.sign({ username }, 'secret_key');

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

