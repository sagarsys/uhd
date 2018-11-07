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
	console.log('reset');
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
			return res.redirect(303, '/fin');
		} else {
			// save user to json & csv file
			Users.addUser(user)
				.then(() => {
					// write to csv files & send mail
					Users.sendMail()
						.then(() => console.log('Mail sent.'))
						// redirect to quizz
						.then(() => res.redirect(303, '/quizz'))
				});
		}
	} else {
		return res.send(403, { error: 'Veuillez réessayer'})
	}
});

/* GET Quizz page */
router.get('/quizz', function (req, res) {
	if (user) {
		const randomInt = Quizz.getRandomInt(numOfQuestions - 1);
		currentQuestion = quizz[randomInt];
		publishedQuizzIndices.push(randomInt);
		console.log('Quizz Current Question', currentQuestion, publishedQuizzIndices);
		res.render('quizz', {
			title: 'Quizz',
			question: currentQuestion.question,
			answer: currentQuestion.answer ? 'Oui' : 'Non',
			count: 1,
			numOfQuestions,
		});
	} else {
		res.redirect(303, '/');
	}
});

router.post('/quizz/next', function(req, res) {
	const { userAnswer } = req.body;
	// res.set('Content-Type', 'application/json');
	console.log('Quizz NEXT Current Question', currentQuestion, publishedQuizzIndices.length);

	if (userAnswer === currentQuestion.answer) {
		// correct answer update
		correctQuizzIndices.push(publishedQuizzIndices[publishedQuizzIndices.length - 1]);

		if  (publishedQuizzIndices.length <= numOfQuestions) {
			console.log('next');
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
			console.log('win');
			// win
			res.send({
				next: false,
				win: true,
				numOfQuestions,
				count: numOfQuestions
			});
		}


	} else {
		console.log('lose');
		// wrong answer -> game over
		const count = publishedQuizzIndices.length;
		res.send({
			next: false,
			win: false,
			numOfQuestions,
			count
		});
	}

});

/* POST Quizz end page */
router.get('/fin', function (req, res) {
	const win = correctQuizzIndices.length === numOfQuestions;
	const count = win ? numOfQuestions : correctQuizzIndices.length;
	if (user && Users.findUser(user) && publishedQuizzIndices && publishedQuizzIndices.length > 0) {
		return res.render('fin', { exists: true });
	} else {
		resetData();
		return res.render('fin', { title: 'Fin', win, count, numOfQuestions });
	}
});

module.exports = router;
