async function mapInit(){

    /*function handleHeaderMeta(headerMeta) {
        const header = document.getElementById('header')
        const formatter = new JSONFormatter(headerMeta, 10)
        header.appendChild(formatter.render())
    }*/

    const response = await fetch('set.fgb');
    for await (let feature of flatgeobuf.deserialize(response.body, undefined)) {
        // Leaflet styling
        const defaultStyle = { 
            color: 'blue', 
            weight: 2, 
            fillOpacity: 0.2,
        };

        // Add the feature to the map
        L.geoJSON(feature, { 
            style: defaultStyle 
        }).on({
            // highlight on hover
            'mouseover': function(e) {
                const layer = e.target;
                layer.setStyle({
                    color: 'blue',
                    weight: 4,
                    fillOpacity: 0.7,
                });
                layer.bringToFront();
            },
            // remove highlight when hover stops
            'mouseout': function(e) {
                const layer = e.target;
                layer.setStyle(defaultStyle);
            }
        })
        // show some per-feature properties when clicking on the feature
        .bindPopup(`<h1>${feature.properties["LocNameHeb"]}</h1>`)
        .addTo(map);
    }

}
