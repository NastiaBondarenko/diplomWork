import express from "express";
import {task} from './task.js';
import cors from "cors";

const corsOptions = {
	origin: '*',
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};

const port = 8082;
const host = "0.0.0.0";

const app = express();
app.use(cors(corsOptions));

app.use(express.json());
const urlencodedParser = express.urlencoded({ extended: false });

app.get("/tasks", (req, res) => {
	console.log(`/ GET  status: OK`, req);
	res.send("Hello World from tasksApi");
});


app.post("/tasks/task", urlencodedParser, async (request, response) => {
	try {
		if (!request.body.type || !request.body.moduleId || !request.body.task) {throw "Недостатньо даних";}
		let id = await task.addTask(request.body);
		response.send({ status: "OK", id: id });
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});

app.get("/tasks/task", urlencodedParser, async (request, response) => {
	try {
		if (!request.headers.id) {throw "Недостатньо даних";}
		let res = await task.getTask(request.headers.id);
		response.send({ status: "OK", id: res.id, name: res.name, type: res.type, moduleId: res.module_id,
			fileId: res.file_id, task: res.task, task2: res.task2, answers: res.answers});
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});

app.post("/tasks/addWordsToTask", urlencodedParser, async (request, response) => {
	try {
		if (!request.body.taskId || !request.body.words) {throw "Недостатньо даних";}
		let res = await task.addWords(request.body.taskId, request.body.words);
		if (res) {response.send({ status: "OK" });}
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});

app.get("/tasks/getTasksByWords", urlencodedParser, async (request, response) => {
	try {
		if (!request.body.wordId) {throw "Недостатньо даних";}
		let tasks = await task.getTasksByWords(request.body.wordId);
		response.send({ status: "OK", tasks: tasks});
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});


app.listen(port, host);
console.log(`Hello from http://${host}:${port}`);
