var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var secrets = require('../config/secrets.json');
var auth = jwt({
  secret: secrets.secret,
  userProperty: 'payload',
});
var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');

router.get('/profile', auth, ctrlProfile.profileRead);

router.post('/register', ctrlAuth.register);

router.post('/login', ctrlAuth.login);

module.exports = router;
