//query earthquake URL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

 // Define streetmap and darkmap layers
 //Similar to Day 1 Activity 10
 var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 525,
    maxZoom: 20,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

   //Create map to display the data
   //Similar to the Day 3 Activity 1 Citibike Activity Adv
   var dataMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 8,
  });

  // add your streetmap tile layer
  streetmap.addTo(dataMap);

// Perform a GET request to the query URL
//Similar to Day 1 Activity 10
d3.json(queryUrl).then(function(data) {
    console.log(data);

    //Give the markers their colors
    function markerColor(depth) {
        switch (true) {
          case depth <= 10:
            return  'green';
          case depth <= 30:
            return 'yellow';
          case depth <= 50:
            return 'orange';
          case depth <= 70:
            return 'darkorange';
          case depth <= 90:
            return 'orangered';
          default:
            return 'red';
        }
      }

    function mapRadius(mag) {
        if (mag == 0) { 
            return 1;
        }
        return mag * 3;
    }      
    
    //Json 
    L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng,  {radius: mapRadius(feature.properties.mag), 
            fillOpacity: 1, 
            color: 'black', 
            fillColor: markerColor(feature.geometry.coordinates[2]), 
            weight: 1,});
    },

  //Place and time of earthquake info
  //similar to Day 1 Activity 10
  //onEachFeature - Leaflet built in function x JSON
  onEachFeature : function(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<hr><p>" + "Magnitude " + (feature.properties.mag) + "</p>");
  }
}).addTo(dataMap);

  //Create legend for map
  //Similar to the Day 3 Activity 1 Citibike Activity Adv
  var legend = L.control({position: "topright"})
  legend.onAdd = function() {
    
    // When the layer control is added, insert a div with the class of "legend"  
    var div = L.DomUtil.create("div", "info legend")
     var depth = [-10, 10, 30, 50, 70, 90]
     
      //for loop, colors
      //Simialr to Day 1 Activity 6
      for (var i = 0; i < depth.length; i++) {
          div.innerHTML +=
            '<i style="background:' + markerColor(depth[i]) + "'></i>" +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1]+'<br>':'+');
       }
       return div;
     };  
  //Calling and adding the legend to the map
  legend.addTo(dataMap);

});