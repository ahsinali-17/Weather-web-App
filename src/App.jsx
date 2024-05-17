import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [value, setvalue] = useState("");
  const [weather, setWeather] = useState({ condition: { icon: "", text: "" } });
  const [location, setlocation] = useState({});
  const [locArray, setlocArray] = useState([]);
  const days = [
    "Monday",
    "Teusday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [hour, sethour] = useState(0);
  const [date, setdate] = useState(0);
  useEffect(() => {
    const fetchWeather = async () => {
      let weather = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=d11e60f2ef9a48bda90144617240905&q=rawalpindi`
      );
      let weatherData = await weather.json();
      setWeather(weatherData.current);
      setlocation(weatherData.location);
      setdate(weatherData.current.last_updated.split(" ")[0]);
      let hour = weatherData.current.last_updated.split(" ")[1];
      hour =
        hour.split(":")[0] > 12
          ? `${hour.split(":")[0] - 12 + ":" + hour.split(":")[1]}pm`
          : `${hour}am`;
      sethour(hour);
    };
    fetchWeather();
  }, []);

  const handleChange = async (e) => {   //update input bar's value and get matching cities
    setvalue(e.target.value);
    let tempLoc = await fetch(
      `http://api.weatherapi.com/v1/search.json?key=d11e60f2ef9a48bda90144617240905&q=${value}`
    );
    let cities = await tempLoc.json();
    setlocArray(cities);
  };

  const getCity = async () => {   //change city on clicking search button
    try {
      let weather = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=d11e60f2ef9a48bda90144617240905&q=${value}`
      );
      
      if (!weather.ok) 
        throw new Error('City not found');
    
      let weatherData = await weather.json();
      setvalue("");
      setWeather(weatherData.current);
      setlocation(weatherData.location);
      let hour = weatherData.current.last_updated.split(" ")[1];
      hour =
        hour.split(":")[0] > 12
          ? `${hour.split(":")[0] - 12 + ":" + hour.split(":")[1]}pm`
          : `${hour}am`;
      sethour(hour);
    } catch (error) {
      alert(error.message);
    }
  };

  const setInputText = (e) => {
    console.log(e.target.value);
    let city = e.target.value;
    setvalue(city);
    setlocArray([]);
  };

  return (
    <>
      <div className="weather flex justify-center items-center min-h-screen max-w-screen overflow-hidden font-sans">
        <img src="./bg.jpg" alt="" className="absolute top-0 w-full h-full" />
        <div className="w-info bg-black bg-opacity-50 w-1/3 h-[80vh] rounded-lg relative z-10">
          <div className="cityinput flex">
            <div className="searchbar gap-3">
              <input
                type="text"
                placeholder="Enter city name"
                className="w-4/5 h-10 rounded-lg mt-3 mx-6 px-6 bg-gray-800 text-white"
                value={value}
                onChange={handleChange}
              />
              {value &&
                locArray.length > 0 &&
                locArray.map((city, index) => {
                  return (
                    <option
                      key={city.id}
                      className="w-4/5 min-h-10 rounded-lg mt-3 mx-6 px-6 bg-gray-800 text-white cursor-pointer text-center pt-2"
                      value={city.name}
                      onClick={setInputText}
                    >
                      {city.name + "," + city.country}
                    </option>
                  );
                })}
            </div>
            <button
              className="w-1/5 h-10 rounded-lg mt-3 mx-6 px-3 bg-sky-800 text-white"
              onClick={getCity}
            >
              Search
            </button>
          </div>
          <div className="weahterUpdate flex flex-col items-center h-[60%] w-full">
            <img src={`${weather.condition.icon}`} width={90} />
            <h1 className="text-white text-xl">{weather.temp_c} &deg;C</h1>
            <h1 className="text-white text-2xl px-8 mt-2 font-semibold text-center">
              {location.name} , {location.country}
            </h1>
          </div>
          <div className="humidity absolute bottom-4 left-4 flex gap-3">
            <img src="./wind.svg" width={60} />
            <div className="flex flex-col justify-center">
              <span className="text-white text-sm">
                Wind: {weather.wind_mph} mph
              </span>
              <span className="text-white text-sm">
                Humidity: {weather.humidity}%
              </span>
            </div>
          </div>
          <div className="dayInfo absolute bottom-4 right-4 flex flex-col">
            <span className="text-white text-xl font-semibold">Weather</span>
            <span className="text-white text-md">{weather.condition.text}</span>
            <span className="text-white text-sm">{date + "\t" + hour}</span>
            <span className="text-white text-sm">
              {days[new Date(weather.last_updated).getDay() - 1]}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
