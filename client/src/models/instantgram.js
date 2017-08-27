

var Instantgram = function(data){

  this.caption =data.caption;
  this.user = data.user; 
  this.profilePicture = data.profilePicture;
  this.postImageStndRes = data.postImageStndRes;
  this.postImageThumbnail = data.postImageThumbnail; 
  this.externalLink = data.externalLink;
  this.lat = data.lat;
  this.lng = data.lng;
  this.coords = {lat: data.lat, lng: data.lng};
  this.locationName = data.locationName;
  this.createdTime = new Date(data.createdTime *1000);
  this.tags = data.tags;

console.log(this);
}

Instantgram.prototype = {
  getRecency: function(){
    var currentTime = new Date();
    var hours = Math.abs(currentTime - this.createdTime) / 36e5;
    var recency; 
    if(hours<6){
      recency= 1;
    } else if(hours<12){
      recency= 0.8;
    } else if(hours<24){
      recency=0.5;
    }
    else{
      recency=0.2;
    }
    return recency;
  }
}

module.exports = Instantgram;