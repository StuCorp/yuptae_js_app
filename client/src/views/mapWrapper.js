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
        map: this.googleMap,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: 'rgba(' + _.random(0, 255) + ',' + _.random(0, 255) + ',' + _.random(0, 255) +','+ recency + ')', 
          fillOpacity: 1,
          anchor: google.maps.Point(0,0), 
          scale: 10,
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
  },

  addClickEvent: function(){
    google.maps.event.addListener(this.googleMap, 'click', function(event){
      console.log(event);
      console.log(event.latLng.lat());
      var coords = {lat: event.latLng.lat(), lng: event.latLng.lng()};
      debugger;
      this.addMarker({coords});
    }.bind(this));
  },

  bounceMarkers: function(){
    this.markers.forEach(function(marker){
      marker.setAnimation(google.maps.Animation.BOUNCE)
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

