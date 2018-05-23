export default function colordinatesTile(hueLat, hueLong, hueResult) {
    
    var tileContent = new Windows.Data.Xml.Dom.XmlDocument();
    
    var tile = tileContent.createElement("tile");
    tileContent.appendChild(tile);
    
        var visual = tileContent.createElement("visual");
        visual.setAttribute("branding","nameAndLogo");
        tile.appendChild(visual);
        
            var bindingMedium = tileContent.createElement("binding");
            bindingMedium.setAttribute("template", "TileMedium");
            visual.appendChild(bindingMedium);
            
                var tileColorval = tileContent.createElement("text");
                tileColorval.setAttribute("hint-style", "base");
                tileColorval.setAttribute("hint-wrap", "true");
                tileColorval.innerText = hueResult;
                bindingMedium.appendChild(tileColorval);
                
                var tileGeoval = tileContent.createElement("text");
                tileGeoval.setAttribute("hint-style", "captionSubtle");
                tileGeoval.setAttribute("hint-wrap", "true");
                tileGeoval.innerText = `${hueLat}, ${hueLong}`;
                bindingMedium.appendChild(tileGeoval);
    
    var notifications = Windows.UI.Notifications;
    var tileNotification = new notifications.TileNotification(tileContent);
    
    notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);

}