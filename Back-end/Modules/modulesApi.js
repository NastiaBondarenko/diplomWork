import express from "express";
import {module} from './Module.js';
import cors from "cors";
const corsOptions = {
	origin: '*',
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};


const port = 8084;
const host = "0.0.0.0";

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

const urlencodedParser = express.urlencoded({ extended: false });

app.get("/modules", (req, res) => {
	console.log(`/ GET  status: OK`, req);
	res.send("Hello World from moduleApi");
});

app.post("/modules/module", urlencodedParser, async (request, response) => {
	try {
		console.log(request.headers);

		console.log(request.body);
		console.log("POST");
		if (!request.body.name) {throw "Недостатньо даних";}
		let id = await module.addModule(request.body.name);
		response.send({ status: "OK", id: id });
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});

app.get("/modules/module", urlencodedParser, async (request, response) => {
	try {
		console.log(request.headers);
		console.log('method = ', request.method);

		console.log("get");
		if (!request.headers.id) {throw "Недостатньо даних";}
		let res = await module.getModule(request.headers.id);
		response.send({ status: "OK", id: request.headers.id, name: res.name});
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});

app.get("/modules/modules", urlencodedParser, async (request, response) => {
	try {
		console.log(request.headers);
		let modules = await module.getModules();
		response.send({ status: "OK", modules: modules});
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});


app.listen(port, host);
console.log(`Hello from http://${host}:${port}`);
