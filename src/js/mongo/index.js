const mongoose = require('mongoose');
const fs = require('fs');
const Schemas  = require('./schemas');

mongoose.connect('mongodb://localhost/uhd')
	.then(() => console.log('Connected to MongoDB.'))
	.catch((err) => console.error(`MongoDB Connection error \n ${err}`));

const getQuestionsCollection = async () => {
	return await Schemas.Questions.find();
};

getQuestionsCollection().then((questions) => console.log(questions));

module.exports = {
	getQuestionsCollection
};
