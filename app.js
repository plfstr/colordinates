var domButton = document.getElementById("huebutton"),
  domOutput = document.getElementById("output"),
  domLocale = document.getElementById("longlat"),
  lightUnit = 180 / 100,
  longHue,
  latSat,
  domColorvalue = document.createElement('div'),
  domFooter = document.querySelector('.txt-small');

if (navigator.geolocation) {

  if (navigator.permissions) {
    navigator.permissions.query({
      name: 'geolocation'
    }).then(function(permissionStatus) {

      function permissionCheck() {
      	if (permissionStatus.state === 'denied') {
        	domOutput.textContent = "Geolocation required. Allow location when prompted by your browser.";
      	}
      	if (permissionStatus.state === 'prompt') {
        	domOutput.textContent = "App requires geolocation. Allow location when prompted by your browser.";
      	}
      	else if (permissionStatus.state === 'granted') {
      		domOutput.textContent = "";
      	}
      }
      permissionCheck();

      permissionStatus.addEventListener('change', permissionCheck, false);

    });
  }
  
  if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js',{scope:'./'}).then(function(reg) {
		console.log('Service Worker Registered!');
 		domFooter.textContent += " \u2022 Available Offline";
	}).catch(function(error) {
		console.log('Registration failed with ' + error);
	});
  }

  function fetchGeo(position) {
    navigator.geolocation.getCurrentPosition(makeColor, errorFeedback, {
      timeout: 30000,
      maximumAge: 600000
    });
    // ‘Finding’ placeholder...
    domOutput.textContent = "";
    domColorvalue.classList.add("color", "txt-small","notranslate");
    domColorvalue.textContent = "Finding…";
    domOutput.appendChild(domColorvalue);
  }

  function errorFeedback(error) {
    if(window.isSecureContext === false || error.message.indexOf("Only secure origins are allowed") == 0) {
      domOutput.textContent = "Browser prevents geolocation use via non-secure (HTTP) page.";
    }
    else {
      alert('Error - ' + error.message);
   	  domOutput.textContent = "Geolocation failed! Check settings and signal. Reload page and try again.";
    }
  }

  function makeColor(position) {
	
	domOutput.textContent = "";
	
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

    var domOutputcolour = "hsla(" + longHue + ", " + latSat + "%, 50%, 1)";

    domColorvalue.className = 'color txt-small notranslate';
    domColorvalue.textContent = domOutputcolour;
    domOutput.style.backgroundColor = domOutputcolour;
    domOutput.appendChild(domColorvalue);
    
    if (typeof Windows !== 'undefined'&&
        typeof Windows.UI !== 'undefined' &&
        typeof Windows.UI.Notifications !== 'undefined') {
	    // Windows Hosted Web App! Your code goes inside this condition
	    
	    document.body.classList.add('is-win10');
	    
	    // Build tile content
		var tileContent = new Windows.Data.Xml.Dom.XmlDocument();
		
		var tile = tileContent.createElement("tile");
		tileContent.appendChild(tile);
		
			var visual = tileContent.createElement("visual");
			visual.setAttribute("branding","nameAndLogo")
			tile.appendChild(visual);
			
				var bindingMedium = tileContent.createElement("binding");
				bindingMedium.setAttribute("template", "TileMedium");
				visual.appendChild(bindingMedium);
				
					var tileColorval = tileContent.createElement("text");
					tileColorval.setAttribute("hint-style", "base");
					tileColorval.setAttribute("hint-wrap", "true");
					tileColorval.innerText = domOutputcolour;
					bindingMedium.appendChild(tileColorval);
					
					var tileGeoval = tileContent.createElement("text");
					tileGeoval.setAttribute("hint-style", "captionSubtle");
					tileGeoval.setAttribute("hint-wrap", "true");
					tileGeoval.innerText = position.coords.latitude + ',' + position.coords.longitude;
					bindingMedium.appendChild(tileGeoval);
	    
		// Update tile
		var notifications = Windows.UI.Notifications;
		var tileNotification = new notifications.TileNotification(tileContent);
		
		notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);
   	}
    
    domOutput.focus();
  }

  domButton.addEventListener('click', fetchGeo, false);
} else {
  domOutput.textContent = "This app uses features not supported by your browser";
  domOutput.focus();
}