const express = require('express');
const router = express.Router();
require("dotenv").config();
const controller = require('./controlador.js')


router.get('/',(req, res)=>{
    controller.TestConnection();
    res.json("SUCCESSFULL CONNECTION WITH MYSQL"); 
});

 module.exports = router;