// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	const date = new Date(timestamp * 1000);
	const hours = '0' + date.getHours();
	const minutes = '0' + date.getMinutes();
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}


let updateSun = (percentage, json_file) => {
	const date = new Date();
	const hours = '0' + date.getHours();
	const minutes = '0' + date.getMinutes();
	const time = hours.substr(-2) + ':' + minutes.substr(-2);

	document.querySelector('.js-horizon').innerHTML = `
<span
class="c-horizon__sun js-sun"
data-time="${time}"
>
<svg class="c-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
	<path d="M17,11c0,3.3-2.7,6-6,6s-6-2.7-6-6s2.7-6,6-6S17,7.7,17,11z M11.5,0h-1v3h1V0z M3.6,2.9L2.9,3.6L5,5.7L5.7,5L3.6,2.9zM0,10.5l0,1h3v-1H0z M2.9,18.4l0.7,0.7L5.7,17L5,16.3L2.9,18.4z M10.5,22h1v-3h-1V22z M18.4,19.1l0.7-0.7L17,16.3L16.3,17L18.4,19.1z M22,11.5v-1h-3v1H22z M19.1,3.6l-0.7-0.7L16.3,5L17,5.7L19.1,3.6z" />
</svg>
</span>`;

	if (percentage < 50) {
		document.querySelector('.js-sun').style.right = `${percentage}%`;
	} else document.querySelector('.js-sun').style.left = `${percentage}%`;
	document.querySelector('.js-sun').style.top = `${percentage - 24}% `;
	let newtime = parseInt(hours) * 60 + parseInt(minutes);
	const datesunset = new Date(json_file.sunset * 1000);
	let hourssunset = datesunset.getHours();
	let minutessunset = datesunset.getMinutes();
	const sunsetMinutes = minutessunset + hourssunset * 60;
	timeLeft = sunsetMinutes - newtime;
	document.querySelector('.js-time-left').innerText = timeLeft;
	if (timeLeft <= 0) {
		document.querySelector('.js-time-left').innerText = '0';
		document.querySelector('.js-horizon').innerHTML = '';
	}
};


let placeSunAndStartMoving = (totalMinutes, sunrise, json_file) => {
	const date = new Date();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	let minutesSunUp = hours * 60 + minutes - sunrise;
	console.log(minutesSunUp);

	updateSun((minutesSunUp / totalMinutes) * 100, json_file);

	if (timeLeft <= 0) { document.getElementsByTagName('html')[0].classList.add('is-night'); }
	else { document.getElementsByTagName('html')[0].classList.remove('is-night'); }
};


let showResult = (queryResponse) => {
	console.log(queryResponse.city);
	let json_file = queryResponse.city;

	document.querySelector(
		'.js-location'
	).innerText = `${json_file.name} , ${json_file.country} `;

	document.querySelector('.js-sunrise').innerText =
		_parseMillisecondsIntoReadableTime(json_file.sunrise);
	document.querySelector('.js-sunset').innerText =
		_parseMillisecondsIntoReadableTime(json_file.sunset);


	const datesunset = new Date(json_file.sunset * 1000);
	let hourssunset = datesunset.getHours();
	let minutessunset = datesunset.getMinutes();
	const sunsetMinutes = minutessunset + hourssunset * 60;

	const datesunrise = new Date(json_file.sunrise * 1000);
	let hourssunrise = datesunrise.getHours();
	let minutessunrise = datesunrise.getMinutes();
	const sunriseMinutes = minutessunrise + hourssunrise * 60;

	placeSunAndStartMoving(
		sunsetMinutes - sunriseMinutes,
		sunriseMinutes,
		json_file
	);
	setInterval(function () {
		placeSunAndStartMoving(
			sunsetMinutes - sunriseMinutes,
			sunriseMinutes,
			json_file
		);
	}, 60000);
};


let getAPI = (lat, lon) => {

	const endpoint = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=fdfc264635b7c51277bac9d18da0125b&units=metric&lang=nl&cnt=1`;

	fetch(endpoint)
		.then((response) => response.json())
		.then((e) => showResult(e));
};

document.addEventListener('DOMContentLoaded', function () {

	getAPI(50.8027841, 3.2097454);
});
