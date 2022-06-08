const express = require("express");
const passport = require('passport');

const { signUp, getUserByEmail, getUserById } = require('../controllers/auth.js');

// We take the passport configuration outside the server and pass the dependencies and functions needed. 
const initializePassport = require('../passport-config');
initializePassport(
    passport, 
    email => getUserByEmail(email),
    id => getUserById(id)
);

const router = express.Router();

/* POST /signup
 *
 * This route creates a new user account.
 *
 * A desired username and password are submitted to this route via an HTML form,
 * which was rendered by the `GET /signup` route.  The password is hashed and
 * then a new user record is inserted into the database.  If the record is
 * successfully created, the user is logged in.
 */
router.post('/signup', signUp);

/* POST /login/
 *
 * This route authenticates the user by verifying The email and password.
 *
 * The email and password are submitted to this route via an HTML form, which
 * was rendered by the `GET /login` route.  The email and password is
 * authenticated using the `local` strategy.  The strategy will parse the
 * the email and password from the request and call the `verify` function.
 *
 * Upon successful authentication, a login session will be established.  As the
 * user interacts with the app, by clicking links and submitting forms, the
 * subsequent requests will be authenticated by verifying the session.
 *
 * When authentication fails, the user will be re-prompted to login and shown
 * a message informing them of what went wrong.
 */
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.delete('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

router.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name });
});

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
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

module.exports = router;