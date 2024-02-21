var domButton = document.getElementById('huebutton'),
  domOutput = document.getElementById('output'),
  domFeedback = document.getElementById('feedback'), 
  domLocale = document.getElementById('longlat'),
  lightUnit = 180 / 100,
  domColorvalue = document.getElementById('colval');
domFooter = document.querySelector('.txt-small');

if (navigator.geolocation) {

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: './' }).then(function (reg) {
      console.log('Service Worker Registered!');
      domFooter.textContent += ' \u2022 Available Offline';
    }).catch(function (error) {
      console.log('Registration failed with ' + error);
    });
  }

  function getPermissions() {
    if (!navigator.permissions) {
      return;
    }
    navigator.permissions
      .query({
        name: "geolocation"
      })
      .then(function (permissionStatus) {
        var allstates = {
          denied:
            "App requires geolocation. Allow location when prompted by your browser",
          prompt:
            "App requires geolocation. Please allow geolocation in this sites permissions",
          granted: ""
        };
        userFeedback(allstates[permissionStatus.state]);
        permissionStatus.addEventListener('change', getPermissions, false);
      });
  }

  function userFeedback(m) {
    domFeedback.textContent = m ? m : "";
    domColorvalue.textContent = "";
  }

  function fetchGeo(position) {
    navigator.geolocation.getCurrentPosition(makeColor, errorFeedback, {
      timeout: 30000,
      maximumAge: 600000
    });
    // ‘Finding’ placeholder...
    userFeedback();
    domColorvalue.className = 'color txt-small notranslate';
    domColorvalue.textContent = 'Finding…';
  }

  function errorFeedback(error) {
    if (window.isSecureContext === false || error.message.indexOf('Only secure origins are allowed') == 0) {
      userFeedback('Browser prevents geolocation use via non-secure (HTTP) page');
    }
    else {
      if (navigator.permissions) {
        getPermissions();
      } else {
        userFeedback("Geolocation failed! Check settings and signal. Reload page and try again");
      }
    }
  }

  function makeHue(position) {
      var long = Math.round(position.coords.longitude);
      var posneg = Math.sign(long) ? 0 : -180 * 2;
      return long - posneg;
  }
  
  function makeSat(position) {
      var lat = Math.round(position.coords.latitude);
      var posneg = Math.sign(lat) ? 90 : -90;
      return Math.round((180 - lat - posneg) / lightUnit);
  }

  function makeColor(position) {

    userFeedback();

    var domOutputcolour = 'HSLA(' + makeHue(position) + ', ' + makeSat(position) + '%, 50%, 1)';

    // Display Colour Value
    domColorvalue.textContent = domOutputcolour;  
    domOutput.style.backgroundColor = domOutputcolour;
  }

  domButton.addEventListener('click', fetchGeo, false);

} else {
  userFeedback('This app uses features not supported by your browser');
}
