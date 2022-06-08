if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

// dependencies
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session'); 
const methodOverride = require('method-override');

// routes
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// HTTP request logger middleware for node.js
app.use(logger('dev'));

// middleware are both part of bodyParser.
app.use(express.urlencoded({ extended: false }));

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.use('/users', userRouter);
app.use('/', authRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
})

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message,
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    //render the error page
    res.status(err.status || 500);
    res.render('error');
    // res.json({
    //     message: err.message,
    //     error: err
    // });
})


const CONNECTION_URL = 'mongodb+srv://m220student:2011670055@mflix.n8n6l.mongodb.net/loginSystem?retryWrites=true&w=majority';

mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    app.listen(3000, () => console.log('Server running on port: 3000'));
}).catch((error) => {
    console.log(`${error} DID NOT CONNECT!`);
})
