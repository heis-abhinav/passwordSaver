const bcrypt = require('bcrypt');
class Verfiy {
	constructor() {
		this.saltRounds = 10;
	}

	createHash (myPlaintextPassword) {
		return new Promise((resolve,reject) => {
			bcrypt.hash(myPlaintextPassword, this.saltRounds).then ((hashh) => {
			    resolve(hashh);
			});
		});
	}

	verifylogin(password, inputPassword) {
		return new Promise((resolve,reject) => {
			bcrypt.compare(inputPassword, password).then((result) => {
				resolve(result);
			});
		});
	}
}

module.exports = Verfiy;