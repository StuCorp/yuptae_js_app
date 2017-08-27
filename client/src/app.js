var UI = require('./views/ui.js');
var Instantgram = require('./models/instantgram');
var coords;
var grams = []; 

var app = function(){
  //build URL
  coords = {lat:55.861865, lng:-4.252625};
  var distance = 5000;
  var accessToken = "5929060757.44315dc.c904f414cb714c5087d2ea5aa91a84c7"
  var url = "https://api.instagram.com/v1/media/search?lat=" + coords.lat + "&lng="+ coords.lng +"&distance="+ distance + "&access_token=" + accessToken; 
  // var url2 = "https://api.instagram.com/v1/media/search?lat=55.8642&lng=-4.2518&distance=5000&access_token=5929060757.44315dc.c904f414cb714c5087d2ea5aa91a84c7";
  console.log(url);


  makeRequest(url, requestComplete);

}

var makeRequest = function(url, callback){
  var request = new XMLHttpRequest(); 
  request.open('GET', url);
  request.addEventListener('load', callback);
  request.send(); 
};

var requestComplete = function(){
  if(this.status !==200) return; 
  var jsonString = this.responseText; 
  var instagrams = JSON.parse(jsonString); 
  console.log(instagrams);
  // debugger; 
  instagrams.data.forEach(function(gram){
    var instantgram = new Instantgram({
      caption: gram.caption.text,
      user: gram.caption.from.username,
      profilePicture: gram.caption.from.profile_picture,
      postImageStndRes: gram.images.standard_resolution.url,
      postImageThumbnail: gram.images.thumbnail,
      externalLink: gram.link,
      lat: gram.location.latitude,
      lng: gram.location.longitude,
      locationName: gram.location.name,
      createdTime: gram.created_time,
      tags: gram.tags
    })
    grams.push(instantgram);
    // debugger;
  });

  new UI(coords, grams);
};



window.addEventListener("load", app);

