
import {v4} from "uuid";
import {singl} from './connection.js';

class Dictionary {
	constructor () {
		this.connection = singl.returnconnection();
		this.table = "dictionary";
		this.word;
		this.translation;
		this.id;
	}

	async add (userId, wordId) {
		// try{
		let id = v4();
		let value = `'${id}', '${userId}', '${wordId}', '0.0' `;
		console.log(`INSERT INTO ${this.table} VALUES (${value});`);
		let res = await this.connection.query(`INSERT INTO ${this.table} VALUES (${value});`);
		if (res.command != 'INSERT') {throw "Cпробуйте ще раз";}
		return id;

	}
	async getWordFromDictionary (id) {
		const res = await this.connection.query(`select * from ${this.table} WHERE id = '${id}';`);
		const word = await this.getWord(res.rows[0].wordid);
		// const  word = await this.connection.query(`select * from words WHERE id = '${res.rows[0].wordid}';`);
		return { res: res.rows[0], word: word} ;
	}
	async getDictionary (userId) {
		const res = await this.connection.query(`select * from ${this.table} WHERE userid = '${userId}';`);
		let words = [];
		for (const r of res.rows) {
			words.push(await this.getWord(r.wordid));
		}
		return words;
	}
	async getWord (id) {
		const word = await this.connection.query(`select * from words WHERE id = '${id}';`);
		return word.rows[0];
	}
}

let dictionary = new Dictionary();
export {dictionary};
