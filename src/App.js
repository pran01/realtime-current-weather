import { useState, useEffect } from "react";
import axios from "axios";
import "./style/App.scss";
import Clear from "./assets/images/Clear.jpg";
import Clouds from "./assets/images/Clouds.jpg";
import Haze from "./assets/images/haze2.jpg";
import Rain from "./assets/images/Rain.jpg";
import { FaSearch } from "react-icons/fa";

const App = () => {
  let [cityFound, setCityFound] = useState(false);
  let [city, setCity] = useState("");
  let [search, setSearch] = useState("");
  let [country, setCountry] = useState("IN");
  let [weather, setWeather] = useState({});
  let [background, setBackground] = useState(Clear);
  let [debouncedTerm, setDebouncedTerm] = useState("");
  let apiKey = "fb31609039bcd2775f23b90826cccedb";
  let api = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&APPID=${apiKey}`;

  //debouncing
  //update search term after 0.8 second of last update of debounced term
  useEffect(() => {
    const timer = setTimeout(() => setSearch(debouncedTerm), 800);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    document.querySelector(".main-container").style.backgroundSize = "cover";

    const changeBackground = (weather) => {
      switch (weather) {
        case "Clear":
          setBackground(Clear);
          break;
        case "Clouds":
          setBackground(Clouds);
          break;
        case "Haze":
          setBackground(Haze);
          break;
        case "Rain":
          setBackground(Rain);
          break;
        default:
          setBackground(Clear);
          break;
      }
    };

    const apiCall = async () => {
      try {
        const res = await axios.get(api).then((res) => res);
        setCityFound(true);
        setWeather({
          ...res.data.main,
          description: res.data.weather[0].description,
        });
        setCountry(res.data.sys.country);
        setCity(res.data.name);
        changeBackground(res.data.weather[0].main);
        document.querySelector(".main-container").style.backgroundSize =
          "cover";
      } catch (error) {
        setCityFound(false);
        changeBackground("Clear");
        document.querySelector(".main-container").style.backgroundSize =
          "cover";
      }
    };
    apiCall();
  }, [city, api]);

  return (
    <div
      className="main-container"
      style={{
        background: `url(${background}) no-repeat center fixed`,
      }}>
      <div className="bg"></div>
      <div className="input-group">
        <input
          type="text"
          value={debouncedTerm}
          placeholder="Enter City"
          onChange={(e) => {
            setDebouncedTerm(e.target.value);
          }}
        />
        <FaSearch className="search-icon" />
      </div>
      <div className="glass-container">
        <div className="glass-content">
          {cityFound ? (
            <div>
              <div className="city-name">
                {city}, <span className="country-code">{country}</span>
              </div>
              <div className="current-weather">
                {Math.round(weather.temp)}
                <span>&#8451;</span>
              </div>
              <div className="real-feel">
                Real Feel:{Math.round(weather.feels_like)}
                <span>&#8451;</span>
              </div>
              <div className="description">{weather.description}</div>
            </div>
          ) : (
            <div className="not-found">City Not Found</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default App;
