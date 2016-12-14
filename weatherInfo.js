var EventEmitter = require("events").EventEmitter;
var https = require("https");
var http = require("http");
var util = require("util");


function WeatherInfo(city) {

    EventEmitter.call(this);

    profileEmitter = this;

    var request = http.get("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=c55d418452d87000440c7941c24c86d7", function(response) {
        var body = "";

        if (response.statusCode !== 200) {
            request.abort();
            profileEmitter.emit("error", new Error("There was an error getting the weather info for " + city + ". (" + http.STATUS_CODES[response.statusCode] + ")"));
        }

        //Read the data
        response.on('data', function (chunk) {
            body += chunk;
            profileEmitter.emit("data", chunk);
        });

        response.on('end', function () {
            if(response.statusCode === 200) {
                try {
                    //Parse the data
                    var info = JSON.parse(body);
                    profileEmitter.emit("end", info);
                } catch (error) {
                    profileEmitter.emit("error", error);
                }
            }
        }).on("error", function(error){
            profileEmitter.emit("error", error);
        });
    });
}

util.inherits( WeatherInfo, EventEmitter );

module.exports = WeatherInfo;