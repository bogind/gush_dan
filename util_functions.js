const defaultStyle = { 
    fillColor: 'blue', 
    color: 'blue',
    weight: 2, 
    fillOpacity: 0.2,
};
const apiUrl = "https://script.google.com/macros/s/AKfycbzqHIiQ74HoUlADdX0LcNxPxC2qzNTse93QEsg8sPeg0y-w8i3opdFTD_gER8gXn78Y/exec";
let resultsLayer;

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
    if (feature.properties && feature.properties.LocNameHeb && feature.properties.LocalityCo) {
        layer.bindPopup(`<h1>${feature.properties["LocNameHeb"]}</h1>\
        <center>\
        <h2>בגוש דן?</h2>\
        <button onclick="sendYes(${feature.properties["LocalityCo"]})">כן</button>\
        <button onclick="sendNo(${feature.properties["LocalityCo"]})">לא</button>\
        </center>`)
    }
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: onFeatureClick
    });
}
function onEachResultsFeature(feature, layer){
    if (feature.properties && feature.properties.LocNameHeb && feature.properties.LocalityCo) {
        result = 'ללא הכרעה'
        if(feature.properties.yes > feature.properties.no){
            result = "חלק מגוש דן"
        }else if(feature.properties.yes < feature.properties.no){
            result = "לא חלק מגוש דן"
        }

        layer.bindPopup(`<h1>${feature.properties["LocNameHeb"]}</h1>\
        <center>\
        <h2>החלטת הקהל: ${result}</h2>
        <h3><b>בעד:</b> ${feature.properties.yes}<br></h3>\
        <h3><b>נגד:</b> ${feature.properties.no}<br></h3>\
        </center>`)
    }
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: onFeatureClick
    });
}
function onFeatureClick(e){
    let layer = e.target;
    let feature = e.target.feature;
    layer.openPopup()
}
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        color: 'cyan',
        weight: 4,
        //fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
function resetHighlight(e) {
    
    if(map.hasLayer(setsLayer)){
        setsLayer.resetStyle(e.target);
    }else{
        resultsLayer.resetStyle(e.target);
    };
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
function showResults(){
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => joinAttributes(data))
}
function joinAttributes(results){
    
    sets.features.forEach(feature =>{
        for(r=0;r<results.features.length;r++){
            row = results.features[r]
            if(row.id === feature.properties.LocalityCo){
                feature.properties['yes'] = row.properties.yes
                feature.properties['no'] = row.properties.no
                feature.properties.color = getColor(feature.properties)
            }
        }
    })
    if(map.hasLayer(setsLayer)){map.removeLayer(setsLayer)}
    resultsLayer = L.geoJSON(sets, { 
        style: getFeatureStyle,
        onEachFeature: onEachResultsFeature,
        attribution: 'גבולות: למ"ס 2013, תוצאות: אתם'
    })
    resultsLayer.addTo(map)
    L.control.legend({ position: 'topright' }).addTo(map);

}
function getFeatureStyle(feature){
    return {
        fillColor: feature.properties.color,
        weight: 2,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.4
    };
}
function getColor(properties){
    let color = "#d95f02"
    if(properties.yes > properties.no){
        color = "#1b9e77"
    }else if(properties.yes < properties.no){
        color = "#7570b3"
    }
    return color;
}