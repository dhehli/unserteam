const express = require('express')
const app = express()
const config = require('config');

app.use('/', express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.render(__dirname + '/views/index.pug')
})

app.listen(config.port, function () {
  console.log(`Example app listening on port ${config.port}`)
})
