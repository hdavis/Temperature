var initLat = 38;
var initLong = -102;
var initZoomLevel = 4;
var zoommax = 18;

/*
var map = L.map('map', {
  'center': [initLat, initLong],
  'zoom': initZoomLevel,
  'layers': [
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      'attribution': 'Map data &copy; OpenStreetMap contributors'
    })
  ]
});
*/

var map = L.map('map');

// OpenStreetMap Black and White basemap
var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
maxZoom: zoommax,
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
map.addLayer(OpenStreetMap_BlackAndWhite);

$.getJSON('summary.geojson', function (geojson) {
  L.geoJson(geojson, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.city);
    }
  }).addTo(map);
});

map.setView([initLat, initLong], initZoomLevel);