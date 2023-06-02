
import {v4} from "uuid";
import {singl} from './connection.js';
import fetch from "node-fetch";

class Program {
	constructor () {
		this.connection = singl.returnconnection();
	}
	// eslint-disable-next-line
    async addTask(body){
		let value = `'${body.programId}', '${body.taskId}', '${body.number}', '${false}' `;
		let res = await this.connection.query(`INSERT INTO tasksInProgram VALUES (${value});`);
		if (res.command != 'INSERT') {throw "Cпробуйте ще раз";}
		return true;
	}

	async getProgram (userId, moduleId) {
		try {
			let tasks = [];
			let done = [];
			let string = `select * from program WHERE userid = '${userId}' and moduleId = '${moduleId}';`;
			const res = await this.connection.query(string);
			let string2 = `select * from tasksInProgram WHERE programId = '${res.rows[0].id}';`;
			const tasksIds = await this.connection.query(string2);
			for (let i = 0; i < tasksIds.rows.length; i++) {
				console.log(tasksIds.rows[i]);
				done.push(tasksIds.rows[i].done);
				const task = await this.getTaskInformation(tasksIds.rows[i].taskid);
				tasks.push({id: task.id, name: task.name, type: task.type});
			}
			return {id: res.rows[0].id, moduleid: res.rows[0].moduleid,
				userid: res.rows[0].userid, tasks: tasks, done: done};
		} catch (err) {
			console.log(err);
		}
	}

	async getTaskInformation (id) {
		let idStr = id.toString();
		try {
			const response = await fetch('http://0.0.0.0:8082/tasks/task', {
				method: 'GET', // *GET, POST, PUT, DELETE, etc.
				headers: {
					'Content-Type': 'application/json',
					'id': idStr
				},
			});
			let res = await response.json();
			return res;
		} catch (err) {
			console.log(err);
		}

	}

	async getTask (id) {
		const res = await this.connection.query(`select * from statisticsTasks WHERE id = '${id}';`);
		return res.rows[0] ;
	}

	async addProgram (body) {
		let id = v4();
		let value = `'${id}', '${body.userId}', '${body.moduleId}' `;
		let res = await this.connection.query(`INSERT INTO program VALUES (${value});`);
		if (res.command != 'INSERT') {throw "Cпробуйте ще раз";}
		return id;
	}
	async getWord (id) {
		console.log(id);
		console.log(`select * from statisticsWords WHERE id = '${id}';`);
		const res = await this.connection.query(`select * from statisticsWords WHERE id = '${id}';`);
		return res.rows[0] ;
	}

}

let program = new Program();
export {program};
