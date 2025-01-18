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
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <input
        type="text"
        placeholder="Enter city name..."
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        onKeyDown={handleKeyDown} // Listen for Enter key
      />
      <button onClick={handleSearch} style={{ marginLeft: "10px" }}>
        Search
      </button>
      <button onClick={toggleUnit} style={{ marginLeft: "10px" }}>
        Toggle to {unit === "C" ? "Fahrenheit" : "Celsius"}
      </button>
      {loading && <div style={{ margin: "20px", fontSize: "1.2rem" }}>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {weatherData && (
        <div>
          <h2>
            {weatherData.location.name}, {weatherData.location.region},{" "}
            {weatherData.location.country}
          </h2>
          <p>Temperature: {convertTemperature(weatherData.current.temp_c)}°{unit}</p>
          <p>Condition: {weatherData.current.condition.text}</p>
        </div>
      )}
      <div style={{ marginTop: "20px" }}>
        <h3>Recent Searches</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {recentSearches.map((city, index) => (
            <li
              key={index}
              style={{
                cursor: "pointer",
                color: "#007BFF",
                textDecoration: "underline",
                margin: "5px 0",
              }}
              onClick={() => handleRecentClick(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
