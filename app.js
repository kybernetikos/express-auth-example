
/**
 * Module dependencies.
 */

var express = require('express');
var user = require('./routes/user');
var flash = require('connect-flash');
var http = require('http');
var path = require('path');
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var auth = require('./lib/auth');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('tremendous cabbages of arkansas'));
app.use(flash());
app.use(express.bodyParser());
app.use(express.session());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(auth));
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

function render(view, model) {
	return function(req, res){
		var myModel = Object.create(model);
		myModel.flash = req.flash();
		myModel.user = req.user;
		res.render(view, myModel);
	};
}

app.get('/', render('index', {title: 'this app'}));
app.get('/users', ensureLoggedIn('/login'), user.list);
app.get('/login', render('login', {title: 'login'}));
app.post('/login', passport.authenticate('local', {
		successReturnToOrRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	})
);
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
