const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());

app.use('/registry.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/registry.json'));
});

app.use(express.static(path.join(__dirname, 'build')));

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(9001, () => {
  console.info('server started in port 9001');
});
