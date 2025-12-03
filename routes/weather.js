// Weather routes - fetches weather data from OpenWeatherMap API
const express = require("express");
const router = express.Router();
const request = require('request');



// Weather search form page
router.get('/', function(req, res, next) {
    res.render('weather.ejs', { weather: null, error: null });
});

// Weather results - handles both form submission and direct city parameter
router.get('/result', function(req, res, next) {
    // Get city from query string (from form or URL)
    let city = req.query.city;
    
    // Sanitize input if sanitizer is available
    if (req.sanitize) {
        city = req.sanitize(city);
    }
    
    // If no city provided, show error
    if (!city || city.trim() === '') {
        return res.render('weather.ejs', { 
            weather: null, 
            error: 'Please enter a city name' 
        });
    }
    
    // Build the API URL
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
    // Make the API request
    request(url, function(err, response, body) {
        if (err) {
            // Network or request error
            return res.render('weather.ejs', { 
                weather: null, 
                error: 'Error connecting to weather service. Please try again.' 
            });
        }
        
        // Parse the JSON response
        let weather = JSON.parse(body);
        
        // Check if we got valid weather data
        if (weather && weather.main) {
            // Success - render with weather data
            res.render('weather.ejs', { 
                weather: {
                    city: weather.name,
                    country: weather.sys.country,
                    temp: weather.main.temp,
                    feels_like: weather.main.feels_like,
                    humidity: weather.main.humidity,
                    description: weather.weather[0].description,
                    icon: weather.weather[0].icon,
                    wind_speed: weather.wind.speed,
                    wind_deg: weather.wind.deg,
                    pressure: weather.main.pressure,
                    visibility: weather.visibility / 1000 // Convert to km
                },
                error: null 
            });
        } else {
            // API returned an error (e.g., city not found)
            let errorMessage = weather.message || 'City not found. Please check the spelling and try again.';
            res.render('weather.ejs', { 
                weather: null, 
                error: errorMessage 
            });
        }
    });
});

module.exports = router;
