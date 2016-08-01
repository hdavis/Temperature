var map = L.map('map', {
  'center': [38, -100],
  'zoom': 4,
  'layers': [
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      'attribution': 'Map data &copy; OpenStreetMap contributors'
    })
  ]
});

//var initLat = 38;
//var initLong = -100;
//var initZoomLevel = 4;
//var zoommax = 18;

$.getJSON('summary.geojson', function (geojson) {
  L.geoJson(geojson, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.city);
    }
  }).addTo(map);
});
