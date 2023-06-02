
import * as fs from 'fs';
import {mongo} from './connection.js';


class FileWork {
	constructor () {
		this.outPut = './outPut';
		this.inPut = './inPut';
	}

	async dowlandFile (file) { //з мережі собі
		let path = `${this.inPut}/${file.name}`;
		this.movefile(path, file);
		await mongo.connect();
		mongo.createBucket();
		await mongo.disconnect;
		return path;
	}

	async dowlandToDB (path) {
		let id = await mongo.dowlandFile(path.slice(8), path);
		return id;
	}

	movefile (path, file) {
		file.mv(path, err => {
			if (err) {
				console.log(err);
			}
		});
	}

	deleteFile (path) {
		fs.unlink(path, function (err) {
			if (err) {console.log(err);}
		});
	}
	uploadFile (fileName) { //до мережі
		const fileURL = `${this.outPut}/${fileName}`;
		const stream = fs.createReadStream(fileURL);
		return stream;
	}

	async getFileFromBD (id) {
		try {
			await mongo.connect();
			mongo.createBucket();
			let file = await mongo.uploadFile(id);
			return file;
		} catch (error) {
			console.log(error);
		}
	}
}

let fileWork = new FileWork();

export {fileWork};
