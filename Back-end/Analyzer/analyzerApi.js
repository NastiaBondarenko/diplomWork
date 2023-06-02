import express from "express";
// import {analyzer} from './Analyzer.js';
import {statistic} from './Statistic.js';
import { program } from "./Program.js";
import cors from "cors";

const corsOptions = {
	origin: '*',
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};

const port = 8085;
const host = "0.0.0.0";

const app = express();
app.use(cors(corsOptions));

app.use(express.json());
const urlencodedParser = express.urlencoded({ extended: false });

app.get("/analyzer", (req, res) => {
	console.log(`/ GET  status: OK`, req);

	res.send("Hello World from analyzerApi");
});

app.post("/program/task", urlencodedParser, async (request, response) => {
	try {
		if (!request.body.programId || !request.body.taskId || !request.body.number) {throw "Недостатньо даних";}
		await program.addTask(request.body);
		response.send({ status: "OK"});
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});

app.post("/program", urlencodedParser, async (request, response) => {
	try {
		if (!request.body.userId || !request.body.moduleId) {throw "Недостатньо даних";}
		let id = await program.addProgram(request.body);
		response.send({ status: "OK", id: id });
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});

// #todo додати повернення номеру з програми

app.get("/program", urlencodedParser, async (request, response) => {
	try {
		console.log("here");
		// console.log(request.headers);
		if (!request.headers.userid || !request.headers.moduleid) {throw "Недостатньо даних";}
		let res = await program.getProgram(request.headers.userid, request.headers.moduleid);
		console.log({id: res.id, moduleId: res.moduleid, userId: res.userid, tasks: res.tasks, done: res.done});
		response.send({ status: "OK", id: res.id, moduleId: res.moduleid,
			userId: res.userid, tasks: res.tasks, done: res.done});
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});


app.post("/statistic/task", urlencodedParser, async (request, response) => {
	try {
		if (!request.body.userId || !request.body.taskId ||
            !request.body.statistic || !request.body.time) {throw "Недостатньо даних";}
		let id = await statistic.addTask(request.body);
		response.send({ status: "OK", id: id });
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});

app.get("/statistic/task", urlencodedParser, async (request, response) => {
	try {
		if (!request.body.id) {throw "Недостатньо даних";}
		let res = await statistic.getTask(request.body.id);
		response.send({ status: "OK", id: request.body.id, taskId: res.taskid,
			userId: res.userid, statistic: res.statistic, time: res.time });
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});

app.post("/statistic/word", urlencodedParser, async (request, response) => {
	try {
		if (!request.body.userId || !request.body.wordId ||
            !request.body.statistic || !request.body.time) {throw "Недостатньо даних";}
		let id = await statistic.addWord(request.body);
		response.send({ status: "OK", id: id });
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});

app.get("/statistic/word", urlencodedParser, async (request, response) => {
	try {
		if (!request.body.id) {throw "Недостатньо даних";}
		// console.log(statistic.getWord())
		let res = await statistic.getWord(request.body.id);
		response.send({ status: "OK", id: request.body.id, taskId: res.wordId,
			userId: res.userid, statistic: res.statistic, time: res.time });
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});


app.listen(port, host);
console.log(`Hello from http://${host}:${port}`);
