'use strict';
var mysql      = require('mysql');
var config     = require('../../config');
var logger     = require('../logger');

var connection = mysql.createConnection(config.DB);
connection.connect();

/***
 * User Functions
 ***/

/**
 * @param {Request} Request
 * @param {Response} Response
 * **/
exports.insertUser = function (req, res) {

    var sql = 'INSERT INTO `user`(`ID`, `name`, `surname`, `email`, `phone`, `street`, `housenr`, `plz`, `notiz`, ' +
        '`password`) VALUES (" ", ?, ?, ?, ?, ?, ?, ?, ?, ?)';


    var values = [];
    values[0] = req.body['name'];
    values[1] = req.body['surname'];
    values[2] = req.body['email'];
    values[3] = req.body['phone'];
    values[4] = req.body['street'];
    values[5] = req.body['housenr'];
    values[6] = req.body['plz'];
    values[7] = req.body['notiz'];
    values[8] = req.body['password'];

    connection.query(sql, values, function(err, rows, fields) {
        if (err) {

            logger.error(err);

            throw err;
        }

        logger.info(sql);

        if (typeof rows.insertId == 'number') {

            logger.info('erfolg');

            res.send('erfolg');

        } else {

            logger.error('fehler');

            res.send('fehler');
        }
    });
};