
let api = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,relativehumidity_2m,is_day,rain,snowfall,weathercode,windspeed_10m&hourly=temperature_2m,relativehumidity_2m,rain,weathercode&daily=weathercode,temperature_2m_max,sunrise,sunset,uv_index_max&timeformat=unixtime&timezone=Europe%2FLondon";
let cont = document.querySelector(".container");
let search = document.querySelector(".search-bar form input");
let searchBtn = document.querySelector(".search-bar form button");
let locationBtn = document.querySelector(".search-bar form .current-location");
let timeZone =  Intl.DateTimeFormat().resolvedOptions().timeZone;
let currentCityName = document.querySelector(".day .city-name");
let cityNameError = document.querySelector(".search-bar .error");
let weatherImages = document.querySelectorAll(".container img:not(.container .air-conditions img)");

weatherImages.forEach((img)=>{
   img.setAttribute("src", "icons/ripples.svg");   //refreshing animation
});


getWeather(51.5072, 0.1276, timeZone);  //sets a default value
currentCityName.innerHTML = "London";

const getUserPosition =()=>{
    
   const success = (position)=>{
        getWeather(position.coords.latitude, position.coords.longitude, timeZone);
        const reverseGeocodingApi = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=10`;
        fetch(reverseGeocodingApi)
        .then(response => response.json())
        .then(data=>{
         currentCityName.innerHTML = data.address.city;
        })
   }
   const error = ()=>{
      console.log("unable to get your location");
   }
   navigator.geolocation.getCurrentPosition(success, error);
   
}

locationBtn.addEventListener("click", getUserPosition)

// locationBtn.addEventListener("click", function(){
//    console.log("siuuu");
// });

searchBtn.addEventListener("click",getCityWeather);

function getCityWeather(event){
      event.preventDefault();
      let cityName = search.value;
      let geaolocApi = `https://nominatim.openstreetmap.org/search?format=json&q=${cityName}`;
      fetch(geaolocApi)
      .then(response => response.json())
      .then(data =>{
         return{
            latitude: data[0].lat,
            longitude : data[0].lon,
         }
          
      })
      .then(coordinates =>{
             getWeather(coordinates.latitude, coordinates.longitude, timeZone);
             currentCityName.innerHTML = cityName;
      })
      .catch(error =>{
         console.log("error fetching city coordinates", error);
         cityNameError.classList.add("active");
         document.addEventListener("click", ()=>{
            cityNameError.classList.remove("active");
         })
      })
     
}



// let currentPosition = navigator.geolocation.getCurrentPosition((position)=>{
//    let currentCoords = getPosition(position);
//    getWeather(currentCoords.latitude, currentCoords.longitude,timeZone)
// });
// function getPosition(position){
//    let latitude = position.coords.latitude;
//    let longitude = position.coords.longitude;
//    return{
//       latitude : latitude,
//       longitude : longitude,
//    }
// }




function getWeather( lat, long, timezone){
   weatherImages.forEach((img)=>{
      img.setAttribute("src", "icons/ripples.svg");   //refreshing animation
   });
   const url = `${api}&latitude=${lat}&longitude=${long}&timezone=${timezone}`
   fetch(url)
   .then((response)=>response.json())
   .then((data)=>{
      renderCurrentWeather(getCurrentData(data));
      renderDailyWeather(getDailyData(data));
      console.log(getCurrentData(data));
      console.log(getDailyData(data));
      console.log(getHourlyData(data));
      console.log(data);
     
   })
   .catch((error) =>{
       console.log("error fetching weather data", error);

   })

   
}


function getCurrentData(data){
   return {
      temperature: data[1].current.temperature_2m,
      humidity: data[1].current.relativehumidity_2m,
      weatherCode : data[1].current.weathercode,
      windSpeed : data[1].current.windspeed_10m,
      sunset :data[1].daily.sunset[0],
      sunrise : data[1].daily.sunrise[0],
      uvIndex : data[1].daily.uv_index_max[0],
   }
}

function getDailyData(data){
   return{
     temperature: data[1].daily.temperature_2m_max,
     weatherCode: data[1].daily.weathercode,
     time: data[1].daily.time,
   }
}

function getHourlyData(data){
   return{
      temperature: data[1].hourly.temperature_2m,
      weatherCode :data[1].hourly.weathercode,
      time : data[1].hourly.time,
   }
}

  
  
function renderCurrentWeather(current){
   document.querySelector(".day .temperature").innerHTML = `${Math.round(current.temperature)}°`;
   document.querySelector(".air-conditions .wind .value").innerHTML =`${ Math.round(current.windSpeed)} Km/h`;
   document.querySelector(".air-conditions .humidity .value").innerHTML = `${Math.round(current.humidity)}%`;
   document.querySelector(".air-conditions .uv-index .value").innerHTML = Math.round(current.uvIndex);
   document.querySelector(".air-conditions .sunset .value").innerHTML = current.sunset;
   console.log(current.weatherCode);
   document.querySelector(".day-info .weather-icon img").setAttribute("src",  weatherIcons[current.weatherCode] );
}

function renderDailyWeather(daily){
   const dailyWeather = document.querySelectorAll(".weak-weather > div");
   let counter = 0;
   const weekDays = ['sun','mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
   dailyWeather.forEach(day => {
       let time = day.querySelector(".time");
       let temp = day.querySelector(".temp");
       let days = daily.time[counter];
       let date = new Date(days * 1000);
       let daysOfWeek = date.getDay();
       let icon = day.querySelector(".weather-img img");

       icon.setAttribute("src", weatherIcons[daily.weatherCode[counter]]);
       time.innerHTML = weekDays[daysOfWeek];;
       temp.innerHTML = `${Math.round(daily.temperature[counter])}°`;
       counter++;

   });
}


const weatherIcons = {
   0 : `  icons/bom/app/01_sunny.svg  ` ,
   1 : `   icons/bom/app/05_mostly_sunny.svg  ` ,
   2 : `    icons/bom/app/03_partly_cloudy_night.svg  ` ,
   3 : `    icons/bom/app/04_cloudy.svg  ` ,
   45: `    icons/bom/app/10_fog.svg  ` ,
   48: `    icons/bom/app/10_fog.svg  ` ,
   51 : `    icons/bom/app/08_light_rain.svg  ` ,
   53 : `    icons/bom/app/06_haze.svg  ` ,
   55 : `    icons/bom/app/06_haze.svg  ` ,
   56 : `    icons/bom/app/04_cloudy.svg  ` ,
   57 : `    icons/bom/app/04_cloudy.svg  ` ,
   61 : `    icons/bom/app/12_rain.svg  ` ,
   63 : `    icons/bom/app/12_rain.svg  ` ,
   65 : `    icons/bom/app/12_rain.svg  ` ,
   66 : `    icons/bom/app/12_rain.svg  ` ,
   67 : `    icons/bom/app/12_rain.svg  ` ,
   71 : `    icons/bom/app/15_snow.svg  ` ,
   73 : `    icons/bom/app/15_snow.svg  ` ,
   75 : `    icons/bom/app/15_snow.svg  ` ,
   77 : `    icons/bom/app/15_snow_rn.svg  ` ,
   80 : `    icons/bom/app/17_light_showers.svg  ` ,
   81 : `    icons/bom/app/17_light_showers.svg  ` ,
   82 : `    icons/bom/app/17_light_showers.svg  ` ,
   85 : `    icons/bom/app/15_snow.svg  ` ,
   86 : `    icons/bom/app/15_snow.svg  ` ,
   95 : `    icons/bom/app/16_storms_rn.svg  ` ,
   96 : `    icons/bom/app/16_storms_rn.svg  ` ,
   99 : `     icons/bom/app/16_storms_rn.svg  ` ,


}
console.log(weatherIcons[0]);

const map = new google.maps.Map