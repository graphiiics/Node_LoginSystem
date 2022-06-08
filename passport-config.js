const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById){
    console.log({getUserByEmail});
    
    /* Verify function
    *
    * The `verify` function queries the database for the user record and verifies
    * the password by hashing the password supplied by the user and comparing it to
    * the hashed password stored in the database.  If the comparison succeeds, the
    * user is authenticated; otherwise, not.
    */
    const verify = async (email, password, done) => {
        console.log({email, password});
        const user = await getUserByEmail(email);
        console.log({user});
        if(user == null){
            return done(null, false, { message: 'No user with that email'});
        }

        try {
            if( await bcrypt.compare(password, user.password )){
                return done(null, user);
            }else{
                return done(null, false, { message: 'password incorrect'});
            }
        } catch (error) {
            return done(error);
        }
    }

    /* Configure password authentication strategy.
    *
    * The `LocalStrategy` authenticates users by verifying a username and password.
    * The strategy parses the username and password from the request and calls the
    * `verify` function.
    * 
    * Usually the usernameFile calls username, if we want to change it, we
    * pass and object to define the name that we use as username
    */
    passport.use(new LocalStrategy({ usernameField: 'email' }, verify));

    /* Configure session management.
    *
    * When a login session is established, information about the user will be
    * stored in the session.  This information is supplied by the `serializeUser`
    * function, which is yielding the user ID and username.
    *
    * As the user interacts with the app, subsequent requests will be authenticated
    * by verifying the session.  The same user information that was serialized at
    * session establishment will be restored when the session is authenticated by
    * the `deserializeUser` function.
    *
    * Since every request to the app needs the user ID and username, in order to
    * fetch todo records and render the user element in the navigation bar, that
    * information is stored in the session.
    */

    // used to serialize the user for the session
    passport.serializeUser((user, done) => done(null, user.id));

    // used to deserialize the user
    passport.deserializeUser( async (id, done) => {
        return done(null, await getUserById(id))
    });
}

module.exports = initialize;