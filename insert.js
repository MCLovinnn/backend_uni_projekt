'use strict';
var mysql      = require('mysql');
var config     = require('./config');
var xlsx = require('node-xlsx').default;
var fs = require('fs');

var connection = mysql.createConnection(config.DB);
connection.connect();

// Parse a buffer
//const workSheetsFromBuffer = xlsx.parse(fs.readFileSync('BeispieldatenZalAlko.xlsx'));
// Parse a file
var file = xlsx.parse('BeispieldatenZalAlko.xlsx');

var name;

/**
 * called with node insert.js
 *
 * **/
run(0);

function run(catcount) {
    console.log(catcount);
        name = file[catcount]['name'];
        console.log('Name');
        console.log(name);
        console.log('run()');
        insertArtikel(0, catcount);
}

function insertArtikel(artcount, catcount) {
    console.log(artcount);
    console.log('insertArtikel');
    var keywords = [
        'Vodka',
        'Nr. ',
        'Gin',
        'Whiskey'
    ];
    if( typeof file[catcount]['data'][artcount] != 'undefined' && keywords.indexOf(file[catcount]['data'][artcount][0]) == -1 && file[catcount]['data'][artcount][1] != null) {
        console.log('index');
        var sql = 'INSERT INTO `product`(' +
            '`ID`,' +
            '`name`, ' +
            '`description`, ' +
            '`size`, ' +
            '`price`, ' +
            '`company`, ' +
            '`edited`, ' +
            '`created`, ' +
            '`createdBy`) ' +
            'VALUES (' +
            '?,' +
            '?,' +
            '?,' +
            '?,' +
            '?,' +
            '?,' +
            '?,' +
            '?,' +
            '?)';
        var values = [
            '',
            file[catcount]['data'][artcount][1],
            file[catcount]['data'][artcount][5],
            file[catcount]['data'][artcount][3],
            file[catcount]['data'][artcount][4],
            file[catcount]['data'][artcount][2],
            '',
            new Date(),
            'Ich'
        ];

        connection.query(sql, values, function(err, rows, fields) {
            if (err) throw err;

            _updateCategorie(name, rows.insertId, artcount, catcount);

        });
    } else {
        console.log('no index');
        if(file[catcount]['data'].length - artcount < 1) {
            console.log(catcount);
            console.log(file.length);
            console.log(file.length - catcount);
            if(file.length - catcount > 1) {
                console.log('cat + 1');
                run((catcount+1));
            } else {
                console.log('finished');
            }

        } else {
            console.log('art + 1');
            insertArtikel((artcount+1), catcount);
        }
    }
}



function _updateCategorie(name, id, artcount, catcount) {
    console.log('update cat');
    var catID = 0;
    var getcatsql = 'SELECT * FROM `categories` WHERE name = ?';

    connection.query(getcatsql, [name], function (err, rows, fields) {
        if (err) throw err;

        var tmpID = rows[0]['ID'];
        if(rows.length == 0) {
            var catsql = 'INSERT INTO `categories`(`ID`, `name`) VALUES (" ",?)';
            connection.query(catsql, [name], function (err, rows, fields) {
                if (err) throw err;

                catID = rows.insertId;


                    var sql = 'INSERT INTO `product_has_categories`(`product_ID`, `categories_ID`) VALUES (?,?)';
                    connection.query(sql, [id, catID], function (err, rows) {
                        if (err) throw err;

                        if(file[catcount]['data'].length - artcount < 1) {
                            if(file.length - catcount > 1) {
                                console.log('cat + 1');
                                run((catcount+1));
                            } else {
                                console.log('finished');
                            }
                        } else {
                            console.log('art + 1');
                            insertArtikel((artcount+1), catcount);
                        }
                    });

            });
        } else {
            catID = tmpID;
            var sql = 'INSERT INTO `product_has_categories`(`product_ID`, `categories_ID`) VALUES (?,?)';
            connection.query(sql, [id, catID], function (err, rows) {
                if (err) throw err;

                if(file[catcount]['data'].length - artcount < 1) {
                    if(file.length - catcount > 1) {
                        console.log('cat + 1');
                        run((catcount+1));
                    } else {
                        console.log('finished');
                    }
                } else {
                    console.log('art + 1');
                    insertArtikel((artcount+1), catcount);
                }
            });
        }
    });
}