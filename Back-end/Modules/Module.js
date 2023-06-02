
import {v4} from "uuid";
import {singl} from './connection.js';

class Module {
	constructor () {
		this.connection = singl.returnconnection();
		this.table = "modules";
	}

	async addModule (name) {
		let id = v4();
		let value = `'${id}', '${name}' `;
		let res = await this.connection.query(`INSERT INTO ${this.table} VALUES (${value});`);
		if (res.command != 'INSERT') {throw "Cпробуйте ще раз";}
		return id;
	}
	async getModule (id) {
		const res = await this.connection.query(`select * from ${this.table} WHERE id = '${id}';`);
		return res.rows[0];
	}
	async getModules () {
		const res = await this.connection.query(`select * from ${this.table} ;`);
		return res.rows;
	}

}

let module = new Module();
export {module};
