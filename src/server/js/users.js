const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../../../data/users.json');

const getUsers = () => {
	let raw = fs.readFileSync(filePath);
	let users = [];
	try {
		users = JSON.parse(raw)
	} catch ( e ) {
		users = []
	}
	return users;
};

const findUser = (user) => {
	const users = getUsers();
	return users.find(usr => usr.name ===  user.name);
};

const addUser = (user) => {
	const users = getUsers();
	users.push(user);
	try {
		fs.writeFileSync(filePath, JSON.stringify(users, undefined, 2));
	} catch ( e ) {
		console.log(e);
	}
};

module.exports = {
	getUsers,
	addUser,
	findUser
};
