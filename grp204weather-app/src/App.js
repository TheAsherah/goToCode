import { Oval } from 'react-loader-spinner';
 import axios from 'axios';
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 import { faFrown } from '@fortawesome/free-solid-svg-icons';
 import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function Grp204WeatherApp() {
    const [input, setInput] = useState('');
    const [weather, setWeather] = useState({
        loading: false,
        data: {},
        error: false,
    });
    const [forecast, setForecast] = useState([]); // New state for storing forecast data

    const toDateFunction = () => {
        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        const WeekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const currentDate = new Date();
        const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
        return date;
    };

    const search = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            setInput('');
            setWeather({ ...weather, loading: true });
            const api_key = 'f00c38e0279b7bc85480c3fe775d518c';

            // Fetch current weather
            const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
            await axios
                .get(weatherUrl, {
                    params: {
                        q: input,
                        units: 'metric',
                        appid: api_key,
                    },
                })
                .then((res) => {
                    setWeather({ data: res.data, loading: false, error: false });
                })
                .catch((error) => {
                    setWeather({ ...weather, data: {}, error: true });
                    setInput('');
                });

            // Fetch 5-day forecast
            const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
            await axios
                .get(forecastUrl, {
                    params: {
                        q: input,
                        units: 'metric',
                        appid: api_key,
                    },
                })
                .then((res) => {
                    // Filter to get one forecast per day (every 24 hours)
                    const dailyForecast = res.data.list.filter((item, index) => index % 8 === 0);
                    setForecast(dailyForecast);
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des prévisions météo :", error);
                });
        }
    };

    return (
        <div className="App">
            <h1 className="app-name">Application Météo grp206</h1>
            <div className="search-bar">
                <input
                    type="text"
                    className="city-search"
                    placeholder="Entrez le nom de la ville..."
                    name="query"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyPress={search}
                />
            </div>
            {weather.loading && (
                <>
                    <Oval type="Oval" color="black" height={100} width={100} />
                </>
            )}
            {weather.error && (
                <>
                    <span className="error-message">
                        <FontAwesomeIcon icon={faFrown} />
                        <span>Ville introuvable</span>
                    </span>
                </>
            )}
            {weather && weather.data && weather.data.main && (
                <div>
                    <h2>{weather.data.name}, {weather.data.sys.country}</h2>
                    <span>{toDateFunction()}</span>
                    <img src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                        alt={weather.data.weather[0].description} />
                    <p>{Math.round(weather.data.main.temp)}°C</p>
                    <p>Vitesse du vent : {weather.data.wind.speed} m/s</p>
                </div>
            )}

            {/* Display 5-day forecast */}
            {forecast.length > 0 && (
                <div className="forecast">
                    <h2>Prévisions météo pour les 5 prochains jours</h2>
                    <div className="forecast-container">
                        {forecast.map((day, index) => (
                            <div key={index} className="forecast-day">
                                <p>{new Date(day.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt="Icone météo" />
                                <p>{Math.round(day.main.temp)}°C</p>
                                <p>{day.weather[0].description}</p>
                                <p>hello nada</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Grp204WeatherApp;
