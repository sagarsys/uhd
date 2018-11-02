const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionsSchema = new Schema({
	question: String,
	answer: Boolean
});
const Questions = mongoose.model('Questions', questionsSchema);

const userSchema = new Schema({
	lastName: String,
	firstName: String,
	email: String,
	address: String,
	po: String,
	city: String,
	createdAt: { type: Date, default: Date.now },
	quizzResults: {
		type: [Object],
		default: []
	}
});
const User = mongoose.model('Questions', userSchema);

module.exports = {
	Questions,
	User,
};
