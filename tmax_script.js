'use strict';
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

// OVERLAYS
// Add maximum temperature data from geoJSON file

//var max_temps = new L.geoJson();
//max_temps.addTo(map);

//$.ajax({
//    dataType: "json",
//    url: "summary.geojson",
//    success: function (data) {
//        $(data.features).each(function (key, value) {
//            max_temps.addData(value);
//        console.log('value: ' + value);
//        max_temps (data, {
//        onEachFeature: function (feature, layer) {
//            layer.bindPopup(feature.properties.city);
//        }
//    }).addTo(map);
//        });
//        
//    }
//}).error(function () {});

var my_json;
 //$.getJSON('../Dati/my-geojson.geojson', function(data) {
$.getJSON('summary.geojson', function(data) {
           my_json = L.geoJson(data, {
            pointToLayer: function(feature, latlng) {
                 var smallIcon = new L.Icon({
                     iconSize: [27, 27],
                     iconAnchor: [13, 27],
                     popupAnchor:  [1, -24],
                     iconUrl: 'pin-1_dk_blue.png'
                 });
                return L.marker(latlng, {icon: smallIcon});
            },
           onEachFeature: function (feature, layer) {
                   layer.bindPopup(feature.properties.city + '<br />'
                                                 + feature.properties.range_tmax);
           }
         });
 my_json.addTo(markers.addTo(map));
 //TOC.addOverlay(my_json, "My layer name in TOC");
 //map.removeLayer(my_json); 
 });


//$.ajax({
//    dataType: "json",
//    url: "summary.geojson",
//    success: function (data) {
//        L.geoJson(data, {
//        onEachFeature: function (feature, layer) {
//            layer.bindPopup(feature.properties.city);
//        }
//    }).addTo(map);
//}
//}).error(function () {});


//var max_temp = {};

//$.getJSON('summary.geojson', function (v_geojson) {
//    L.geoJson(v_geojson, {
//        onEachFeature: function (feature, layer) {
//            layer.bindPopup(feature.properties.city);
//        }
//    }).addTo(map);
//});

//console.log(value);

// Add a WMS for weather data
var nexrad = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
    layers: 'nexrad-n0r-900913',
    format: 'image/png',
    transparent: true,
    attribution: "Weather data © 2012 IEM Nexrad"
});
map.addLayer(nexrad);

// Define and display the control for Basemaps and Overlays
var baseLayers = {
    "Water Color": Stamen_WC_tiles,
    "Open Map Surfer Roads": Surfer_tiles,
    "Open Street Map - B&W": OSM_BW_tiles
};
var overlays = {
    "Maximum Temperatures": my_json,
    "Weather": nexrad
};
L.control.layers(baseLayers, overlays).addTo(map);

map.setView([initLat, initLong], initZoomLevel);