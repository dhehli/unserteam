const express = require('express')
const app = express()
const config = require('config');
const path = require("path");

app.use('/', express.static(__dirname + '/public'))

app.set('view engine', 'jade');

app.get('/', (req, res) => {
  res.render('index.jade');
})

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
})
