`const quizz = require('../../../data/quizz.json');
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * [Optional] A control array can be passed to ensure that random number is not repeated (recursive)
 */
const getRandomInt = (max, min = 0, controlArr = []) => {
	if (controlArr.length === 0) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} else {
		const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
		if (controlArr.findIndex(i => i === randomInt) === -1) {
			return randomInt;
		} else {
			return getRandomInt(max, min, controlArr);
		}
	}
};

module.exports = {
	quizz,
	getRandomInt
};
