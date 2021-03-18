const fs = require('fs');
const crypto = require('crypto');

class Authentication {
	constructor(db_path) {
		this.db_path = db_path;
		this.db = null;
		this.init()
	}

	init() {
		if (fs.existsSync(this.db_path, function(err) {
			if (err)
				console.log('fs.exists: ' + err);
		}) == false) {
			var json_object = {};
			json_object['users'] = {};
			fs.writeFileSync(this.db_path, JSON.stringify(json_object));
		}
		this.load();
	}

	save() {
		fs.writeFileSync(this.db_path, JSON.stringify(this.db));
	}

	load() {
		this.db = JSON.parse(fs.readFileSync(this.db_path, 'utf8'))
	}

	message(result, text) {
		return {"result": result, "message": text};
	}

	success(text) {
		return this.message(true, text);
	}

	error(text) {
		return this.message(false, text);
	}

	userExists(login) {
		return this.db['users'].hasOwnProperty(login);
	}

	getMD5(text) {
		var md5sum = crypto.createHash('md5');
		md5sum.update(text);
		return md5sum.digest('hex').toString();
	}

	register(login, password) {
		if (this.userExists(login))
			return this.error("User already exists");
		this.db['users'][login] = {};
		this.db['users'][login]['password'] = this.getMD5(password);
		this.save();
		return this.success("User registered");
	}

	login(login, password) {
		if (this.userExists(login)) {
			if (this.getMD5(password) == this.db['users'][login]['password']) {
				this.save();
				return this.success("User logined");
			} else {
				return this.error("Password is incorrect");
			}
		} else {
			return this.error("User not exists");
		}
	}
}


exports.Authentication = Authentication;
