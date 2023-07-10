var express = require('express');
var router = express.Router();
const schedule = require('node-schedule');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 登录接口
router.get('/schedule', async (req, res) => {
  let schedule = require('node-schedule');
  // 定义规则
  let rule = new schedule.RecurrenceRule();
  // rule.date = [1]; // 每月1号 
  // rule.dayOfWeek = [1,3,5]; // 每周一、周三、周五 
  // rule.hour = 0; rule.minute = 0; rule.second = 0; // 每天0点执行
  // rule.second = [0,10,20,30,40,50]; // 隔十秒
  rule.minute = [0,20,40]; // 每小时的0分钟，20分钟，40分钟执行
  // 启动任务
  // let job = schedule.scheduleJob(rule, ()=>{
  //   httpGet();
  //   console.log('现在时间：',new Date());
  // });
  // 取消任务
  // job.cancel(); 
  const job = schedule.scheduleJob('*/1 * * * * *', function(){
    // do some
    try {
      httpGet();
    } catch (error) {
      console.error(error);
    }
    console.log('现在时间：',new Date());
  });
  // job.cancel();
  function httpGet() {
      let https = require('https');
      let url = "https://baidu.com"
      https.get(url, function (res) {
          console.log("请求成功: " + res);
      })

  }
  res.send('hello word');
});


module.exports = router;

