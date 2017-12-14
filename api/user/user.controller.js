'use strict';
var mysql      = require('mysql');
var jwt        = require("jsonwebtoken");
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
exports.getUser = function (req, res) {

    var sql = 'SELECT ID, name, surname, email, phone, street, housenr, plz, notiz FROM user WHERE email = ? AND password = ?';
    connection.query(sql, [req.body['email'], req.body['password']], function(err, rows, fields) {
        if (err) {

            logger.error(err);

            throw err;
        }

        logger.info(sql);

        if (rows.length > 0) {

            logger.info('erfolg');

            var token = jwt.sign(rows[0], config.secret, {
                expiresIn: "5m"
            });

            res.send({
                user: rows[0],
                token: token
            });

        } else {

            logger.error('fehler');

            res.send('fehler');
        }
    });
};