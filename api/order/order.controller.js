'use strict';
var mysql      = require('mysql');
var config     = require('../../config');
var logger     = require('../logger');
var dateFormat = require('dateformat');

var connection = mysql.createConnection(config.DB);
connection.connect();

/***
 * Order Functions
 ***/

/**
 * @param {Request} Request
 * @param {Response} Response
 * **/
exports.getOrders = function (req, res, callback) {
    var sql = 'SELECT * FROM `order`';
    if(typeof req.body.ID == 'number') {
        sql += ' WHERE client_ID = '+req.body.ID;
    }
    connection.query(sql, function(err, rows, fields) {
        if (err) {
            logger.error(err);
            throw err;
        }
        if (rows.length > 0) {
            var tmpRes = rows;
            _getProducts(res, tmpRes, 0);

        } else {
            res.send('no orders');
        }
    });
};

/**
 * @param {Request} Request
 * @param {Response} Response
 * **/
exports.insertOrder = function (req, res) {
    var sql = 'INSERT INTO `order`(' +
        '`ID`, ' +
        '`clients_ID`, ' +
        '`status_ID`, ' +
        '`edited`, ' +
        '`editedBy`, ' +
        '`created`, ' +
        '`createdBy`) VALUES (" ", ?, ?, " ", " ", ?, ?)';

    var date = new Date();
    var string = dateFormat(date, 'yyyy-mm-dd HH:MM:ss');
    var options = [req.body['order']['clients_ID'], req.body['order']['status_ID'], string, req.body['order']['createdBy']];
    console.log(options);
    connection.query(sql, options, function(err, rows, fields) {
        if (err) throw err;

        console.log(req.body['order']['products']);
        console.log(rows);
        if (rows.insertId > 0) {
            _updateOderProducts(res, rows.insertId, req.body['order']['products'], 0);
        } else {
            res.send('fehler');
        }
    });};

/**
 * @param {Request} Request
 * @param {Response} Response
 * **/
exports.updateOrderByID = function (req, res) {
    var counter = 0;
    var order = req.body['order'];
    console.log(order);
    _updateTable('order', order, function (bla) {
        if(bla == 1) {
            var ID = order['order_ID'];
            console.log(order.products[counter]);
            _updateOderProducts(res, ID, order, counter);
        }
    });
};

/**
 * @param {Request} Request
 * @param {Response} Response
 * **/
exports.deleteOrderByID = function (req, res) {
    var sql = 'UPDATE product SET status_ID = 5 WHERE ID = ?';
    connection.query(sql, [req.body['order']['order_id']], function (err, result, fields) {
        if (err) throw err;

        logger.info('Stornierung');
        res.send('erfolg');
    });
};

/**
 * @param {Request} Request
 * @param {Array} Order
 * @param {Number} Counter
 * **/
function _getProducts(res, tmpRes, counter) {
    if (typeof tmpRes[counter] != 'undefined' && tmpRes[counter]['ID'] > 0) {
        var sql2 = 'SELECT a.`product_ID`, a.amount, b.name, b.price FROM `order_has_product` a, product b WHERE a.product_ID = b.ID AND `order_ID` = '+tmpRes[counter]['ID'];
        connection.query(sql2, ['"'+tmpRes[counter]['ID']+'"'], function (err, rows, fields) {
            if (err) {
                logger.error(err);
                throw err;
            }
            tmpRes[counter]['products'] = rows;
            if (tmpRes.length - counter > 0) {
                _getProducts(res, tmpRes, (counter + 1));
            } else {
                var log = {
                    'function': 'getOrders',
                    'erg': 'erfolg'
                };
                logger.info(log);
                res.send(tmpRes);
            }
        });
    } else {
        if (tmpRes.length - counter > 0) {
            _getProducts(res, tmpRes, (counter + 1));
        } else {
            var log = {
                'function': 'getOrders',
                'erg': 'erfolg'
            };
            logger.info(log);
            res.send(tmpRes);
        }
    }
}

/**
 * @param {String} Tablename
 * @param {Object} Data
 * @param {Number} Amount
 * @param {Function} Callback
 * **/
function _updateTable(table, data, amount, callback){
    var sql = 'SELECT * FROM '+table+' WHERE ID = ?';
    connection.query(sql, [data.ID], function (err, result, fields) {
        if (err) throw err;
        console.log(result);
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
        if (amount > 0) {
            console.log(sql2);
            _updateTable(table, data, (amount+1), callback);
        } else {
            if (typeof callback === 'function') {
                callback(1);
            }
        }
    });
}

/**
 * @param {Response} Response
 * @param {Number} OrderID
 * @param {Array} Products
 * @param {Number} Counter
 * **/
function _updateOderProducts(res, ID, data, counter) {
    console.log(data);
    console.log(counter);
    var sql = 'SELECT * FROM `order_has_product` WHERE order_ID = ? AND product_ID = ?';
    connection.query(sql, [ID, data[counter]['product_ID']], function (err, rows, fields) {
        if (err) throw err;

        console.log(rows);
        if (rows.length > 0) {
            //update
            if (rows['amount'] != data[counter]['amount']) {
                var sql2 = 'UPDATE `order_has_product` SET amount = ? WHERE order_ID = ? AND product_ID = ?';
                connection.query(sql2, [ID, data[counter]['product_ID']], function (err, rows, fields) {
                    if (err) throw err;

                    logger.info(rows+' changed To '+data[counter]);
                    if (data.length - counter > 0) {
                        _updateOderProducts(res, ID, data, (counter + 1));
                    } else {
                        res.send('erfolg');
                    }
                });
            }
        } else {
            //insert
            logger.info();
            var sql2 = 'INSERT INTO `order_has_product`(`order_ID`, `product_ID`, `amount`) VALUES (?, ?, ?)';
            connection.query(sql2, [ID, data[counter]['product_ID'], data[counter]['amount']], function (err, rows, fields) {
                if (err) throw err;

                logger.info('Inserted '+data[counter]);
                if (data.length - (counter +1) > 0) {
                    _updateOderProducts(res, ID, data, (counter + 1));
                } else {
                    res.send('erfolg');
                }
            });
        }
    });
}