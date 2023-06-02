
import {v4} from "uuid";
import {singl} from './connection.js';

class Word {
	constructor () {
		this.connection = singl.returnconnection();
		this.table = "words";
		this.word;
		this.translation;
		this.id;
	}

	async addWord (body) {
		let id = v4();
		let value = `'${id}', '${body.word}', '${body.translation}' `;
		console.log(`INSERT INTO ${this.table} VALUES (${value});`);
		let res = await this.connection.query(`INSERT INTO ${this.table} VALUES (${value});`);
		if (res.command != 'INSERT') {throw "Cпробуйте ще раз";}
		return id;
	}
	async getWord (id) {
		console.log("here");
		const res = await this.connection.query(`select * from ${this.table} WHERE id = '${id}';`);
		return res.rows[0];
	}
	async getWords () {
		const res = await this.connection.query(`select * from ${this.table};`);
		return res.rows;
	}
}

let word = new Word();
export {word};
