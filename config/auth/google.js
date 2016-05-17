var userRepos = getRepos('users')();

module.exports = function () {
    'use strict';

    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (sessionUser, done) {
        done(null, sessionUser);
    });

    // make sure google+ api is activated in case you have auth problem
    passport.use(new GoogleStrategy({
            clientID: getEnvConfig('tokens').google.oauth.clientId,
            clientSecret: getEnvConfig('tokens').google.oauth.clientSecret,
            callbackURL: getDomain() + '/account/sign-in/google/callback',
            passReqToCallback: true
        },
        function (accessToken, refreshToken, arg, profile, done) {
            userRepos.isUserRegistered(profile, profile.emails[0].value).then(function (signedInUser) {
                done(null, {
                    '_id': signedInUser._id,
                    'email': signedInUser.email
                });
            }, function (err) {
                done(err, null);
            });
        })
    );
};
