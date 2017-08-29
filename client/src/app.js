var UI = require('./views/ui.js');
var Instantgram = require('./models/instantgram');
var currentCoords = undefined;
var grams = []; 
var firstTime = true;
var ui = undefined;

var app = function(){

  ui = new UI(apiCall);

  coords = {lat:55.861865, lng:-4.252625};


  apiCall(coords);

  //build URL
  // var cityChoose = document.querySelector("#buttChoose");
  // var cityChooseModal = document.getElementById('myModal');
  // cityChoose.addEventListener('click', ()=>{
  //   myModal.style.display="block";
  // });
}

var apiCall = function(coords){
  currentCoords = coords;
  grams= [];
  var distance = 5000;
  var accessToken = "5929060757.44315dc.c904f414cb714c5087d2ea5aa91a84c7"
  var url = "https://api.instagram.com/v1/media/search?lat=" + coords.lat + "&lng="+ coords.lng +"&distance="+ distance + "&access_token=" + accessToken; 
  // var url2 = "https://api.instagram.com/v1/media/search?lat=55.8642&lng=-4.2518&distance=5000&access_token=5929060757.44315dc.c904f414cb714c5087d2ea5aa91a84c7";
  console.log(url);


  makeRequest(url, requestComplete);
};

var makeRequest = function(url, callback){
  // debugger;

  var request = new XMLHttpRequest(); 
  request.open('GET', url);
  request.addEventListener('load', callback);
  request.send(); 
};

var requestComplete = function(){
  // debugger;
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
// debugger;
  if(firstTime===true){
    ui.renderMap(currentCoords, grams);
    firstTime=false;
  } else{
    // ui.setMapCentre(coords);
    // ui.setData(grams);
    ui.refreshMap(currentCoords, grams);
  }
};



window.addEventListener("load", app);

