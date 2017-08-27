var location = 'Glasgow'; 
var locationLatLong = {lat:55.861865, lng:-4.252625};
var MapWrapper = require('./mapWrapper');

var UI = function(coords, data){
  this.tags = new Map();
  this.renderMap(coords, data);
};

UI.prototype = {

  renderMap: function(locationLatLong, data){
    var zoom =12; 
    var mapDiv = document.querySelector("#main-map");
    var mainMap = new MapWrapper(mapDiv, locationLatLong, zoom, data);

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

    //generate check boxes for each tag
    debugger;
    var checkBoxOptions = document.querySelector("#allCheckBox");


    this.tags.forEach((value, key)=>{
      var input = document.createElement("input"); 
      var label = document.createElement("label");
      input.type ="checkbox";
      input.className= "checkbox"; 
      input.value= key; 
      input.addEventListener('click', ()=>{
        console.log(key);
      });
      label.for = key;
      label.innerText = key;
      var br = document.createElement("br");
      checkBoxOptions.appendChild(br);
      checkBoxOptions.appendChild(label);
      checkBoxOptions.appendChild(input);
    });
    // var buttTag = document.createElement("button");
    // buttTag.id = "buttTagList";
    // buttTag.type = "submit";
    // buttTag.addEventListener('click' ()=>{
    //   console.log("click");
    // })
    // checkBoxOptions.appendChild(buttTag);




    data.forEach(function(gram){
      mainMap.addMarker(gram);
    });
    mainMap.addClickEvent();

    var bounceButton = document.querySelector("#buttBounce");
    // bounceButton.addEventListener("click", mainMap.bounceMarkers.bind(mainMap));
    bounceButton.addEventListener("click", ()=>{
      var sideNav = document.querySelector("#sideNav");
      console.log(sideNav);
      sideNav.style.width = "400px";
      console.log(sideNav);
    });
  }

}


module.exports = UI;