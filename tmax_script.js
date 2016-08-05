'use strict';
//var my_json;
var initLat = 38;
var initLong = -102;
var initZoomLevel = 4;
var zoommax = 18;

var map = L.map('map');

// BASEMAPS
// Additional basemaps @ https://leaflet-extras.github.io/leaflet-providers/preview/

// Stamen Watercolor Basemap
var Stamen_WC_url = 'http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}';
var Stamen_WC_attr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>,' + ' Location icon designed by Freepik and distributed by Flaticon';
var Stamen_WC_tiles = L.tileLayer(Stamen_WC_url, {
    attribution: Stamen_WC_attr,
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: zoommax,
    ext: 'png'
});

// Open Map Surfer Roads Basemap
var Surfer_url = 'http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}';
var Surfer_attr = 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>,' + ' Location icon designed by Freepik and distributed by Flaticon';
var Surfer_tiles = L.tileLayer(Surfer_url, {
    maxZoom: zoommax,
    attribution: Surfer_attr
});

// OpenStreetMap Black and White basemap
var OSM_BW_url = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
var OSM_BW_attr = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>,' + ' Location icon designed by Freepik and distributed by Flaticon';
var OSM_BW_tiles = L.tileLayer(OSM_BW_url, {
    maxZoom: zoommax,
    attribution: OSM_BW_attr
});
map.addLayer(OSM_BW_tiles);

// OVERLAYS
// Add maximum temperature data from geoJSON file

var smallIcon = new L.Icon({
    iconUrl: 'icons/placeholder-2.svg',
    iconRetinaUrl: 'icons/placeholder-2.svg',
    iconSize:    [41, 41], // size of the icon
    iconAnchor:  [5, 12], // 12, 25 // point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize:  [41, 41], // size of the shadow
    shadowAnchor: [4, 62],  // point of the shadow which will correspond to shadow's location
});

//var popupText = "Magnitude: " + feature.properties.mag
//                + "<br>Location: " + feature.properties.place
//                + "<br><a href='" + feature.properties.url + "'>More info</a>";
            
function onEachFeature(feature, layer) {
    console.log(feature);
    var popupText = "<strong>Summary statistics for the daily high"
                + "<br>temperatures (&deg;F) during the 30 days"
                + "<br>between 6/7/16 and 7/6/16 inclusive</strong>"
                + "<br>City: " + feature.properties.city
                + "<br>Range of Daily Highs: " + feature.properties.range_tmax.toFixed(1)
                + "<br>Highest Daily High: " + feature.properties.max_tmax.toFixed(1)
                + "<br>Lowest Daily High: " + feature.properties.min_tmax.toFixed(1)
                + "<br>Average Daily High: " + feature.properties.mean_tmax.toFixed(1)
                + "<br>Standard Deviation of Daily Highs: "
                + feature.properties.sd_tmax.toFixed(2);
    layer.bindPopup(popupText);
}

//function onEachFeature(feature, layer) {
//    console.log(feature);
//    layer.bindPopup(feature.properties.city);
//};

var max_temps = new L.geoJson(null, {
    pointToLayer: function(feature, latlng) {
        console.log(latlng, feature);
        return L.marker(latlng, {
          icon: smallIcon
        });
      },
      onEachFeature: onEachFeature
});
max_temps.addTo(map);

$.ajax({
    dataType: "json",
    url: "summary.geojson",
    success: function(data) {
        $(data.features).each(function(key, data) { 
            max_temps.addData(data);
        });
        
    }
}).error(function() {});

//============================
//var smallIcon = new L.Icon({
//    iconUrl: 'pin-1_dk_blue.png',
//    iconRetinaUrl: 'pin-1_dk_blue.png',
//    iconSize:    [25, 25],
//    iconAnchor:  [12, 41],
//    popupAnchor: [1, -34],
//    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//    shadowSize:  [41, 41]
//  });
//
//  function onEachFeature(feature, layer) {
//    console.log(feature);
//    layer.bindPopup(feature.properties.city);
//  }
//
//  $.getJSON('summary.geojson', function(data) {
//    console.log(data);
//
//    L.geoJson(data, {
//      pointToLayer: function(feature, latlng) {
//        console.log(latlng, feature);
//        return L.marker(latlng, {
//          icon: smallIcon
//        });
//      },
//      onEachFeature: onEachFeature
//    }).addTo(map);
//  });
//===========================


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
    "Maximum Temperatures": max_temps,
    "Weather": nexrad
};
L.control.layers(baseLayers, overlays).addTo(map);

map.setView([initLat, initLong], initZoomLevel);