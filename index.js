const express = require('express')
const app = express()
const config = require('config');
const path = require("path");

app.use('/', express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.sendFile('index.html');
})

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
})
