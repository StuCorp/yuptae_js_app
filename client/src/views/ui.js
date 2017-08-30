var location = 'Glasgow'; 
var locationLatLong = {lat:55.861865, lng:-4.252625};
var MapWrapper = require('./mapWrapper');
var Tag = require('../models/tag.js');
var _ = require('lodash');

var UI = function(callback){
  this.tags = new Map();
  this.data = undefined;
  // this.renderMap(coords, data);
  this.selectedTags =[];
  this.apiCall = callback; 
  this.mainMap = undefined;

};

UI.prototype = {

  renderMap: function(locationLatLong, data){
    this.data = data; 
    var zoom =12; 
    var mapDiv = document.querySelector("#main-map");
    this.mainMap = new MapWrapper(mapDiv, locationLatLong, zoom, data);
    this.setUp(data);
  //store current location
  this.mainMap.geoGetUm();
  this.setUpButtons();  

},


setUpButtons: function(){
//HOME BUTTON
var homeButton = document.querySelector("#buttHome");
homeButton.addEventListener('click', ()=>{
  var responseText = localStorage.getItem("currentLocation");
  var localCoords = JSON.parse(responseText);
  this.apiCall(localCoords);
});
//DISTANCE SELECTOR
var distanceButton = document.querySelector("#distanceSelector"); 
distanceSelector.addEventListener('change', ()=>{
  console.log(distanceSelector.value);
  this.apiCall(false, distanceSelector.value);
});
//REFRESH BUTTON 
var refreshButton = document.querySelector("#buttRefresh"); 
refreshButton.addEventListener('click', ()=>{
  this.apiCall(false, false);
});

//RANDOM GRAM SELECT
var randomSelect = document.querySelector("#randomSelectButt");
randomSelect.addEventListener("click", ()=>{
  console.log("nice try!");
  this.mainMap.randomInfoBox();
});

var cityChoose = document.querySelector("#cityChooseIcon"); 
var citySearchBox = document.querySelector("#pac-input"); 
cityChoose.addEventListener("click", ()=>{
  // debugger;
  if(citySearchBox.style.visibility==="hidden"){
    citySearchBox.style.visibility="visible";
  } else{
    citySearchBox.style.visibility="hidden";
  }
});


var distanceChoose = document.querySelector("#distanceChooseIcon"); 
var distanceBox = document.querySelector("#distanceSelector"); 
distanceChoose.addEventListener("click", ()=>{
  // debugger;
  if(distanceBox.style.visibility==="hidden"){
    distanceBox.style.visibility="visible";
  } else{
    distanceBox.style.visibility="hidden";
  }
});

//nav open and close

var buttOpen = document.querySelector("#buttOpen");
buttOpen.addEventListener('click', ()=>{
  document.getElementById("sideNav").style.width = "250px";
  document.querySelector("#buttOpen").style.visibility= "hidden";
});

var buttClose = document.querySelector("#closebtn");
buttClose.addEventListener('click', ()=>{
  document.getElementById("sideNav").style.width = "0";
  document.querySelector("#buttOpen").style.visibility= "visible";
});


},


refreshMap: function(coords, data){
  this.data= data;
  this.tags = new Map();
  this.mainMap.googleMap.setCenter(coords);

  this.setUp(data);
},

setUp: function(data){

  this.selectedTags = []; 
  this.mainMap.setSearchBox(this.apiCall);

    //get all hashtags from the instagrams
    data.forEach((gram)=>{
      gram.tags.forEach((tag)=>{
        if(this.tags.has(tag)){
          var value = this.tags.get(tag);
          this.tags.set(tag, value +1);
        } else{
          this.tags.set(tag, 1);
        }
      });
    });

    var myTag = new Tag("brunch", 1);

    tagArray =[]; 
    data.forEach((gram)=>{
      gram.tags.forEach((tag)=>{
        var newTag = new Tag(tag, 1);
        var tagFound = false;
    // tagArray.forEach((tag)=>{
    //   if(tag.name === newTag.name)
    // })


    tagArray.forEach((tagObject)=>{
      if(tagObject.name === newTag.name){
        tagFound = true;
        tagObject.value++; 
      }
    });
    if(tagFound===false){
      tagArray.push(newTag);
    }
  });
    });

    // _.includes(tagArray, newTag.name)


    //generate check boxes for each tag
    var checkBoxOptions = document.querySelector("#topTenContainer");

    while(checkBoxOptions.firstChild){
     checkBoxOptions.removeChild(checkBoxOptions.firstChild);
   }



   var sortedTagArray = _.sortBy(tagArray, [function(tagObject) { return tagObject.value; }]);
   sortedTagArray.reverse();


   console.log(sortedTagArray);

   var tagBoxRefs = []; 


    // debugger;
    var sortedTagArrayTop10 = sortedTagArray.slice(0, 10);
    sortedTagArrayTop10.forEach((tagObject, index)=>{
      var input = document.createElement("input"); 
      var label = document.createElement("label");
      

      input.type ="checkbox";
      input.className= "checkbox" + index; 
      input.value= tagObject.name; 
      input.addEventListener('click', ()=>{
        console.log(tagObject.name);
        console.log(allInput);
        allInput.checked = false;
        console.log(allInput);

        if(!this.selectedTags.includes(tagObject.name)){
          this.selectedTags.push(tagObject.name);
        } else{
          this.selectedTags.splice(this.selectedTags.indexOf(tagObject.name), 1);
        }
        console.log(this.selectedTags);

        //refresh map
        // // debugger;
        this.mainMap.refreshMap(this.mainMap, this.selectedTags, this.data);

        // mainMap.reloadMarkers(key);
      });
      label.for = tagObject.name;
      label.innerText = tagObject.name;
      var br = document.createElement("br");
      checkBoxOptions.appendChild(br);
      checkBoxOptions.appendChild(label);
      checkBoxOptions.appendChild(input);
      tagBoxRefs.push(input);
    });

    console.log(tagBoxRefs);

    var allInput = document.querySelector("#allCheckInput");
    allInput.addEventListener('click', ()=>{
      this.selectedTags= [];
      console.log(this.selectedTags);
      tagBoxRefs.forEach((input)=>{
        input.checked= false; 
      });
      // debugger;
      this.mainMap.refreshMap(this.mainMap, this.selectedTags, this.data);

    });



    this.mainMap.deleteMarkers();
    data.forEach((gram)=>{
      this.mainMap.addMarker(gram);
    });

    // this.mainMap.addClickEvent();

    

    debugger;
    // var liverCoords = {lat:53.4084, lng:-2.9916};
    // this.apiCall(liverCoords);

  } 


}


module.exports = UI;