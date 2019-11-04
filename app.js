var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var engine = require('consolidate');
var passport = require('passport')
var cors = require('cors')
var app = express();
var auth = require('./routes/auth');
var home = require('./routes/home');
var job = require('./routes/job')
var profile = require('./routes/profile');
var user = require('./routes/user')
var oauth =require('./routes/oauth')


var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/noq-se', { promiseLibrary: require('bluebird') })
	.then(() => console.log('connection successful'))
	.catch((err) => console.error(err));


/// mongoose.connect('mongodb+srv://noqadminn:paul12345@noq-gnts0.mongodb.net/test?retryWrites=true&w=majority', {dbName: 'noq'})
//   .then(() =>  console.log('connection succesful'))
//   .catch((err) => console.error(err));

app.set('views', __dirname + '/public/views');
app.engine('html', engine.mustache);
app.set('view engine', 'html')

app.use(logger('dev'));
app.use(function(req, res, next) {
  var allowedOrigins = ['https://noq-client.herokuapp.com'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', "POST, PUT, GET, OPTIONS, DELETE");
  res.header('Access-Control-Allow-Headers', "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,observe");
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));
app.use(express.static(path.join(__dirname, 'dist')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', auth);
app.use('/auth/linkedin', oauth)
app.use('/api/user', user)
app.use('/api/profile', profile);

app.use('/', home);
app.use('/api/jobs', passport.authenticate('jwt', { session: false }), job);



// // // catch 404 and forward to error handler
// app.use(function (req, res, next) {
// 	var err = new Error('Not Found');
// 	err.status = 404;
// 	next(err);
// });

// // restful api error handler
// app.use(function (err, req, res, next) {
// 	console.log(err);

// 	if (req.app.get('env') !== 'development') {
// 		delete err.stack;
// 	}

// 	res.status(err.statusCode || 500).json(err);
// });


// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
module.exports = app;
