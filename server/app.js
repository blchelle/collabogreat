const express = require('express');
const morgan = require('morgan');

// Create app
const app = express();
app.use(express.json());

app.get('/api', (req, res) => res.status(200).json({ message: 'hello world' }));

module.exports = app;
