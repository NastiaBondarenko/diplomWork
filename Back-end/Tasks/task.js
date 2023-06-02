
import {v4} from "uuid";
import {singl} from './connection.js';

class Task {
	constructor () {
		this.table = 'tasks';
		this.connection = singl.returnconnection();
		this.module_id;
		this.file_id;
		this.task;
		this.task2;
		this.answers;
	}

	async addTask (body) {
		try {
			let id = v4();
			let value = `'${id}', '${body.name}', '${body.type}', '${body.moduleId}'`;
			if (body.file_id) {value += `, '${body.file_id}' `;} else {value += `, null`;}
			value += `, '${body.task}' `;
			if (body.task2) {value += `, '${body.task2}'`;} else {value += `, ''`;}
			if (body.answers) {value += `, '${body.answers}'`;}
			console.log(value);
			let res = await this.connection.query(`INSERT INTO ${this.table} VALUES (${value});`);
			if (res.command != 'INSERT') {throw "Cпробуйте ще раз";}
			return id;
		} catch (err) {
			console.log(err);
		}
	}

	async getTask (id) {
		const res = await this.connection.query(`select * from ${this.table} WHERE id = '${id}';`);
		return res.rows[0];
	}

	async addWords (id, words) {
		for (const word of words) {
			let res = await this.connection.query(`INSERT INTO wordsintask VALUES ( '${word.id}', '${id}');`);
			if (res.command != 'INSERT') {throw "Cпробуйте ще раз";}
		}
		return true;
	}

	async getTasksByWords (wordId) {
		const tasksId = await this.connection.query(`select taskid from wordsintask WHERE wordid = '${wordId}';`);
		let tasks = [];
		for (const task of tasksId.rows) {
			tasks.push(await this.getTask(task.taskid));
		}
		return tasks;
	}
}

let task = new Task();
export {task};
