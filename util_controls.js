L.Control.Results = L.Control.extend({
    onAdd: function(map) {
        let container = L.DomUtil.create('div', 'leaflet-bar control results ');
        container.title = "הצגת התוצאות";
        container.style.cursor = "pointer"
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        container.innerHTML = `<i class="fg-2x fg-map-stat"></i>`
        container.onclick = showResults

        return container;
    }
})
L.control.results = function(opts) {
    return new L.Control.Results(opts);
}


L.Control.Legend = L.Control.extend({
    onAdd: function(map) {
        let container = L.DomUtil.create('div', 'leaflet-bar control info legend');
        container.title = "מקרא";
        
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        container.innerHTML += '<i style="background: #1b9e77"></i> גוש דן <br>'
        container.innerHTML += '<i style="background: #7570b3"></i> לא גוש דן <br>'
        container.innerHTML += '<i style="background: #d95f02"></i> טרם הוכרע <br>'

        

        return container;
    }
})
L.control.legend = function(opts) {
    return new L.Control.Legend(opts);
}
let legendControl = L.control.legend({ position: 'topright' })