const express = require('express');
const path = require('path');
const app = express();
const getChartA = require('../bossZhipinChartData');

app.use(express.static(path.join(__dirname, '../', '/client')));
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/charts',
  (req, res) => {
    const data = getChartA();
    res.json(data);
  }
);


app.listen(3000, () => console.log('Example app listening on port 3000!'))
