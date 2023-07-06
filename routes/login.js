var express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


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

