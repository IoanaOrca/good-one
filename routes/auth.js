const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

const bcryptSalt = 10;

/* GET users listing. */
router.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/movies');
    return;
  }
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/movies');
    return;
  }
  User.findOne({username: req.body.username})
    .then((result) => {
      if (result) {
        console.log(result);
        console.log('There is a user with that name already');
        res.redirect('/auth/signup');
        return;
      }

      // encrypt the password
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(req.body.password, salt);

      // if the user is new, construct the new user
      const newUser = new User({
        username: req.body.username,
        password: hashPass
      });

      newUser.save()
        .then((user) => {
          req.session.currentUser = user;
          console.log('New user');
          res.redirect('/movies');
        })
        .catch(next);
    })

    .catch(next);
});

router.get('/login', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/movies');
    return;
  }
  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/movies');
    return;
  }
  User.findOne({username: req.body.username})
    .then((result) => {
      if (!result) {
        console.log('User not found');
        res.redirect('/auth/signup');
        return;
      }
      if (bcrypt.compareSync(req.body.password, result.password)) {
        console.log('Correct password');
        req.session.currentUser = result;
        res.redirect('/movies');
      } else {
        console.log('Incorrect password');
        res.redirect('/auth/login');
      }
    })
    .catch(next);
});

router.post('/logout', (req, res, next) => {
  req.session.currentUser = null;
  res.redirect('/movies');
});

module.exports = router;
