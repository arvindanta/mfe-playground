const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/registry.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'registry.json'));
});

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8001, () => {
  console.info('server started on 8001');
});
