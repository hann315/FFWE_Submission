// eslint-disable-next-line no-unused-vars
import { ListBar, FooterBar, AppBar } from './components';
import "./style/style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from 'axios'; // Import Axios library
import $ from "jquery";
import moment from "moment";

const API_URL = "https://ibnux.github.io/BMKG-importer";

const displayTime = () => {
  const locale = "id";
  const currentTime = moment().locale(locale);

  const timeElement = document.querySelector(".time");
  const dateElement = document.querySelector(".date");

  timeElement.textContent = currentTime.format("HH:mm:ss");
  dateElement.textContent = currentTime.format("LL");
};

const updateTime = () => {
  displayTime();
  setTimeout(updateTime, 1000);
};

updateTime();

let lat = -6.3730914;
let lon = 106.7116703;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const degreesToRadians = (degrees) => (Math.PI * degrees) / 180;
  const lat1Rad = degreesToRadians(lat1);
  const lat2Rad = degreesToRadians(lat2);
  const lonDiff = degreesToRadians(lon1 - lon2);
  const distance =
    Math.sin(lat1Rad) * Math.sin(lat2Rad) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lonDiff);
  const angularDistance = Math.acos(distance);
  const degreesDistance = (angularDistance * 180) / Math.PI;
  const nauticalMiles = degreesDistance * 60 * 1.1515;
  const kilometers = nauticalMiles * 1.609344;
  return Math.round(kilometers * 1000) / 1000;
};

const sortDistance = (a, b) => {
  return a.distance === b.distance ? 0 : a.distance < b.distance ? -1 : 1;
};

const getCounty = async () => {
  try {
    const response = await axios.get(`${API_URL}/cuaca/wilayah.json`);
    const data = response.data;

    const locationsWithDistance = data.map(location => ({
      ...location,
      distance: calculateDistance(lat, lon, location.lat, location.lon)
    }));

    locationsWithDistance.sort(sortDistance);

    const nearbyLocationsMarkup = locationsWithDistance
      .slice(0, 5)
      .map(createNearbyLocationMarkup)
      .join("");
    
    $("#currentLocation").html(`<p>Lokasi saat ini</p> 
      <b><p>${locationsWithDistance[0].kecamatan}, ${locationsWithDistance[0].kota}</p></b>`);
    $("#nearbyCounty").html(nearbyLocationsMarkup);

    const firstLocationLabel = getLocationLabel(locationsWithDistance[0]);
    
    $("#titleWeather").html(`<i class="bi bi-geo-alt-fill"></i> ${firstLocationLabel}`);
    getWeather(locationsWithDistance[0].id);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const createNearbyLocationMarkup = (location) => {
  const locationLabel = getLocationLabel(location);
  return `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <i class="bi bi-geo-alt-fill"></i> 
      ${locationLabel}
      <span class="badge rounded-pill text-bg-primary">${location.distance.toFixed(2)}KM</span>
    </li>
  `;
};

const getLocationLabel = (location) => {
  const kecamatanFormatted = location.kecamatan.replace(/([a-z])([A-Z])/g, "$1 $2");
  const kotaFormatted = location.kota.replace(/([a-z])([A-Z])/g, "$1 $2");
  const propinsiFormatted = location.propinsi.replace(/([a-z])([A-Z])/g, "$1 $2");
  return `${kecamatanFormatted}, ${kotaFormatted}, ${propinsiFormatted}`;
};

const getWeather = async (countyId) => {
  try {
    const response = await axios.get(`${API_URL}/cuaca/${countyId}.json`);
    const data = response.data;

    const weatherCards = data.slice(0, Math.min(data.length, 6)).map(weather => createWeatherCard(weather));

    $("#weather").html(weatherCards.join(""));
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

const createWeatherCard = (weather) => {
  const formattedTime = moment(weather.jamCuaca);
  const cardTemplate = `
    <div class="col-lg-2 col-md-4 col-sm-6">
      <div class="card text-center mb-4" id="weather">
        <img src="${API_URL}/icon/${weather.kodeCuaca}.png" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">${weather.cuaca}</h5>
          <p class="card-text">${formattedTime.format("HH:mm")}<br>
          ${formattedTime.format("DD-MM-YYYY")}</p>
        </div>
      </div>
    </div>
  `;

  return cardTemplate;
};

const showPosition = (position) => {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  getCounty();
};

const onErrorGPS = () => {
  getCounty();
};

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, onErrorGPS);
  } else {
    getCounty();
  }
};

getLocation();
