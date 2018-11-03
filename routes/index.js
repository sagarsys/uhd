const express = require('express');
const router = express.Router();

const Quizz = require('../src/server/js/quizz');

const { quizz } = Quizz;
const numOfQuestions = quizz.length;

let user = null;
let publishedQuizzIndices = [];
let correctQuizzIndices = [];
let currentQuestion =  null;

const resetData = () => {
	user = null;
	publishedQuizzIndices = [];
	correctQuizzIndices = [];
	currentQuestion = null;
};

/* GET home page. */
router.get('/', function(req, res) {
	resetData();
    res.render('index', { title: 'Blu-ray Partners' });
});

/* GET data collection page. */
router.get('/collecte', function(req, res) {
	res.render('collecte', { title: 'Borne' });
});

/* POST User details collection  */
router.post('/user', function (req, res) {
	if (req.body.length > 0) {
		req.body.forEach(detail => {
			user = {};
			user[detail.name] = detail.value;
		});
		console.log(user);
		res.redirect(303, '/quizz');
	} else {
		res.send(403, { error: 'Unknown error. Please try again.'})
	}
});

/* GET Quizz page */
router.get('/quizz', function (req, res) {
	if (user) {
		const randomInt = Quizz.getRandomInt(numOfQuestions - 1);
		currentQuestion = quizz[randomInt];
		publishedQuizzIndices.push(randomInt);
		res.render('quizz', {
			title: 'Quizz',
			question: currentQuestion.question,
			answer: currentQuestion.answer ? 'Oui' : 'Non',
			numOfQuestions,
			count: 1
		});
	} else {
		res.redirect(303, '/');
	}
});

router.post('/quizz/next', function(req, res) {
	const { userAnswer } = req.body;
	if (userAnswer === currentQuestion.answer) {
		// correct answer
		correctQuizzIndices.push(publishedQuizzIndices[publishedQuizzIndices.length - 1]);
	} else {
		// wrong answer -> game over
		res.status(403).send({ next: false, win: false });
	}

	// if there are more question
	if (numOfQuestions > publishedQuizzIndices.length) {
		const randomInt = Quizz.getRandomInt(numOfQuestions - 1, undefined, publishedQuizzIndices);
		currentQuestion = quizz[randomInt];
		publishedQuizzIndices.push(randomInt);
		res.status(200).send({
			question: currentQuestion.question,
			answer: currentQuestion.answer ? 'Oui' : 'Non',
			numOfQuestions,
			count: publishedQuizzIndices.length
		});
	} else {
		res.status(403).send({ next: false, win: true });
	}
});

// router.post('/results',  function(req, res) {
// 	console.log(req.body);
// 	res.redirect(303, '/fin');
// });

/* POST Quizz end page */
router.get('/fin', function (req, res) {
	res.render('fin', { title: 'Fin' })
});

module.exports = router;
