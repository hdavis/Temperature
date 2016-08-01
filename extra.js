        var map = L.map('map');
        var zoommax = 18;
        var initLat = 38;
        var initLong = -100;
        var initZoomLevel = 4;

        // BASEMAPS
        // Additional basemaps @ https://leaflet-extras.github.io/leaflet-providers/preview/

        // Stamen Watercolor Basemap
        var Stamen_Watercolor = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 16,
        ext: 'png'
        });
        //map.addLayer(Stamen_Watercolor);


        // Open Map Surfer Roads Basemap
        var OpenMapSurfer_Roads = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        //map.addLayer(OpenMapSurfer_Roads);


        // OpenStreetMap Black and White basemap
        var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
        maxZoom: zoommax,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        map.addLayer(OpenStreetMap_BlackAndWhite);


        // OVERLAYS
 
        // Add maximum temperature data
/*      
        // load GeoJSON from an external file using JQuery
        $.getJSON("summary.geojson",function(data){
            // add GeoJSON layer to the map once the file is loaded
            L.geoJson(data).addTo(map);
        });
 */ 
 

        var dkblueIcon = L.icon({
            iconUrl: 'pin-1_dk_blue.png',
            iconSize:     [40, 60], 
            iconAnchor: [13, 27],
            popupAnchor:  [1, -24],
        });
        
        $.getJSON("summary.geojson", function(data) {
            var geojson = L.geoJson(data, {
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(feature.properties.city);
                }
            });
            geojson.addTo(map);
        }); 
        //geojson.addTo(map);
        
       // var max_temps = new L.geoJson();


        
        //max_temps.addTo(map);
/*       
    // format for  jquery-3.1.0
    //.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})}
        
        $.ajax({
        url: "summary.geojson",
        type:"GET",
        dataType: "json",
        success: function(data) {
            $(data.features).each(function(key, data) {
            max_temps.addData(data);
        });
        }
        }).error(function() {});
*/        

/* not working with old jquery - might not work with new one either
        $.ajax({
        dataType: "json",
        url: "summary.geojson",
        success: function(data) {
            $(data.features).each(function(key, data) {
            max_temps.addData(data, pointToLayer: function(feature,latlng){
	           return L.marker(latlng,{icon: dkblueIcon});
        });
        }
        }).error(function() {});
    
  /*      
        var dkblueIcon = L.icon({
            iconUrl: 'pin-1_dk_blue.png',
            iconSize:     [40, 60], 
            iconAnchor: [13, 27],
            popupAnchor:  [1, -24],
            });
        pointToLayer: function(feature,latlng){
	           return L.marker(latlng,{icon: dkblueIcon});
            
            
        L.geoJson(data,{
            pointToLayer: function(feature,latlng){
	           return L.marker(latlng,{icon: dkblueIcon});
            }
        }).addTo(map);

        
 /*        $.ajax({
            type: "POST",
            url: 'summary.geojson',
            dataType: 'json',
            success: function (response) {
                geojsonLayer = L.geoJson(response).addTo(map);
                //map.fitBounds(geojsonLayer.getBounds());
               // $("#info").fadeOut(500);
            }
        });
        
*/         
         // Add maximum temperature data       

 /* 
        $.getJSON("summary.geojson",function(data){
            var dkblueIcon = L.icon({
                iconUrl: 'pin-1_dk_blue.png',
                iconSize:     [40, 60], 
                });
            L.geoJson(data,{
                pointToLayer: function(feature,latlng){
	               return L.marker(latlng,{icon: dkblueIcon});
                }
            }).addTo(map);
        });
*/        
        
      
        // (2) Add a WMS for weather data
        var nexrad = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
        layers: 'nexrad-n0r-900913',
        format: 'image/png',
        transparent: true,
        attribution: "Weather data © 2012 IEM Nexrad"
        });
        map.addLayer(nexrad);


        // Define and display the control for Basemaps and Overlays
        var baseLayers = {
            "Water Color": Stamen_Watercolor,
            "Open Map Surfer Roads": OpenMapSurfer_Roads,
            "Open Street Map - B&W": OpenStreetMap_BlackAndWhite
        };
        var overlays = {
            "Maximum Temperatures": geojson,
            "Weather": nexrad,
        };
        L.control.layers(baseLayers, overlays).addTo(map);

        map.setView([initLat, initLong], initZoomLevel);
    </script>
