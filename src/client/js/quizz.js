import { POST } from './helpers';

if (document.querySelector('.quizz')) {
	// DOM
	const $answers = document.querySelector('.answers');
	const $validateBtn = $answers.querySelector('.btn');
	const $modal = document.getElementById('myModal');
	const $modalBtn = $modal.querySelector('.btn');
	// Data
	let nextData = null;

	const getAnswer = (activeEl) => {
		const userAnswer = activeEl.innerHTML.trim() === 'Oui';
		return POST('/quizz/next', { userAnswer })
	};

	const getBtnStatus = () => {
		return $answers.querySelector('.btn').getAttribute('disabled') === null;
	};

	const updateBtnStatus = () => {
		if ($answers.querySelector('.active')) {
			$validateBtn.removeAttribute('disabled');
		} else {
			$validateBtn.setAttribute('disabled', 'true');
		}
	};

	const setUpNextQuestion = async (question, count) => {
		const $quizz = document.querySelector('.quizz');
		const $count = $quizz.querySelector('span');
		const $question = $quizz.querySelector('h1');
		const $active = $answers.querySelector('.active');

		$question.innerHTML = question;
		$count.innerHTML = count;
		if ($active) {
			$active.classList.remove('active');
		}
	};

	const setUpNextModal = async (data) => {

		const { question, answer, numOfQuestions, count } = data;
		const $titleCount = $modal.querySelector('.modal-title span');
		const $footerCount = $modal.querySelector('.modal-footer span:first-child');
		const $numOfQuestions = $modal.querySelector('.modal-footer span:nth-child(2)');
		// more questions
		const $question = $modal.querySelector('h3.modal-title');
		const $answer = $modal.querySelector('.modal-body h1');

		$titleCount.innerHTML = count;
		$footerCount.innerHTML = count;
		$question.innerHTML = question;
		$answer.innerHTML = answer;
		$numOfQuestions.innerHTML = numOfQuestions;

		$modalBtn.classList.add('btn-primary');
		$modalBtn.innerHTML = 'Question suivante';

	};

	const setUpEndModal = async (win) => {
		if (win) {
			$modalBtn.classList.add('btn-success');
			$modalBtn.innerHTML = 'Victoire! Fin &rarr;';
		} else {
			$modalBtn.classList.add('btn-danger');
			$modalBtn.innerHTML = 'Mauvaise reponse! Fin &rarr;';
		}
	};

	const resetModalBtn = async () => {
		// reset button
		if ($modalBtn.classList.contains('btn-success')) {
			$modalBtn.classList.remove('btn-success')
		}
		if ($modalBtn.classList.contains('btn-danger')) {
			$modalBtn.classList.remove('btn-danger')
		}
		if ($modalBtn.classList.contains('btn-primary')) {
			$modalBtn.classList.remove('btn-primary')
		}
		$modalBtn.innerHTML = '';
	};

	const navToGameOver = () => {
		location.pathname = '/fin';
	};

	const handleModalBtnClick = () => {
		const { question, count, next } = nextData;
		console.log('M B >> ', nextData);
		if (next) {
			console.log('has next');
			setUpNextQuestion(question, count)
				.then(() => setUpNextModal(nextData))
				.then(() => updateBtnStatus(false))
				.then(() => document.querySelector('.modal-backdrop').click());
		} else {
			navToGameOver();
		}
	};

	const handleAnswerClick = (firstRun = true) => {
		if (getBtnStatus()) {
			// has active answer
			const $active = $answers.querySelector('.active');
			getAnswer($active)
				.then(resp => resp.json())
				.then((data) => {
					nextData = data;
					if (!data.next) {
						resetModalBtn()
							.then(() => setUpEndModal(data.win))
							.then(() => setTimeout(() => location.pathname = '/fin', 30000))
					}
				});
		} else {
			// no active -> update btn status and try once more ONLY if first run
			updateBtnStatus();
			if (firstRun) return handleAnswerClick(false);
		}
	};

	// initial btn status update
	updateBtnStatus();
	// answers click
	$answers.addEventListener('click', updateBtnStatus, false);
	// validate answer btn click
	$answers.querySelector('.btn').addEventListener('click', handleAnswerClick, false);
	// Modal btn click
	$modal.querySelector('.btn').addEventListener('click', handleModalBtnClick, false);
}
