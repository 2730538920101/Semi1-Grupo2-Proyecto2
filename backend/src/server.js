require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const user = require('./user');
const comment = require('./comment');

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Definicion de rutas
app.use('/user', user);
app.use('/comment', comment);

module.exports = app