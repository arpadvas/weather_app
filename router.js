var WeatherInfo = require("./weatherInfo.js");

function home(request, response) {
	if (request.url === "/") {
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("Header\n");
		response.write("Search\n");
		response.end("Footer\n");
	}
}

function user(request, response) {
	var city = request.url.replace("/", "");
	if (city.length > 0 ) {
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("Header\n");

		var weatherInfo = new WeatherInfo(city);
		weatherInfo.on("end", function(weatherJSON) {
			var values = {
				city: weatherJSON.name,
				temperature: weatherJSON.main.temp
			}
			response.write("The actual wheater in " + values.city + " is " + values.temperature + " degrees.\n");
			response.end("Footer\n");
		});

		weatherInfo.on("error", function(error) {
			response.write(error.message + "\n");
			response.end("Footer\n");
		});
	}
}

module.exports.home = home;
module.exports.user = user;
