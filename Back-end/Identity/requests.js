import singl from './connection.js';

class RequstsToUser {

	constructor () {
		this.connection = singl.returnconnection();
		this.table = "user2";
	}

	async select (where) {
		console.log(`select * from ${this.table} WHERE ${where};`);
		const res = this.connection.query(`select * from ${this.table} WHERE ${where};`);
		return res;
	}

	async insert (values) {
		console.log(`INSERT INTO ${this.table} VALUES (${values});`);
		let res = this.connection.query(`INSERT INTO ${this.table} VALUES (${values});`);
		return res;
	}

	async delete (where) {
		let res = this.connection.query(`DELETE FROM ${this.table} WHERE ${where};`);
		return res;
	}

	async update (update, where) {
		let res = this.connection.query(`UPDATE ${this.table} SET ${update} WHERE ${where};`);
		return res;
	}
}
let requstsToUser = new RequstsToUser();

export {requstsToUser};
