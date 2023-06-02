import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';

const corsOptions = {
	origin: '*',
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};
// const app = express();

const port = 8088;
const host = "0.0.0.0";

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json());

const urlencodedParser = express.urlencoded({ extended: false });

app.get("/main", (req, res) => {
	console.log(`/ GET  status: OK`, req);
	res.send("Hello World from mainApi");
});


app.get("/modules*", urlencodedParser, async (request, response) => {
	try {
		console.log(request.method);
		let url = 'http://0.0.0.0:8084' + request.url;
		response.headers = request.headers;
		response.redirect(url);
	} catch (err) {
		console.log(err);
	}
});

app.post("/modules*", urlencodedParser, async (request, response) => {
	try {
		let url = 'http://0.0.0.0:8084' + request.url;
		response.redirect(308, url);
	} catch (err) {
		console.log(err);
	}
});

app.get("/dictionary*", urlencodedParser, async (request, response) => {
	try {
		console.log(request.method);
		let url = 'http://0.0.0.0:8083' + request.url;
		response.headers = request.headers;
		response.redirect(url);
	} catch (err) {
		console.log(err);
	}
});

app.post("/dictionary*", urlencodedParser, async (request, response) => {
	try {
		let url = 'http://0.0.0.0:8083' + request.url;
		response.redirect(308, url);
	} catch (err) {
		console.log(err);
	}
});

app.get("/multimedia*", urlencodedParser, async (request, response) => {
	try {
		console.log(request.method);
		let url = 'http://0.0.0.0:8081' + request.url;
		response.headers = request.headers;
		response.redirect(url);
	} catch (err) {
		console.log(err);
	}
});

app.post("/multimedia*", urlencodedParser, async (request, response) => {
	try {
		let url = 'http://0.0.0.0:8081' + request.url;
		response.redirect(308, url);
	} catch (err) {
		console.log(err);
	}
});

app.get("/tasks*", urlencodedParser, async (request, response) => {
	try {
		console.log(request.method);
		let url = 'http://0.0.0.0:8082' + request.url;
		response.headers = request.headers;
		response.redirect(url);
	} catch (err) {
		console.log(err);
	}
});

app.post("/tasks*", urlencodedParser, async (request, response) => {
	try {
		let url = 'http://0.0.0.0:8082' + request.url;
		response.redirect(308, url);
	} catch (err) {
		console.log(err);
	}
});

app.get("/statistic*", urlencodedParser, async (request, response) => {
	try {
		console.log(request.method);
		let url = 'http://0.0.0.0:8085' + request.url;
		response.headers = request.headers;
		response.redirect(url);
	} catch (err) {
		console.log(err);
	}
});

app.post("/statistic*", urlencodedParser, async (request, response) => {
	try {
		let url = 'http://0.0.0.0:8085' + request.url;
		response.redirect(308, url);
	} catch (err) {
		console.log(err);
	}
});

app.get("/program*", urlencodedParser, async (request, response) => {
	try {
		console.log(request.method);
		let url = 'http://0.0.0.0:8085' + request.url;
		response.headers = request.headers;
		response.redirect(url);
	} catch (err) {
		console.log(err);
	}
});

app.post("/program*", urlencodedParser, async (request, response) => {
	try {
		let url = 'http://0.0.0.0:8085' + request.url;
		response.redirect(308, url);
	} catch (err) {
		console.log(err);
	}
});

app.get("/identity*", urlencodedParser, async (request, response) => {
	try {
		console.log(request.method);
		let url = 'http://0.0.0.0:8080' + request.url;
		response.headers = request.headers;
		response.redirect(url);
	} catch (err) {
		console.log(err);
	}
});

app.post("/identity*", urlencodedParser, async (request, response) => {
	try {
		let url = 'http://0.0.0.0:8080' + request.url;
		response.redirect(308, url);
	} catch (err) {
		console.log(err);
	}
});


app.listen(port, host);
console.log(`Hello from http://${host}:${port}`);
