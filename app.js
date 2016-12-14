var weatherInfo = require("./weatherInfo.js");
var cities = process.argv.slice(2);
cities.forEach(weatherInfo.get);

