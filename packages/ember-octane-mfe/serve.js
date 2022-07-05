/* eslint-disable no-undef */
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());

app.use('/registry.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'registry.json'));
});

app.use('/embermfe', express.static(path.join(__dirname, 'dist')));

app.use(express.static(path.join(__dirname, 'dist')));

// app.use('/*', (req, res) => {
//   console.log('gkgk');
//   res.sendFile(path.join(__dirname, 'dist/index.html'));
// });

app.listen(8001, () => {
  console.info('ember octance mfe server started in port 8001');
});
