var express = require('express');
var router = express.Router();
var controller = require('./product.controller.js');

router.route('/')
    .get(function(req, res) {
        controller.getProducts(req, res);
    })
    .post(function () {
        controller.insertProduct(req, res);
    });

router.route('/:product_id')
    .put(function () {
        controller.updateProductByID(req, res);
    })
    .get(function (req, res) {
        controller.getProductByID(req, res);
        //controller.updateProductByID(req, res);
    })
    .delete(function () {
        controller.deleteProductByID(req, res);
    });


module.exports = router;
