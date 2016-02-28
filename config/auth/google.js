module.exports = function(passport) {
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(sessionUser, done) {
        done(null, sessionUser)
    });

    // make sure google+ api is activated in case you have auth problem
    passport.use(new GoogleStrategy({
            clientID: getConfig('auth')[expressEnv].google.clientId,
            clientSecret: getConfig('auth')[expressEnv].google.clientSecret,
            callbackURL: getDomain() + getConfig('auth')[expressEnv].google.returnUrl,
            passReqToCallback: true
        },
        function(accessToken, refreshToken, arg1, profile, done) {
            done(null, profile);
        }
    ));
};
