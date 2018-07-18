var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var secrets = require('../config/secrets.json');

module.exports.register = function(req, res) {
  var user = new User();

  user.name = req.body.name;
  user.email = req.body.email;

  user.setPassword(req.body.password);
  user.save(function(err) {
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      'token': token,
    });
  });
};
module.exports.login = function(req, res) {
  passport.authenticate('local', function(err, user, info) {
    var token;
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if (user) {
      token = user.generateJwt();
      res.status(200);
      res.json({
        'token': token,
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);
};
module.exports.forgot = function(req,res) {
  crypto.randomBytes(20, function(err, buf) {
    var token = buf.toString('hex');
    User.findOne({email: req.body.email }, function(err,user) {
      if(err) {
        console.log('Passport.Authenticate error' + err);
      }
      if (!user) {
        res.json({'msg': 'Email does not exist'});
      }
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;
      user.save(function(err) {
        if(err) {
          console.log('user save error');
        }
        var smtpTransport = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: secrets.gmail,
            pass: secrets.gmailPass
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'passwordreset@demo.com',
          subject: 'APT Password Reset',
          text:
            'Please click on the following link to reset your password:\n\n' +
            'http://' + 'localhost:4200' + '/reset/' + token + '\n\n'
        };
        smtpTransport.sendMail(mailOptions, function(err,info) {
          if(err) {
            console.log('send mail error');
          }
          res.status(200).json({'msg': 'A reset link has been sent to ' + req.body.email});
        });
      });
    });
  });
};
module.exports.reset = function(req,res) {
  User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (err) {
      console.log('find one err' + err);
    }
    if (!user) {
      res.json({'msg': 'Password reset token is invalid or has expired'});
    }
    user.setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.save(function(err) {
      if(err) {
        console.log('user save error' + err);
      };
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: secrets.gmail,
          pass: secrets.gmailPass
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Password Confirmation Change',
        text:
        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err,info) {
        if(err) {
          console.log('send mail error' + err);
        }
        res.status(200).json({'msg': 'Password sucessfully changed for ' + user.email});
      });
    });
  });
};
