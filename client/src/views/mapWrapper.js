var _ = require('lodash');

var MapWrapper = function(container, center, zoom, data){
  this.googleMap = new google.maps.Map(container, {
    center: center,
    zoom: zoom
  });
  this.markers =[]; 
  this.currentInfoWindow = undefined;  
  this.previousInfoWindow = undefined;


}

MapWrapper.prototype = {

  addMarker: function(gram){
    // var currentTime = new Date();
    // var hours = Math.abs(currentTime - gram.createdTime) / 36e5;
    var recency = gram.getRecency();
    // debugger;
    var marker = new google.maps.Marker({
      position: gram.coords,
        // map: this.googleMap,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: 'rgba(' + _.random(0, 255) + ',' + _.random(0, 255) + ',' + _.random(0, 255) +','+ recency + ')', 
          fillOpacity: 1,
          anchor: google.maps.Point(0,0), 
          scale: 7,
          strokeWeight: 1
          // gram.postImageThumbnail,
        },
        // icon: gram.postImageThumbnail,
        animation: google.maps.Animation.DROP

      });

    if(recency>= 0.8) {    
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
    marker.addListener('click', function(){
      var infoWindow = new google.maps.InfoWindow({
        content: gram.caption
      });
      infoWindow.open(this.googleMap, marker);
      this.previousInfoWindow = this.currentInfoWindow;
      this.currentInfoWindow = infoWindow;
      if(this.previousInfoWindow){
        this.previousInfoWindow.close();
      }

    }.bind(this));
    this.markers.push(marker);

    this.setMapOnAll(this.googleMap);
  },

  addClickEvent: function(){
    google.maps.event.addListener(this.googleMap, 'click', (event)=>{
    //   console.log(event);
    //   console.log(event.latLng.lat());
    //   var coords = {lat: event.latLng.lat(), lng: event.latLng.lng()};
    //   debugger;
    //   this.addMarker({coords});
    // }.bind(this));
    this.clearMarkers();
  });
  },

  bounceMarkers: function(){
    this.markers.forEach(function(marker){
      marker.setAnimation(google.maps.Animation.BOUNCE)
    });
  },

  setMapOnAll: function(map) {

    this.markers.forEach((marker)=>{
      marker.setMap(map);
    })
         // for (var i = 0; i < this.markers.length; i++) {

         //   this.markers[i].setMap(map);
         // }
       },

       // Removes the markers from the map, but keeps them in the array.
       clearMarkers: function() {
         this.setMapOnAll(null);
       },

       // Shows any markers currently in the array.
       showMarkers: function() {
         this.setMapOnAll(map);
       },

       // Deletes all markers in the array by removing references to them.
       deleteMarkers: function() {
         this.clearMarkers();
         this.markers = [];
       },



       refreshMap: function(map, tags, data){
        console.log("received ");
        console.log(map);
        console.log(tags);
        console.log(data);
        this.deleteMarkers();
        // debugger;
        if(tags.length <1){
          console.log("all up ons");
          data.forEach((gram)=>{
            this.addMarker(gram);
          });
        } else{

          data.forEach((gram)=>{
            tags.forEach((tag)=>{
              if(gram.tags.includes(tag)){
                this.addMarker(gram);
              }
            })
          });
        }
      },

      setSearchBox: function(){
      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
             // this.googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

             // Bias the SearchBox results towards current map's viewport.
             this.googleMap.addListener('bounds_changed', ()=> {
               searchBox.setBounds(this.googleMap.getBounds());
             });
             google.maps.event.addListener(searchBox, 'places_changed', function() {
               searchBox.set(this.googleMap, null);
             debugger;
               
             });
           }

         }

// addMarker: function(data){
//   data.forEach((gram)=>{
//     var marker = new google.maps.Marker({
//       position: gram.coords,
//       map: this.googleMap
//     });
//   })
// },


module.exports = MapWrapper;

