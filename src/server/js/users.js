const fs = require('fs');
const path = require('path');
const csvConvertor = require('json-2-csv');
const nodemailer = require('nodemailer');

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
	return users.find(usr => usr.email ===  user.email);
};

const addUser = async (user) => {
	const users = getUsers();
	users.push(user);
	await fs.writeFile(filePath, JSON.stringify(users, undefined, 2), (err) => {
		if (err) console.log(err);
		else {
			console.log(`File written successfully -> ${filePath}`);
			convertJsonToCSVStringAndWriteToFile(users).then(() => sendMail());
		}
	});
};

const convertJsonToCSVStringAndWriteToFile = async (users) => {

	const filePath = path.resolve(__dirname, '../../../data/users.csv');

	// console.log(users)

	const writeCSVToFile = (csv) => {
		// console.log('write csv', csv, filePath);
		fs.writeFileSync(filePath, csv);
	};

	await csvConvertor.json2csv(users,
		(err, csv) => {
			if (err) {
				console.log('json2csv', err);
			}
			writeCSVToFile(csv);
		},
		{
			delimiter: {
				field: '|'
			}
		})
};

const sendMail = async (opts) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'csv.mailer.uhd@gmail.com',
			pass: 'csv2json@uhd'
		}
	});

	const formatDate = (date) => {
		let mm = date.getMonth();
		let dd = date.getDate();
		dd = dd < 10 ? '0'+dd : dd;
		mm = mm < 10 ? '0'+mm : mm;
		return `${dd}/${mm}/${date.getFullYear()} &agrave; ${date.getHours()}:${date.getMinutes()} `
	};

	let mailOptions = {
		from: 'CSVMailer <csv.mailer.uhd@gmail.com>',
		to: 'hubert@bouan.net',
		subject: 'UHD Quizz - Exported User CSV',
		html: `<p>Bonjour,</p>
			<br>
 			<p>Veuillez trouver ci-joint la liste mise-a-jour de tous les participants en format CSV.</p>
 			<br>
 			<p>Bien cordialement,</p>
 			<p>UHD Quizz Team.</p>
 			<br>
 			<small>Envoy&eacute; le ${ formatDate(new Date()) }.</small>
	`,
		attachments: [
			{
				filename: 'users.csv',
				path: './data/users.csv'
			}

		]
	};

	if (opts) {
		mailOptions = Object.assign({}, mailOptions, opts);
	}

	// send mail with defined transport object
	await transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent: %s', info.messageId);
	});
};


module.exports = {
	addUser,
	findUser,
	sendMail
};
