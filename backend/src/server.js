const express = require('express');
const app = express();
const cors = require('cors');
const ruta = require('./rutas')
app.use(express.urlencoded({ extended: true })) 
app.use(express.json()); 
app.use(cors());
app.use('/semi1-p2/api', ruta)
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

module.exports = app