const defaultStyle = { 
    color: 'blue', 
    weight: 2, 
    fillOpacity: 0.2,
};
const apiUrl = "https://script.google.com/macros/s/AKfycbzqHIiQ74HoUlADdX0LcNxPxC2qzNTse93QEsg8sPeg0y-w8i3opdFTD_gER8gXn78Y/exec"

async function mapInit(){

    /*function handleHeaderMeta(headerMeta) {
        const header = document.getElementById('header')
        const formatter = new JSONFormatter(headerMeta, 10)
        header.appendChild(formatter.render())
    }*/

    const response = await fetch('set.fgb');
    for await (let feature of flatgeobuf.deserialize(response.body, undefined)) {
        sets.features.push(feature)
        // Leaflet styling
        map.removeLayer(setsLayer)
        setsLayer.addData(feature)

        // Add the feature to the map
        /*setsLayer = L.geoJSON(sets, { 
            style: defaultStyle,
            onEachFeature: onEachFeature
        })*/
        //.addTo(map);
        if(sets.features.length == 406){
            setsLayer.addTo(map);
            getRandomFetaure()
        }
    }

}
function onEachFeature(feature, layer){
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: onFeatureClick
    });
}
function onFeatureClick(e){
    let layer = e.target;
    let feature = e.target.feature;
    
    if (feature.properties && feature.properties.LocNameHeb && feature.properties.LocalityCo) {
        layer.bindPopup(`<h1>${feature.properties["LocNameHeb"]}</h1>\
        <center>\
        <h2>בגוש דן?</h2>\
        <button onclick="sendYes(${feature.properties["LocalityCo"]})">כן</button>\
        <button onclick="sendNo(${feature.properties["LocalityCo"]})">לא</button>\
        </center>`)
    }
}
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        color: 'blue',
        weight: 4,
        fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
function resetHighlight(e) {
    setsLayer.resetStyle(e.target);
}
function sendYes(code){
    fetch(apiUrl+`?code=${code}&answer=1`, {
        'method': 'post',
        'contentType': 'application/json'
      })
    .then(response => response.json())
    .then(data => {
        setsLayer.eachLayer(function (layer) {
            if(layer.feature.properties && layer.feature.properties.LocalityCo){
                if(layer.feature.properties.LocalityCo === code ){
                    layer.bindPopup(`<h1>${layer.feature.properties["LocNameHeb"]}</h1>\
                    <center>תודה<br>
                    <button onclick="getRandomFetaure()">לשחק שוב?</button></center>`)
                }
            }
            
        })
    })
}
function sendNo(code){
    fetch(apiUrl+`?code=${code}&answer=0`, {
        'method': 'post',
        'contentType': 'application/json'
      })
    .then(response => response.json())
    .then(data => {
        setsLayer.eachLayer(function (layer) {
            if(layer.feature.properties && layer.feature.properties.LocalityCo){
                if(layer.feature.properties.LocalityCo === code ){
                    layer.bindPopup(`<h1>${layer.feature.properties["LocNameHeb"]}</h1>\
                    <center>תודה<br>
                    <button onclick="getRandomFetaure()">לשחק שוב?</button></center>`)
                }
            }
            
        })
    })
}
function getRandomFetaure(){
    let i = Math.floor(Math.random() * 406);
    var j =-1 
    setsLayer.eachLayer(function (layer) {
        j +=1
        if(layer.feature.properties && layer.feature.properties.LocalityCo){
            if(j ===i){
                map.fitBounds(layer.getBounds())
                layer.openPopup()
            }
        }
        
    })
    
}
