require('dotenv').config()
const express = require('express');

const app = express();

const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', router);

app.use(errorHandler);

module.exports = app;