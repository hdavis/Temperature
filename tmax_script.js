var map = L.map('map');

var initLat = 38;
var initLong = -102;
var initZoomLevel = 4;
var zoommax = 18;

// OpenStreetMap Black and White basemap
var OSM_BW_url = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
var OSM_BW_attr = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
var OSM_BW_tiles = L.tileLayer(OSM_BW_url, {
    maxZoom: zoommax,
    attribution: OSM_BW_attr
    });
map.addLayer(OSM_BW_tiles);

$.getJSON('summary.geojson', function (geojson) {
  L.geoJson(geojson, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.city);
    }
  }).addTo(map);
});

map.setView([initLat, initLong], initZoomLevel);