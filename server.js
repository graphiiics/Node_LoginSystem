if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express');
//const { redirect } = require('express/lib/response');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session'); 
const methodOverride = require('method-override');

const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const initializePassport = require('./passport-config');
initializePassport(
        passport, 
        email => users.find(user => user.email === email),
        id => users.find(user => user.id === id)
    );

const users = [];

app.set('view-engine', 'ejs');
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
app.use('/auth', authRouter);


app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated,  async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        res.redirect('/login');
    } catch (error){
        console.log(error);
        res.redirect('/register')
    }
    console.log(users);
});

app.delete('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}

const CONNECTION_URL = 'mongodb+srv://m220student:2011670055@mflix.n8n6l.mongodb.net/loginSystem?retryWrites=true&w=majority';

mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    app.listen(3000, () => console.log('Server running on port: 3000'));
}).catch((error) => {
    console.log(`${error} DID NOT CONNECT!`);
})
