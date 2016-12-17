var router = require("./router.js")
var http = require("http");
var colors = require("colors");
var message = "Server running at http://127.0.0.1";
http.createServer(function(request, response) {
	router.home(request, response);
	router.user(request, response);
}).listen(80, "127.0.0.1");
console.log(message.green);