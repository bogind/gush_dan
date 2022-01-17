L.Control.Inputs = L.Control.extend({
    onAdd: function(map) {
        let container = L.DomUtil.create('div', 'leaflet-bar control');

        return container;
    }
})
L.control.inputs = function(opts) {
    return new L.Control.Inputs(opts);
}