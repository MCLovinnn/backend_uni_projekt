/**
 * Project created by Christoph Kramer
 * **/
var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var consolelogger= require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var compose      = require('composable-middleware');
var jwt          = require('jsonwebtoken');
var config       = require('./config');

var user         = require('./api/user');
var product      = require('./api/product');
var order        = require('./api/order');
var register     = require('./api/register');
var logger       = require('./api/logger');

var app = express();

app.set('superSecret', config.secret);

// view engine setup
// for development
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(consolelogger('dev')); //combined
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', user);
app.use('/register', register);
app.use('/product', product);
app.use('/order', order); //  _isAuthenticated(),

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


/**
 * uncommended cause of request problems from front-end
 * **/
function _isAuthenticated() {
    return compose()
        .use(function (req, res, next) {
            // check header or url parameters or post parameters for token
            var token = req.body.token || req.query.token || req.headers['x-access-token'];
            // decode token
            if (token) {
                // verifies secret and checks exp
                jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                    if (err) {
                        return res.json({success: false, message: 'Failed to authenticate token.'});
                    } else {
                        // if everything is good, save to request for use in other routes
                        req.decoded = decoded;
                        next();
                    }
                });

            } else {
                // if there is no token
                // return an error
                return res.status(403).send({
                    success: false,
                    message: 'No token provided.'
                });
            }
        });
}