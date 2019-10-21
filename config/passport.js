const InstagramStrategy = require('passport-instagram').Strategy;
const keys = require('./keys');

module.exports = (passport) => {
    passport.use(
      new InstagramStrategy({
        clientID: keys.instagramClientID,
        clientSecret: keys.instagramClientSecret,
        callbackURL: "/auth/instagram/callback",
        proxy:true
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(accessToken);
        console.log(profile);
      })
    )
}
