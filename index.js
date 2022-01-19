let OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let map = L.map('map',{
    layers: [OpenStreetMap_Mapnik],

}).setView([32.055572,34.756429], 13);

let sets = {
    "type": "FeatureCollection",
    "features": []
  }

let setsLayer = L.geoJSON(sets, { 
    style: defaultStyle,
    onEachFeature: onEachFeature,
    attribution: 'גבולות: למ"ס 2013'
})


mapInit()

L.control.results({ position: 'topright' }).addTo(map);
map.attributionControl.addAttribution('נבנה ע"י דרור בוגין')