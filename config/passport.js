var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var crypto = require('crypto');
var User = mongoose.model('User');
const { sendMail } = require('../services/mailer');

passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]'
}, function(email, password, done) {
    User.findOne({
        email: email,
        login_blocked: {
            $ne: true
        }
    }).then(function(user) {
        if (!user) {
            return done(null, false, { error_code: "user_password_wrong", error_message: "Wrong username or password !" });
        }
        if (!user.validPassword(password)) {
            user.attemp_login = (user.attemp_login || 0) + 1
            if (user.attemp_login >= 5) {
                user.login_blocked = true

                // Make token
                const buf = crypto.randomBytes(20);
                user.reset_password_token = buf.toString('hex');
                user.reset_password_expired = Date.now() + 3600000; // 1 hour
                user.save()

                // Sent reset link
                sendMail({
                    to: "daonguyencm10@gmail.com",
                    subject: "TEST",
                    body: user.resetPasswordToken,
                })
                return done(null, false, { error_code: "user_account_login_blocked", error_message: "Your account had been blocked! " });
            }
            user.save()
            return done(null, false, { error_code: "user_password_wrong", error_message: "Wrong username or password !" });
        }

        return done(null, user);
    }).catch(done);
}));