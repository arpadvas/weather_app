var WeatherInfo = require("./weatherInfo.js");
var renderer = require("./renderer.js");
var querystring = require("querystring");

function home(request, response) {
	if (request.url === "/") {
		if (request.method.toLowerCase() === "get") {
			response.writeHead(200, {"Content-Type": "text/html"});
			renderer.view("header", {}, response);
			renderer.view("search", {}, response);
			renderer.view("footer", {}, response);
			response.end();
		} else {
			request.on("data", function(postBody) {
				var query = querystring.parse(postBody.toString());
				response.writeHead(303, {"Location": "/" + query.city});
				response.end();
			});
		}
	}
}

function user(request, response) {
	var city = request.url.replace("/", "");
	if (city.length > 0 ) {
		response.writeHead(200, {"Content-Type": "text/html"});
		renderer.view("header", {}, response);

		var weatherInfo = new WeatherInfo(city);
		weatherInfo.on("end", function(weatherJSON) {
			var values = {
				city: weatherJSON.name,
				temperature: weatherJSON.main.temp,
				humidity: weatherJSON.main.humidity,
				wind: weatherJSON.wind.speed,
				cloudiness: weatherJSON.clouds.all
			}
			renderer.view("result", {city: weatherJSON.name,
				temperature: Math.round(weatherJSON.main.temp),
				humidity: weatherJSON.main.humidity,
				wind: Math.round(weatherJSON.wind.speed * 3.6),
				cloudiness: weatherJSON.clouds.all}, response);
			renderer.view("footer", {}, response);
			response.end();
		});

		weatherInfo.on("error", function(error) {
			renderer.view("error", {errorMessage: error.message}, response);
			renderer.view("search", {}, response);
			renderer.view("footer", {}, response);
			response.end();
		});
	}
}

module.exports.home = home;
module.exports.user = user;
