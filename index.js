const express = require('express')
const app = express()

app.use('/', express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.render(__dirname + '/views/index.pug')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
