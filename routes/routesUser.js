
const express = require('express');

const app = express();

const rt = function (req, res, next) {
  console.log('routes test');
  next();
};

app.listen(80, () => {

});