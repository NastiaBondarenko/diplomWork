
import express from "express";
import fileUpload from 'express-fileupload';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import {fileWork} from './fileWork.js';


const port = 8081;
const host = "0.0.0.0";

const app = express();

// enable files upload
app.use(fileUpload({
	createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.get("/multimedia", (req, res) => {
	console.log(`/ GET  status: OK`, req);
	res.send("Hello World from multimediaApi");
});

app.post("/multimedia/file", async (req, res) => {
	let promise = new Promise(function (resolve, reject) {
		setTimeout(async function () {
			if (req.files == undefined) {reject("файл не передано");} else {
				let file = req.files.file;
				let path = fileWork.dowlandFile(file);
				resolve(path);
			}
		}, 150);
	});
	promise.then(async function (path) {
		let promise2 = new Promise(function (resolve) {
			setTimeout(async function () {
				let id = await fileWork.dowlandToDB(path);
				resolve([path, id]);
			}, 150);
		});
		promise2.then(async function (input) {
			fileWork.deleteFile(input[0]);
			res.send({ status: "OK", id: input[1]});
		});
	}).catch(error => {
		res.send({ status: "error", body: error});
	});

});

app.get('/multimedia/file', async (req, res) => {
	let promise = new Promise(function (resolve, reject) {
		setTimeout(async function () {
			let id = req.body.id;
			let file = await fileWork.getFileFromBD(id);
			// console.log(file== undefined)
			if (file == undefined) {reject("файл не передано");} else {resolve(file);}
		}, 10);
	});
	promise.then((file)=> {
		let promise2 = new Promise(function (resolve) {
			setTimeout(async function () {
				let stream = fileWork.uploadFile(file.path.slice(9));
				let type;
				if (file.path[file.path.length - 1] == 3) {
					type = 'audio/mpeg';
				} else {
					type = 'video/mp4';
				}
				res.set({
					'Content-Disposition': `attachment; filename='${file.path.slice(9)}'`,
					'Content-Type': type,
				});
				stream.pipe(res);
				resolve(file);
			}, 10);
		});
		promise2.then((file)=>{
			fileWork.deleteFile(file.path);
		});

	}).catch(error => {
		res.send({ status: "error", body: error});
	});


});


app.listen(port, host);
console.log(`Hello from http://${host}:${port}`);
