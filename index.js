

const Api = 'fc2fee0085df03b4741ccb3fe5efa9f7';


const usertab = document.querySelector('[user-tab]');
const serchTab = document.querySelector('[serch-tab]');
const grantLocation = document.querySelector('.grant-access-location');
const serchContainer = document.querySelector('.serch-container');
const userInfo = document.querySelector('.user-info-container');
const loadingContainer = document.querySelector('.loading-container');
const accessBtn=document.querySelector('.Access-btn');
const notFound=document.querySelector('.error');
const accessMsg=document.querySelector('.Access-msg')

let currenttab = usertab;
currenttab.classList.add('current-tab')
getfromSessionStorage();

function switchTab(clicktab) {
    if (currenttab != clicktab) {
        currenttab.classList.remove('current-tab');
        currenttab = clicktab;
        currenttab.classList.add('current-tab');


        if (!serchContainer.classList.contains('active')) {
            userInfo.classList.remove('active');
            grantLocation.classList.remove('active');
            notFound.classList.remove('active');
            serchContainer.classList.add('active');
          
        }
        else {
            notFound.classList.remove('active');
            serchContainer.classList.remove('active');
           
            userInfo.classList.remove('active');
            getfromSessionStorage();
        }

    }
}



usertab.addEventListener('click', () => {
    console.log()
    switchTab(usertab);
})

serchTab.addEventListener('click', () => {
    switchTab(serchTab);
})


function getfromSessionStorage() {
    const localCoordinate = sessionStorage.getItem('user-Coordinates');

    if (!localCoordinate) {
        grantLocation.classList.add('active');

    }
    else {
        const coordinate = JSON.parse(localCoordinate);
        fetchUserWeatherInfo(coordinate);

    }
}

async function fetchUserWeatherInfo(coordinate) {
    let { lat, lon } = coordinate;
    loadingContainer.classList.add('active');
    grantLocation.classList.remove('active');

    try {
        const responce = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${Api}`);
        const data = await responce.json();
        
        loadingContainer.classList.remove('active');
        userInfo.classList.add('active');
        renderWeatherInfo(data);
    }
    catch (error) {
        loadingContainer.classList.remove('active');

    }
}

function renderWeatherInfo(weatherInfo) {
    const cityname = document.querySelector('[city-name]');
    const countryIcon = document.querySelector('[flag]');
    const desc = document.querySelector('[weather-desc]');
    const weatherIcon = document.querySelector('[weather-img]');
    const temp = document.querySelector('[temperature]');
    const windSpeed = document.querySelector('[windspeed]')
    const humidity = document.querySelector('[humidity]');
    const cloudiness = document.querySelector('[cloudiness]');
  const accessMsg=document.querySelector('.Access-msg');

    cityname.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} ℃`;
    windSpeed.textContent = `${weatherInfo?.wind?.speed}m/s`;
    humidity.textContent = `${weatherInfo?.main?.humidity}%`;
    cloudiness.textContent = `${weatherInfo?.clouds?.all}%`

}



function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
    else {

        grantLocation.classList.add('active');
    
       
    }
}

function showError(error){

    switch(error.code) {
        case error.PERMISSION_DENIED:
            accessMsg.innerText="You denied the request for Geolocation.";
            // alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }

}

function showPosition(pos) {

    const userCoordinates={
        lat : pos.coords.latitude,
        lon : pos.coords.longitude
    }
  
    sessionStorage.setItem('user-Coordinates',JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

accessBtn.addEventListener('click',getLocation);


const serchInput=document.querySelector('[serchinput]');
const btn = document.querySelector('[btn]');
btn.addEventListener('click',(e)=>{
   
    let city = serchInput.value;
    if(city==="")
        return;
    else
        fetchSerchWeatherInfo(city);
})

async function fetchSerchWeatherInfo(city){
    loadingContainer.classList.add('active');
    userInfo.classList.remove('active');
    grantLocation.classList.remove('active');
    notFound.classList.remove('active');
  try{
    let responce= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Api}`);
    if(responce.ok){
        
        let data = await responce.json();
        serchInput.value = '';
        loadingContainer.classList.remove('active');
        userInfo.classList.add('active');
        renderWeatherInfo(data);
       
    }
    else{
        loadingContainer.classList.remove('active');
        notFound.classList.add('active');
    }
    
  }
  catch(error){
    userInfo.classList.remove('active');
  }

    
}