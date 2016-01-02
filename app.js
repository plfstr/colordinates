var domButton = document.getElementById("huebutton"),
  domOutput = document.getElementById("output"),
  domLocale = document.getElementById("longlat"),
  lightUnit = 180 / 100,
  longHue,
  latSat;

if (navigator.geolocation) {

  if (navigator.permissions) {
    navigator.permissions.query({
      name: 'geolocation'
    }).then(function(permissionStatus) {

      function permissionCheck() {
      	if (permissionStatus.state === 'denied' || 'prompt') {
        	domOutput.textContent = "App requires geolocation. Allow location when prompted by your browser.";
      	}
      	else if (permissionStatus.state === 'granted') {
      		domOutput.textContent = "";
      		domButton.setAttribute('disabled', true);
      		fetchGeo();
      	}
      }
      permissionCheck();
      
      permissionStatus.onchange = permissionCheck;

    });
  }

  function fetchGeo(position) {
    navigator.geolocation.getCurrentPosition(makeColor, errorFeedback, {
      timeout: 30000,
      maximumAge: 600000
    });
  }

  function errorFeedback(error) {
    domOutput.textContent = "Geolocation failed! Check settings and signal. Reload page and try again.";
    alert('Error - ' + error.message);
    domOutput.focus();
  }

  function makeColor(position) {

    // Make Hue
    if (position.coords.longitude > 0) {
      longHue = Math.round(position.coords.longitude);
    } else {
      longHue = Math.round(position.coords.longitude - -180 * 2);
    }

    // Make lightness
    if (position.coords.latitude > 0) {
      latSat = Math.round((180 - Math.round(position.coords.latitude) - 90) / lightUnit); //  Northern Latitude – Needs to range from 0 – 90
    } else {
      latSat = Math.round((180 - (Math.round(position.coords.latitude) - -90)) / lightUnit); // Southern Latitude – Needs to range from 90 – 180
    }

    var domColorvalue = document.createElement('div'),
        domOutputcolour = "hsla(" + longHue + ", " + latSat + "%, 50%, 1)";

    domColorvalue.className = 'color txt-small notranslate';
    domColorvalue.textContent = domOutputcolour;
    domOutput.setAttribute('style', 'background-color: ' + domOutputcolour);
    domOutput.appendChild(domColorvalue);
    domOutput.focus();
  }

  domButton.addEventListener('click', fetchGeo, false);
} else {
  domOutput.textContent = "This app uses features not supported by your browser";
  domOutput.focus();
}