const express = require('express')
const app = express()
const config = require('config');
const path = require("path");

app.use('/', express.static(__dirname + '/public'))
app.use('/test', express.static(__dirname + '/test/js'))

app.set('view engine', 'jade');

app.get('/', (req, res) => {
  res.render('index.jade');
})

app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname+'/test/index.html'));
})

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
})
