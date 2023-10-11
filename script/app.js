let sunrise
let sunset

//Zon plaatsen in % van de dag
//Zon updaten elke minuut

let getApi = async(lat,lon) => {
	const weatherInfo = await fetch(
		`apilink`
	).then((response) => response.json());

	console.log(weatherInfo);
	sunrise = new Date(weatherInfo.city.sunrise * 1000 - weatherInfo.timezone);
	sunset = new Date(weatherInfo.city.sunset * 1000 - weatherInfo.timezone);
	console.log(sunrise > sunset);
	console.log(sunrise.toLocaleDateString({hour: '2-digit', minute:'2-digit'}));
	console.log(sunset.toLocaleDateString({hour: '2-digit', minute:'2-digit'}));
}

document.addEventListener("DOMContentLoaded", function() {
	getApi(50.82806,3.265);
});