
import {User} from './user.js';
import express from "express";
import jwt from 'jsonwebtoken';

const port = 8080;
const host = "0.0.0.0";

const app = express();

app.use(express.json());
const urlencodedParser = express.urlencoded({ extended: false });

app.get("/identity", (req, res) => {
	console.log(`/ GET  status: OK`, req);
	res.send("Hello World from identityApi");
});

app.post("/identity/register", urlencodedParser, async (request, response) => {
	try {
		if (!request.body.name || !request.body.email || !request.body.password) {throw "Недостатньо даних";}
		let user = new User(request.body.name, request.body.email);
		if ((await user.searchInDB()).length > 0) {throw "Користувач з вказаним email вже зареестрований";}
		let token = await user.register(request.body.password);
		console.log(token);
		response.send({ status: "OK", token: token });
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});

app.post("/identity/logIn", urlencodedParser, async (request, response) => {
	try {
		if (!request.body.email || !request.body.password) {throw "Недостатньо даних";}
		let user = new User(' ', request.body.email);
		let token = await user.logIn(request.body.password);
		response.send({ status: "OK" , token: token});
	} catch (error) {
		console.log(`/serfirst/insert POST  status: error  ${error})}`);
		response.send({ status: "error", body: error });
	}
});

app.post("/identity/check", urlencodedParser, async (request, response) => {
	try {
		let token = getTokenFromHeader(request);
		var decoded = jwt.verify(token, 'MySuP3R_z3kr3t');
		let user = new User(decoded.data.name, decoded.data.email);
		if ((await user.searchInDB()).length < 0) {throw "Невірний токен";}
		response.send({ status: "OK" });
	} catch (error) {
		response.send({ status: "error" , message: error});
	}
});

const getTokenFromHeader = (req) => {
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		return req.headers.authorization.split(' ')[1];
	}
};


app.listen(port, host);
console.log(`Hello from http://${host}:${port}`);
