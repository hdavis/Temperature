var map = L.map('map').setView([32.71, -85.59], 10);
var layer = L.esri.basemapLayer('Topographic').addTo(map);
var geojsonLayer = new L.GeoJSON.AJAX('summary.geojson', {onEachFeature:popUp}, {style:geojson});
var myStyle = {"color": "#ff7800", "weight": 4, "opacity": 0.65};
geojsonLayer.addTo(map);

function popUp(feature, layer) {
    layer.bindPopup(feature.properties.city);
}