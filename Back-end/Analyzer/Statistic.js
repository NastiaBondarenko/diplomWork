
import {v4} from "uuid";
import {singl} from './connection.js';

class Statistic {
	constructor () {
		this.connection = singl.returnconnection();
		this.typeOfTasks = ['translationsToUkr', 'translationsToItal' , 'compliance' , 'choice' , 'addition'];
	}

	async addTask (body) {
		let id = v4();
		let value = `'${id}', '${body.userId}', '${body.taskId}', '${body.statistic}', '${body.time}' `;
		let res = await this.connection.query(`INSERT INTO statisticsTasks VALUES (${value});`);
		if (res.command != 'INSERT') {throw "Cпробуйте ще раз";}
		return id;
	}
	async getTask (id) {
		const res = await this.connection.query(`select * from statisticsTasks WHERE id = '${id}';`);
		return res.rows[0] ;
	}

	async addWord (body) {
		let id = v4();
		let value = `'${id}', '${body.userId}', '${body.wordId}', '${body.statistic}', '${body.time}' `;
		let res = await this.connection.query(`INSERT INTO statisticsWords VALUES (${value});`);
		if (res.command != 'INSERT') {throw "Cпробуйте ще раз";}
		return id;
	}
	async getWord (id) {
		console.log(id);
		console.log(`select * from statisticsWords WHERE id = '${id}';`);
		const res = await this.connection.query(`select * from statisticsWords WHERE id = '${id}';`);
		return res.rows[0] ;
	}

	async getStaticticForWord (userId, wordId) {
		let string = `select * from statisticsWords WHERE wordid = '${wordId}' and userid = '${userId}';`;
		const res = await this.connection.query(string);
		if (res.row.length < 5) {return 0;} else {
			let suma = 0;
			for (let i = 0; i < res.row.length; i++) {
				suma += res.row[i].statistic;
			}
			return Math.round(suma / res.row.length);
		}

	}

	async getStaticticForDictionary (userId) {
		let headers = new Headers();
		headers.append('userId', userId);
		let res = await fetch('http://0.0.0.0:8083/dictionary/dictionary', {
			method: 'GET',
			headers: headers
		});
		let wordStatistic = [];
		for (let i = 0; i < res.words.length; i++) {
			let statistic = this.getStaticticForDictionary(userId, res.words[i].id);
			wordStatistic.push([res.words[i].id, statistic]);
		}
		return wordStatistic;
	}

	async getStaticticForTypeOfTasks (userId, typeOfTasks) {
		let string = `select * from statisticsWords WHERE taskType = '${typeOfTasks}' and userid = '${userId}';`;
		const res = await this.connection.query(string);
		let suma = 0;
		for (let i = 0; i < res.row.length; i++) {
			suma += res.row[i].statistic;
		}
		return suma / res.row.length;
	}

	async getStaticticForTasks (userId) {
		let suma = 0;
		let statisticTask = [];
		for (let i = 0; i < this.typeOfTasks.length; i++) {
			let st = this.getStaticticForTypeOfTasks(userId, this.typeOfTasks[i]);
			statisticTask.push([this.typeOfTasks[i], st]);
			suma += st;
		}
		for (let i = 0; i < statisticTask.length; i++) {
			statisticTask[i].push(statisticTask[i][1] * 100 / suma);
		}
		return statisticTask;
	}

}

let statistic = new Statistic();
export {statistic};
