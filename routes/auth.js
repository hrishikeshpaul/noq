var mongoose = require('mongoose')
var passport = require('passport')
var settings = require('../config/settings')
var async = require('async')
require('../config/passport')(passport)
var express = require('express')
var jwt = require('jsonwebtoken')
var router = express.Router()
var User = require('../models/user')

var crypto = require('crypto')
var nodemailer = require('nodemailer')
var Token = require('../models/Token')
router.post('/register', function (req, res) {

  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'})
  } else {
    var newUser = new User({
      email: req.body.username,
      password: req.body.password,
      role: req.body.role
    })
    // save the user
    newUser.save(function (err) {
      if (err) {
        return res.status(409).json({success: false, msg: 'Username already exists.'})
      }


      var token = new Token({_userId: newUser._id, token: crypto.randomBytes(16).toString('hex')})
      token.save(function (err) {
        if (err) {
          console.log(err)
          return res.status(501).send({msg: err.message})
        }

        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth:{
            user: 'colen81@gmail.com',
            pass: 'Cassidy2011rip.'
          }
        });
        var mailOptions = {
          from: 'noq-reply@noq.com',
          to: newUser.email,
          subject: 'noQ Email Verification ',
          text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api\/auth\/confirmation\/' + token.token + '.\n\n Regards,\nnoQ Admin'
        }
        transporter.sendMail(mailOptions, function (err) {
          if (err) {
            console.log(err)
          }

         return res.status(200).send({success: true, msg: 'A verification email has been sent to ' + newUser.email + '.'})
        })
      })

    })
  }
})

router.post('/login', function (req, res) {
  User.findOne({
    email: req.body.username
  }, function (err, user) {
    if (err) throw err

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'})
    } else if (!user.isVerified) {
      res.status(401).send({success: false, msg: 'User not verified.', link: true})
    } else if (user.isVerified && user.oauth) {
      if (user.oauthToken === req.body.token) {
        var token = jwt.sign(user.toJSON(), settings.secret)
        return res.send({success: true, token: 'JWT ' + token, user: user})
      } else {
        res.status(401).send({success: false, msg: 'Unauthorized User.'})
      }
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), settings.secret)

          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token, user: user})
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'})
        }
      })
    }
  })
})

router.get('/confirmation/:id', function (req, res, next) {
  console.log(JSON.stringify(req.body))
  var token = req.params.id

  // Find a matching token
  Token.findOne({ token: token }, function (err, token) {
    if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

    // If we found a token, find a matching user
    User.findOne({ _id: token._userId}, function (err, user) {
      if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
      if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

      // Verify and save the user
      user.isVerified = true;
      user.save(function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        res.status(200).send("<b>Verified!</b> <br /> Please click <a href='https://noq-client.herokuapp.com/login'>here</a> to login.");
      });
    });
  });
})

router.get('/resend/:id', function (req, res, next) {
  var email = req.params.id
  console.log(email)

  User.findOne({ email: email }, function (err, user) {
    if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
    if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });

    // Create a verification token, save it, and send email
    var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

    // Save the token
    token.save(function (err) {
      if (err) { return res.status(500).send({ msg: err.message }); }

      // Send the email
      var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: 'hrishikeshpaul', pass: 'Keshpaul1996' } });
      var mailOptions = { from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api\/auth\/confirmation\/' + token.token + '.\n' };
      transporter.sendMail(mailOptions, function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        res.status(200).send('A verification email has been sent to ' + user.email + '. Please click <a href=\'https://noq-client.herokuapp.com/login\'>here</a> to go back.');
      });
    });

  });

})

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.status(409).send({msg: 'No account with that email address exists.'});
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'hrishikeshpaul',
          pass: 'Keshpaul1996'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@noq.com',
        subject: 'noq Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/api/auth/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        if (err) return res.status(400).send({msg: 'Something went wrong!'})
        return res.send({msg: 'An e-mail has been sent to ' + req.body.email + ' with further instructions.'})
      });
    }
  ], function (err) {
    if (err) return next(err);
    return res.send('An e-mail has been sent to ' + req.body.email + ' with further instructions.')
  });
});

router.get('/reset/:token', function (req, res, next) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      res.status(400).send({msg: 'Password reset token is invalid or has expired.'});
    }
    res.render('reset_password')
  });
})

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          res.send({msg: 'Password reset token is invalid or has expired.'});
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport( {
        service: 'SendGrid',
        auth: {
          user: 'hrishikeshpaul',
          pass: 'Keshpaul1996'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@noq.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        return res.status(200).send({msg: 'Password has successfully been updated.'})

      });
    }
  ], function(err) {
    return res.status(200).send({msg: 'Password has successfully been updated.'})
  });
});

router.get('/linkedin',
  passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile', ''] }))

router.get('/linkedin/callback', passport.authenticate('linkedin', function (err, user, info) {
  var token = jwt.sign(user.toJSON(), settings.secret)
  // return the information including token as JSON
  return res.json({success: true, token: 'JWT ' + token})

  }
));

router.get('/github',
  passport.authenticate('github'));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.status(200).send({msg: 'Done Auth through github'})
  });

module.exports = router
