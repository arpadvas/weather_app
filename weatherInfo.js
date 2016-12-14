function printMessage(city, temperature) {
	var message = "The actual wheater in " + city + " is " + temperature + " degrees.";
	console.log(message);
}

var http = require("http");

function printError(error) {
	console.error(error.message);
}

function get(city) {
	var request = http.get("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=c55d418452d87000440c7941c24c86d7", function(response) {
		var body = "";
		response.on("data", function(chunk) {
			body += chunk;
		});
		response.on("end", function() {
			if (response.statusCode === 200) {
				try {
					var weatherInfo = JSON.parse(body);
					printMessage(city, weatherInfo.main.temp);
				} catch(error) {
					printError(error);
				}
			} else {
				printError(http.statusCode[response.statusCode]);
			}
		});
	});

	request.on("error", printError);
}

module.exports.get = get;