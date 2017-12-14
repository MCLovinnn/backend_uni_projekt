'use strict';
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ json: false, timestamp: function() { return (new Date())}}),
        new winston.transports.File({ filename: __dirname + '/../debug.log', json: false, timestamp: function() { return (new Date())} })
    ],
    exceptionHandlers: [
        new (winston.transports.Console)({ json: false, timestamp: function() { return (new Date())}}),
        new winston.transports.File({ filename: __dirname + '/../exceptions.log', json: false, timestamp: function() { return (new Date())} })
    ],
    exitOnError: false
});

module.exports = logger;


/*
 logger.log('silly', "127.0.0.1 - there's no place like home");

 logger.warn("127.0.0.1 - there's no place like home");

 {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
 }

 //
 // Default logger
 //
 winston.log('info', "127.0.0.1 - there's no place like home");
 winston.info("127.0.0.1 - there's no place like home");

 can be defined as RFC5424
 {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7
 }

 */