const express = require("express");
const port = 3000;
const defaultCity = 'Prague';

let app = express();
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/theme'));

app.get('/', (req, res) => {
    res.render('home.hbs')
});

app.get('/weather', async (req, res) => {
    const city = req.query.city || defaultCity;
    const weather = await getWeather(city);
    if (weather == null)
        res.render('404.hbs', {city});
    else
        res.render('weather.hbs', {weather});
});

app.get('/weather(/:city)', async (req, res) => {
    const city = req.params.city || defaultCity;
    const weather = await getWeather(city);
    if (weather == null)
        res.render('404.hbs', {city});
    else
        res.render('weather.hbs', {weather});
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

async function getWeather(city) {
    const key = "5e6ff961a96fc6ac537e93df595b1f2c";
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`;
    const response = await fetch(url);
    let weather = await response.json();

    if (weather.cod === "404")
        return null;

    let temp = parseInt(weather.main.temp, 10);
    return {
        city: weather.name,
        pressure: weather.main.pressure,
        humidity: weather.main.humidity,
        temperature: temp,
        icon: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    };
}