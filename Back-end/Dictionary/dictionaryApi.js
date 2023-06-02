import express from "express";
import {word} from './Word.js';
import {dictionary} from './Dictionary.js';
import cors from "cors";

const corsOptions = {
	origin: '*',
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};


const port = 8083;
const host = "0.0.0.0";

const app = express();
app.use(cors(corsOptions));

app.use(express.json());
const urlencodedParser = express.urlencoded({ extended: false });

app.get("/dictionary", (req, res) => {
	console.log(`/ GET  status: OK`, req);
	res.send("Hello World from dictionaryApi");
});

app.post("/dictionary/word", urlencodedParser, async (request, response) => {
	try {
		if (!request.body.word || !request.body.translation) {throw "Недостатньо даних";}
		let id = await word.addWord(request.body);
		response.send({ status: "OK", id: id });
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});

app.get("/dictionary/word", urlencodedParser, async (request, response) => {
	try {
		if (!request.headers.id) {throw "Недостатньо даних";}
		let res = await word.getWord(request.headers.id);
		response.send({ status: "OK", id: request.headers.id, word: res.word, translation: res.traslation});
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});

app.get("/dictionary/words", urlencodedParser, async (request, response) => {
	try {
		let res = await word.getWords(request.body.id);
		response.send({ status: "OK", words: res});
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});

app.post("/dictionary/wordToDictionary", urlencodedParser, async (request, response) => {
	try {
		if (!request.body.userId || !request.body.wordId) {throw "Недостатньо даних";}
		let id = await dictionary.add(request.body.userId, request.body.wordId);
		response.send({ status: "OK" , id: id});
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});

app.get("/dictionary/wordFromDictionary", urlencodedParser, async (request, response) => {
	try {
		if (!request.headers.id) {throw "Недостатньо даних";}
		let res = await dictionary.getWordFromDictionary(request.headers.id);
		response.send({ status: "OK", id: res.res.id, userId: res.res.userId,
			wordId: res.word.id, word: res.word.word, translation: res.word.translation});
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});

app.get("/dictionary/dictionary", urlencodedParser, async (request, response) => {
	try {
		if (!request.headers.userid) {throw "Недостатньо даних";}
		let words = await dictionary.getDictionary(request.headers.userid);
		response.send({ status: "OK", userId: request.headers.userId, words: words});
	} catch (error) {
		response.send({ status: "error", body: error });
	}
});


app.listen(port, host);
console.log(`Hello from http://${host}:${port}`);
