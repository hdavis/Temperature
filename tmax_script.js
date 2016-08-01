var map = L.map('map');

var initLat = 38;
var initLong = -102;
var initZoomLevel = 4;
var zoommax = 18;

// BASEMAPS
// Additional basemaps @ https://leaflet-extras.github.io/leaflet-providers/preview/

// Stamen Watercolor Basemap
var Stamen_WC_url = 'http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}';
var Stamen_WC_attr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
var Stamen_WC_tiles = L.tileLayer(Stamen_WC_url, {
    attribution: Stamen_WC_attr,
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: zoommax,
    ext: 'png'
    });

// Open Map Surfer Roads Basemap
var Surfer_url = 'http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}';
var Surfer_attr = 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
var Surfer_tiles = L.tileLayer(Surfer_url, {
    maxZoom: zoommax,
    attribution: Surfer_attr
    });

// OpenStreetMap Black and White basemap
var OSM_BW_url = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
var OSM_BW_attr = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
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