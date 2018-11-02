const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Blu-ray Partners' });
});

/* GET data collection page. */
router.get('/collecte', function(req, res, next) {
	res.render('collecte', { title: 'Borne' });
});

/* POST Quizz page */
router.post('/quizz', function (req, res, next) {
	console.log(req.body);
	res.redirect('quizz', { title: 'Quizz' })
});

/* POST Quizz page */
router.get('/fin', function (req, res, next) {
	console.log(req);
	res.render('fin', { title: 'Fin' })
});

module.exports = router;
