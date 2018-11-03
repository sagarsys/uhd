const express = require('express');
const router = express.Router();

const Quizz = require('../src/server/js/quizz');
const Users = require('../src/server/js/users');

const { quizz } = Quizz;
const numOfQuestions = quizz.length;

let user = {};
let publishedQuizzIndices = [];
let correctQuizzIndices = [];
let currentQuestion =  null;

const resetData = () => {
	user = {};
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
		const body = req.body;
		body.forEach(detail => {
			if (detail.name !== 'declare') {
				user[detail.name] = detail.value;
			}
		});

		if (Users.findUser(user)) {
			// user exists
			console.log(1)
			return res.redirect(303, '/fin');
		} else {
			console.log(2)
			// save user to json & csv file
			Users.addUser(user);
			// write to csv files & send mail
			CSV.sendMail().then(() => console.log('Mail sent.'));
			// redirect to quizz
			return res.redirect(303, '/quizz');
		}
	} else {
		console.log(3)
		return res.send(403, { error: 'Veuillez réessayer'})
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
	res.set('Content-Type', 'application/json');

	if (userAnswer === currentQuestion.answer) {
		// correct answer update
		correctQuizzIndices.push(publishedQuizzIndices[publishedQuizzIndices.length - 1]);
	} else {
		// wrong answer -> game over
		const count = publishedQuizzIndices.length;
		res.send({
			next: false,
			win: false,
			numOfQuestions,
			count
		});
	}

	if  (publishedQuizzIndices.length <= numOfQuestions) {
		// if there are more question & correct answer
		const randomInt = Quizz.getRandomInt(numOfQuestions - 1, undefined, publishedQuizzIndices);
		currentQuestion = quizz[randomInt];
		const count = publishedQuizzIndices.length;
		publishedQuizzIndices.push(randomInt);

		res.send({
			next: true,
			win: false,
			question: currentQuestion.question,
			answer: currentQuestion.answer ? 'Oui' : 'Non',
			numOfQuestions,
			count: count
		});
	} else {
		// win
		const count = publishedQuizzIndices.length - 1;

		res.send({
			next: false,
			win: true,
			numOfQuestions,
			count
		});
	}
});

/* POST Quizz end page */
router.get('/fin', function (req, res) {
	const count = correctQuizzIndices.length;
	const win = correctQuizzIndices.length === numOfQuestions;
	if (user && Users.findUser(user)) {
		res.render('fin', { exists: true });
	} else {
		res.render('fin', { title: 'Fin', win, count, numOfQuestions })
	}
});

module.exports = router;
