import React, { useState } from "react";
import { fetchWeather } from "./api/fetchWeather";
import { useTemperature } from "./context/TemperatureContext";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const { unit, toggleUnit } = useTemperature(); // Use temperature context

  const convertTemperature = (tempC) =>
    unit === "C" ? tempC : (tempC * 9) / 5 + 32;

  const fetchData = async (city) => {
    setLoading(true);
    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
      setCityName("");
      setError(null);

      // Add to recent searches
      if (!recentSearches.includes(city)) {
        setRecentSearches((prev) => [city, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (cityName.trim()) {
      await fetchData(cityName.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Trigger search on Enter
    }
  };

  const handleRecentClick = (city) => {
    fetchData(city);
  };

  return (
    <div className="app">
      <header>
        <h1>Weather App</h1>
      </header>
      <main>
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter city name..."
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            onKeyDown={handleKeyDown} // Listen for Enter key
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
          <button onClick={toggleUnit} className="toggle-button">
            Toggle to {unit === "C" ? "Fahrenheit" : "Celsius"}
          </button>
        </div>
        {loading && <div className="loading-indicator">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {weatherData && (
          <div className="weather-info">
            <h2>
              {weatherData.location.name}, {weatherData.location.region},{" "}
              {weatherData.location.country}
            </h2>
            <p>Temperature: {convertTemperature(weatherData.current.temp_c)}°{unit}</p>
            <p>Condition: {weatherData.current.condition.text}</p>
          </div>
        )}
        <div className="recent-searches">
          <h3>Recent Searches</h3>
          <ul>
            {recentSearches.map((city, index) => (
              <li
                key={index}
                className="recent-item"
                onClick={() => handleRecentClick(city)}
              >
                {city}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default App;
