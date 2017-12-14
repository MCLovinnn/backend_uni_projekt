'use strict';
var express = require('express');
var router = express.Router();
var controller = require('./user.controller');

router.route('/')
    .get(function(req, res) {
        res.render('index', {
            title: 'Zalalko-Backend',
            status: 'On'
        });
    })
    .post(function(req, res) {
    controller.getUser(req, res);
});

module.exports = router;