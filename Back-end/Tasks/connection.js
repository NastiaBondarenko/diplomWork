import pkg from 'pg';
const { Pool } = pkg;

const config = {
	user: 'fordiplom3',
	host: 'localhost',
	database: 'diplom3',
	password: '1',
	port: 5432,
};


class Singleton {
	constructor () {
		this.connection;
	}

	returnconnection () {
		if (!this.connection) {
			this.connection = this.createConnection();
		}
		return this.connection;
	}

	createConnection () {
		return new Pool(config);
	}

}
let singl = new Singleton;
export {singl};
