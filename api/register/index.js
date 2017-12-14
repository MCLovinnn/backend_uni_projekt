'use strict';
var express = require('express');
var router = express.Router();
var controller = require('./register.controller.js');

router.post('/', function(req, res) {
    controller.insertUser(req, res);
});

module.exports = router;