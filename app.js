!function(){var t=document.getElementById("huebutton"),o=document.getElementById("output");if(navigator.geolocation){var e,n,a,r,d,s=1.8;e=function(){navigator.geolocation.getCurrentPosition(a,n)},n=function(t){o.textContent="Geolocation failed! Check settings and signal. Reload page and try again.",alert("Error - "+t.message),o.focus()},a=function(t){r=Math.round(t.coords.longitude>0?t.coords.longitude:t.coords.longitude- -360),d=Math.round(t.coords.latitude>0?(180-Math.round(t.coords.latitude)-90)/s:(180-(Math.round(t.coords.latitude)- -90))/s);var e="hsla("+r+","+d+"%,50%,1)";o.setAttribute("style","background-color: "+e),o.innerHTML='<div class="color txt-small notranslate">'+e+"</div>",o.focus()},t.addEventListener("click",e,!1)}else o.textContent="This app uses features not supported by your browser",o.focus()}();