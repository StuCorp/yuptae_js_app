var _ = require('lodash');
var app = require('../app.js');

var MapWrapper = function(container, center, zoom, data){
  this.googleMap = new google.maps.Map(container, {
    center: center,
    zoom: zoom,
    disableDefaultUI: true,
    fullscreenControl: true,
    zoomControl: false
  });
  this.markers =[]; 
  this.currentInfoWindow = undefined;  
  this.previousInfoWindow = undefined;


}

MapWrapper.prototype = {

  addMarker: function(gram){
    var recency = gram.getRecency();
    var marker = new google.maps.Marker({
      position: gram.coords,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: 'rgba(' + _.random(0, 255) + ',' + _.random(0, 255) + ',' + _.random(0, 255) +','+ recency + ')', 
          fillOpacity: 1,
          anchor: google.maps.Point(0,0), 
          scale: 7,
          strokeWeight: 1
        },
        animation: google.maps.Animation.DROP

      });

    if(recency>= 0.8) {    
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }



    var contentString = '<div id="gramContainer" background=\"'+gram.postImageStndRes +'\"><div id="gramLocationName" class="infoWindowContent">' + gram.locationName + '</div><div id="gramImageAndCaptionContainer" class="infoWindowContent"><div id="gramImageContainer"><img id="gramImage" class="infoWindowContent" src=\"' + gram.postImageStndRes + '\"/></div> <span id="gramCaption" class="infoWindowContent">' + gram.caption + '</span></div><div id="gramUserAndProfileContainer" class="infoWindowContent"> <img id="gramUserPic" class="infoWindowContent" src=\"' + gram.profilePicture + '\"/><span id="gramUserName" class="infoWindowContent">' + gram.user + '</span><div id="gramCreationTime" class="infoWindowContent">' + gram.createdTime + '</div></div><a href=\"' +gram.externalLink+ '\" target="_blank">'+gram.externalLink+ '</a></div>'   
    marker.addListener('click', ()=>{
      var infoWindow = new google.maps.InfoWindow({
        content: contentString
      });
      infoWindow.open(this.googleMap, marker);
      this.previousInfoWindow = this.currentInfoWindow;
      this.currentInfoWindow = infoWindow;
      if(this.previousInfoWindow){
        this.previousInfoWindow.close();
      }

    

    });
    this.markers.push(marker);

    this.setMapOnAll(this.googleMap);
  },

  randomInfoBox: function(){
    var markerIndex = _.random(0, this.markers.length-1);
    var randomMarker = this.markers[markerIndex];
    var event = new MouseEvent('click', {
       'view': window,
       'bubbles': true,
       'cancelable': true
     });

    google.maps.event.trigger(randomMarker, 'click', {

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

      setSearchBox: function(callback){
      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var options = {
          types: [],
          componentRestrictions: {country: 'uk'}
      };

      var searchBox = new google.maps.places.SearchBox(input);
             // this.googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

             // Bias the SearchBox results towards current map's viewport.
             this.googleMap.addListener('bounds_changed', ()=> {
               searchBox.setBounds(this.googleMap.getBounds());
             });
             google.maps.event.addListener(searchBox, 'places_changed', ()=> {
              var places = searchBox.getPlaces();
              console.log(places);
              var newCoords = {
                lat: places[0].geometry.location.lat(),
                  lng: places[0].geometry.location.lng() 
              }
              this.googleMap.setCenter(newCoords);
              // debugger;
              callback(newCoords);

             });
           },

           geoGetUm: function(){
             navigator.geolocation.getCurrentPosition((position)=> {
               var center = {lat: position.coords.latitude, lng: position.coords.longitude};
               // this.googleMap.setCenter(center);
               // var today = new Date();
              // today = today.toJSON().slice(0,10);
               localStorage.setItem("currentLocation", JSON.stringify(center));

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

