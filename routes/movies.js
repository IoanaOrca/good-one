var express = require('express');
var router = express.Router();

// link the model
const Movie = require('../models/movies');

/* GET users listing. */
router.get('/', (req, res, next) => {
  Movie.find({})
    .then((result) => {
      const data = {
        movies: result // Shorthand object (result can be invisible)
      };
      res.render('movies/movie-list', data);
    })
    .catch(next);
});

router.get('/new', (req, res, next) => {
  if (!req.session.currentUser) {
    /// if the user is not logged in no access
    res.redirect('/auth/login');
    return;
  }
  res.render('movies/movie-new');
});

router.post('/new', (req, res, next) => {
  if (!req.session.currentUser) {
    /// if the user is not logged in no access
    res.redirect('/auth/login');
    return;
  }
  const newMovie = new Movie(req.body);

  newMovie.save()
    .then(() => {
      res.redirect('/movies');
    })
    .catch(next);
});

router.get('/:movieID', (req, res, next) => {
  if (!req.session.currentUser) {
    /// if the user is not logged in no access
    res.redirect('/auth/login');
    return;
  }
  Movie.findById(req.params.movieID)
    .then((result) => {
      const data = {
        movie: result
      };
      res.render('movies/movie-detail', data);
    })
    .catch(next);
});

router.post('/:movieID/delete', (req, res, next) => {
  if (!req.session.currentUser) {
    /// if the user is not logged in no access
    res.redirect('/auth/login');
    return;
  }
  Movie.findByIdAndRemove(req.params.movieID)
    .then(() => {
      res.redirect('/movies');
    })
    .catch(next);
});

module.exports = router;
