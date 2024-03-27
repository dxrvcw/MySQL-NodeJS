const http = require("http");
const mysql = require("mysql");
const url = require("url");
const cors = require("cors");

let pass = "DATABASE_PASSWORD";

let connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: pass,
	database: "sneaker_shop",
});

connection.connect((err) => {
	if (err) {
		console.error("Error connecting to database: " + err.stack);
		return;
	}
	console.log("Connected to database");
});

function handleRequest(request, response) {
	let { pathname, query } = url.parse(request.url, true);

	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS"
	);
	response.setHeader("Access-Control-Allow-Headers", "Content-Type");
	response.setHeader("Content-Type", "application/json");

	switch (pathname) {
		case "/":
			showHomePage(response);
			break;
		case "/add":
			addItem(query, response);
			break;
		case "/modify":
			modifyItem(query, response);
			break;
		case "/delete":
			deleteItem(query, response);
			break;
		case "/getById":
			getItemById(query, response);
			break;
		case "/autorization":
			autorization(query, response);
			break;
		default:
			response.writeHead(404, { "Content-Type": "text/plain" });
			response.end("404 Not Found\n");
	}
}

const corsMiddleware = cors({
	origin: "*",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	preflightContinue: false,
	optionsSuccessStatus: 204,
});

function autorization(query, response) {
	let { login, password } = query;
	if (login === "admin" && password === "admin") {
		response.writeHead(200, { "Content-Type": "text/plain" });
		response.end("Success\n");
	} else {
		response.writeHead(401, { "Content-Type": "text/plain" });
		response.end("Unauthorized\n");
	}
}

function showHomePage(response) {
	let cmd = `SELECT * FROM sneakers`;
	connection.query(cmd, (err, rows) => {
		if (err) {
			response.writeHead(500, { "Content-Type": "text/plain" });
			response.end("Internal Server Error\n");
			return;
		}
		let data = JSON.stringify(rows);
		response.writeHead(200, { "Content-Type": "application/json" });
		response.end(data);
	});
}

function addItem(query, response) {
	let { brand, model, color, size, price, description, available_quantity } =
		query;
	let cmd = `INSERT INTO sneakers (brand, model, color, size, price, description, available_quantity) VALUES (?, ?, ?, ?, ?, ?, ?)`;
	connection.query(
		cmd,
		[brand, model, color, size, price, description, available_quantity],
		(err) => {
			if (err) {
				response.writeHead(500, { "Content-Type": "text/plain" });
				response.end("Error adding item\n");
				return;
			}
			response.writeHead(200, { "Content-Type": "text/plain" });
			response.end("Item added successfully\n");
		}
	);
}

function modifyItem(query, response) {
	let { sneaker_id, price, available_quantity } = query;
	let cmd = `UPDATE sneakers SET price = ?, available_quantity = ? WHERE sneaker_id = ?`;
	connection.query(cmd, [price, available_quantity, sneaker_id], (err) => {
		if (err) {
			console.error(err.stack);
			response.writeHead(500, { "Content-Type": "text/plain" });
			response.end("Error modifying item\n");
			return;
		}
		response.writeHead(200, { "Content-Type": "text/plain" });
		response.end("Item modified successfully\n");
	});
}

function deleteItem(query, response) {
	let { sneaker_id } = query;
	let cmd = `DELETE FROM sneakers WHERE sneaker_id = ?`;
	connection.query(cmd, [sneaker_id], (err) => {
		if (err) {
			response.writeHead(500, { "Content-Type": "text/plain" });
			response.end("Error deleting item\n");
			return;
		}
		response.writeHead(200, { "Content-Type": "text/plain" });
		response.end("Item deleted successfully\n");
	});
}

const server = http.createServer((req, res) => {
	corsMiddleware(req, res, () => {
		handleRequest(req, res);
	});
});
server.listen(8080);
console.log(`Server is running at http://localhost:8080`);
