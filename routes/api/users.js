var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');
const { check, validationResult } = require('express-validator');

router.get('/user', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }

        return res.json({ user: user.toAuthJSON() });
    }).catch(next);
});

router.put('/user', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }

        // only update fields that were actually passed...
        if (typeof req.body.user.username !== 'undefined') {
            user.username = req.body.user.username;
        }
        if (typeof req.body.user.email !== 'undefined') {
            user.email = req.body.user.email;
        }
        if (typeof req.body.user.bio !== 'undefined') {
            user.bio = req.body.user.bio;
        }
        if (typeof req.body.user.image !== 'undefined') {
            user.image = req.body.user.image;
        }
        if (typeof req.body.user.password !== 'undefined') {
            user.setPassword(req.body.user.password);
        }

        return user.save().then(function() {
            return res.json({ user: user.toAuthJSON() });
        });
    }).catch(next);
});

router.post('/users/login', [
    check('user.email').isEmail().withMessage({ error_code: "user_email_invalid", error_message: 'email is invalid format' }),
    check('user.password')
    .isLength({ min: 8 }).withMessage({ error_code: "user_password_min_length", error_message: 'must be at least 8 chars long' })
    .matches(/[a-z]/).withMessage({ error_code: "user_password_contain_lowercase", error_message: 'must contain a lowercase letter' })
    .matches(/[A-Z]/).withMessage({ error_code: "user_password_contain_uppercase", error_message: 'must contain a uppercase letter' })
    .matches(/[0-9]/).withMessage({ error_code: "user_password_contain_number", error_message: 'must contain a number' })
    .matches(/[!@#$%^&*]/).withMessage({ error_code: "user_password_special_character", error_message: 'must contain a special character' }),
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json(errors.array()[0].msg);
    }

    passport.authenticate('local', { session: false }, function(err, user, info) {
        if (err) { return next(err); }

        if (user) {
            user.token = user.generateJWT();
            return res.json({ error_code: "user_login_success", error_message: "success", data: { user: user.toAuthJSON() } });
        } else {
            return res.status(200).json(info);
        }
    })(req, res, next);
});

router.post('/users', [
    check('user.email')
    .isEmail().withMessage({ error_code: "user_email_invalid", error_message: 'email is invalid format' })
    .custom(value => {
        return User.findOne({ email: value }).then(user => {
            if (user) {
                return Promise.reject({ error_code: "user_email_exist", error_message: 'email already in use' });
            }
        })
    }),
    check('user.password')
    .isLength({ min: 8 }).withMessage({ error_code: "user_password_min_length", error_message: 'must be at least 8 chars long' })
    .matches(/[a-z]/).withMessage({ error_code: "user_password_contain_lowercase", error_message: 'must contain a lowercase letter' })
    .matches(/[A-Z]/).withMessage({ error_code: "user_password_contain_uppercase", error_message: 'must contain a uppercase letter' })
    .matches(/[0-9]/).withMessage({ error_code: "user_password_contain_number", error_message: 'must contain a number' })
    .matches(/[!@#$%^&*]/).withMessage({ error_code: "user_password_special_character", error_message: 'must contain a special character' }),
], function(req, res, next) {
    var user = new User();

    user.username = req.body.user.email;
    user.email = req.body.user.email;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json(errors.array()[0].msg);
    }

    user.setPassword(req.body.user.password);

    user.save().then(function() {
        // Send email

        return res.json({ error_code: "user_create_success", error_message: "success", data: { user: user.toAuthJSON() } });
    }).catch(next);
});

module.exports = router;