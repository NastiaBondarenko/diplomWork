import jwt from 'jsonwebtoken';
const { sign } = jwt;
import {requstsToUser} from './requests.js';


class User {
	constructor (name, email) {
		this.id;
		this.name = name;
		this.email = email;
		this.password ;
		this.token;
		// console.log("here");
	}

	//#TODO хешувати пароль

	checkPassword (password) {
		this.password = password;
		if (this.password.length < 8) {throw ("Пароль занадто короткий");}
		if (this.password.length > 30) {throw "Пароль занадто довгий";}
		if (this.password.includes(' ')) {throw "Пароль не повинен містити пробіли";}
		if (this.password.search(/\d/) == -1) {throw "Пароль повинен містити щонайменше одну цифру";}
		if ((this.password.search(/[A-Z]/) == -1) && (this.password.search(/[А-Я]/) == -1)) {
			throw "Пароль повинен містити щонайменше одну велику літеру";
		}
		if ((this.password.search(/[a-z]/) == -1) && (this.password.search(/[a-я]/) == -1)) {
			throw "Пароль повинен містити щонайменше одну маленьку літеру";
		}
		return true;
	}

	async searchInDB () {
		let select = await requstsToUser.select(`login = '${this.email}'`);
		return select.rows;
	}

	async logIn (password) {
		let select = await requstsToUser.select(`login = '${this.email}' and password ='${password}'`);
		if (select.rows.length < 0) {throw "Не вірний логін чи пароль";}
		this.id = select.rows[0].user_id;
		this.name = select.rows[0].name;
		let token = this.generateToken();
		return token;
	}

	async register (password) {
		if (this.checkPassword(password)) {
			let id = await this.addtoDatabase();
			this.id = id;
			let token = this.generateToken();
			console.log(token);
			return token;
		}
	}

	async addtoDatabase () {
		let value = `DEFAULT, '${this.name}', '${this.email}', '${this.password}'`;
		let res = await requstsToUser.insert(value);
		let user = await requstsToUser.select(`login = '${this.email}'`);
		if (res.command == "INSERT") {return user.rows[0].user_id;}
	}

	generateToken () {

		const data = {
			_id: this.id,
			name: this.name,
			email: this.email
		};
		//#TODO перенести це в env
		const signature = 'MySuP3R_z3kr3t';
		return sign({ data, }, signature);
	}
}

export {User};
