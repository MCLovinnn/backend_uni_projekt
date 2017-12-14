var express = require('express');
var router = express.Router();
var controller = require('./order.controller.js');

router.route('/')
    .get(function(req, res) {
        controller.getOrders(req, res);
    })
    .post(function (req, res) {
        controller.insertOrder(req, res);
    });

router.route('/:ID')
    .get(function(req, res) {
        controller.getOrders(req, res);
    })
    .put(function (req, res) {
        controller.updateOrderByID(req, res);
    })
    .delete(function (req, res) {
        controller.deleteOrderByID(req, res);
    });


module.exports = router;
