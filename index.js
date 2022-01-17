var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var map = L.map('map',{
    layers: [OpenStreetMap_Mapnik],

}).setView([32.055572,34.756429], 13);

mapInit()

//L.control.inputs({ position: 'topright' }).addTo(map);
map.attributionControl.addAttribution('נבנה ע"י דרור בוגין')