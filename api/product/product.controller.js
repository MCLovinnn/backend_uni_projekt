'use strict';
var mysql      = require('mysql');
var config     = require('../../config');
var logger     = require('../logger');

var connection = mysql.createConnection(config.DB);
connection.connect();
/***
 * Product Functions
 ***/

/**
 * @param {Request} Request
 * @param {Response} Response
 * @param {Function} Callback
 * **/
exports.getProducts = function (req, res, callback) {
    var sql = 'SELECT a.*, b.name as category FROM product a, product_has_categories c, categories b ' +
        'WHERE a.ID = c.product_ID AND b.ID = c.categories_ID';
    connection.query(sql, function(err, rows, fields) {
        if (err) {
            logger.error(err);
            throw err;
        }

        var result = [
            rows,
            sql
        ];
        res.send(result);

        var log = {
            'function'  : 'getProducts',
            'erg'       : 'erfolg'
        };
        logger.info(log);
    });
};

/**
 * @param {Request} Request
 * @param {Response} Response
 * **/
exports.insertProduct = function (req, res) {
    var sql = 'INSERT INTO product VALUES()';
    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;
        res.send(rows[0]);
    });
};

/**
 * @param {Request} Request
 * @param {Response} Response
 * **/
exports.getProductByID = function (req, res) {
    var sql = 'SELECT * FROM order_has_product WHERE product_ID = ?';
    connection.query(sql, [req.body.product_id], function (err, result) {
        if (err) throw err;
        res.send('Here you get the amount of the bought items with id: '+req.body.product_id);
    });
};

/**
 * @param {Request} Request
 * @param {Response} Response
 * **/
exports.updateProductByID = function (req, res) {
    var product = {
        ID : 1,
        name : 'Vodka',
        description : 'test',
        price : 39.99,
        created : new Date('2016-11-02 14:20:00'),
        createdBy : 'Chris',
        meta : [{
            ID : 1,
            name : 'Testbild',
            url : 'testbild.png',
            pos : 1
        },
        {
            ID : 2,
            name : 'Testbild',
            url : 'testbild.png',
            pos : 1
        }],
        categories : [1,2,3,4]
    };
    _updateTable('product', product, function (bla) {
        if(bla == 1) {
            var counter = 0;

            product.meta[counter].product_ID = product.ID;
            console.log(product.meta[counter]);
            if(counter === product.meta.length-1) {
                _updateTable('meta', product.meta[counter], function (meta) {
                    if (meta === 1) {
                        res.send('erfolg');
                        console.log('erfolg');
                    }
                });
            }
            _updateTable('meta', product.meta[counter], function (meta) {
                if (meta === 1) {
                    counter++;
                }
            });
        }
    });
};

/**
 * @param {Request} Request
 * @param {Response} Response
 * **/
exports.deleteProductByID = function (req, res) {
    var sql = 'DELETE FROM product WHERE ID = ?';
    connection.query(sql, [req.body.product_id], function (err, result, fields) {
        if (err) throw err;

        res.send('erfolg');
    });
};

/**
 * @param {String} Tablename
 * @param {Array} Data
 * @param {Function} Callback
 * **/
function _updateTable(table, data, callback){
    var sql = 'SELECT * FROM '+table+' WHERE ID = ?';
    connection.query(sql, [data.ID], function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        var amount = 0;
        var sql2 = 'UPDATE '+table+' SET ';
        for (var i = 0; i < fields.length; i++) {
            if (fields[i]['name'] != 'created' && result[0][fields[i]['name']] != data[fields[i]['name']]) {
                if(amount > 0) {
                    sql2 += ', ';
                }
                sql2 += fields[i]['name']+' = ?';
                logger.info(fields[i]['name']+' has changed from '+result[0][fields[i]['name']]+' to '+data[fields[i]['name']]);
                amount++;
            }
        }
        sql2+= ' WHERE ID = ?';
        if(amount > 0) {
            console.log(sql2);
        }
        if (typeof callback === 'function') {
            callback(1);
        }
    });
}