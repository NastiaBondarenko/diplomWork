import {MongoClient} from 'mongodb';
import * as mongodb from 'mongodb';
import * as fs from 'fs';
import {ObjectId} from 'mongodb';

class mongoDB {
	constructor () {
		this.dbName = 'diplom2';
		this.uri = "mongodb://user3:1@localhost:27017";
		this.bucket;
		this.client;
	}

	async connect () {
		try {
			this.client = new MongoClient(this.uri);
			return await this.client.connect();

		} catch (e) {
			console.log(e);
		}
	}

	async disconnect () {
		await this.client.close();
		return new Date();

	}

	createBucket () {
		const db = this.client.db(this.dbName);
		this.bucket = new mongodb.GridFSBucket(db);
	}

	async dowlandFile (name, path) {
		let file = fs.createReadStream(path).
			pipe(this.bucket.openUploadStream(name, {
				metadata: { field: name }
			}));
		return file.id.toString();
	}

	async findFile (id) {
		const cursor = this.bucket.find({_id: new ObjectId(id)});
		for (const doc of cursor) {
			return doc.filename;
		}
		return false;
	}

	async uploadFile (id) {
		let name = await this.findFile(id);
		if (!name) {throw "файл не знайдено";}
		let file = this.bucket.openDownloadStream(new ObjectId(id)).
			pipe(fs.createWriteStream(`./outPut/${name}`));
		return file;
	}
}

let mongo = new mongoDB();
// console.log(await mongo.connect());
// mongo.createBucket();
// // let id = mongo.addFile('1_', 'mp3');
// // console.log(id);
// // await mongo.console();
// let id = "64600305865e159144601831";
// mongo.dowlandFile(id,'1_2', 'mp3' );
// await mongo.disconnect
// console.log("close")


export {mongo};
