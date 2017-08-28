var location = 'Glasgow'; 
var locationLatLong = {lat:55.861865, lng:-4.252625};
var MapWrapper = require('./mapWrapper');
var Tag = require('../models/tag.js');
var _ = require('lodash');

var UI = function(coords, data){
  this.tags = new Map();
  this.data = data;
  this.renderMap(coords, data);
  this.selectedTags =[];
};

UI.prototype = {

  renderMap: function(locationLatLong, data){
    var zoom =12; 
    var mapDiv = document.querySelector("#main-map");
    var mainMap = new MapWrapper(mapDiv, locationLatLong, zoom, data);


   mainMap.setSearchBox();

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
    var checkBoxOptions = document.querySelector("#allCheckBox");




    // this.tags.forEach((value, key)=>{
    //   var input = document.createElement("input"); 
    //   var label = document.createElement("label");
    //   input.type ="checkbox";
    //   input.className= "checkbox"; 
    //   input.value= key; 
    //   input.addEventListener('click', ()=>{
    //     console.log(key);
    //     // mainMap.reloadMarkers(key);
    //   });
    //   label.for = key;
    //   label.innerText = key;
    //   var br = document.createElement("br");
    //   checkBoxOptions.appendChild(br);
    //   checkBoxOptions.appendChild(label);
    //   checkBoxOptions.appendChild(input);
    // });

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
        // debugger;
        mainMap.refreshMap(mainMap, this.selectedTags, this.data);

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
        mainMap.refreshMap(mainMap, this.selectedTags, this.data);

    });

    // var buttTag = document.createElement("button");
    // buttTag.id = "buttTagList";
    // buttTag.type = "submit";
    // buttTag.addEventListener('click' ()=>{
    //   console.log("click");
    // })
    // checkBoxOptions.appendChild(buttTag);



    // reloadMarkers: function(key){
    //   this.data.forEach(function(gram){
    //     if(gram.tags.includes(key)){
    //     this.addMarker(gram);
    //   }
    //   });
    // }

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
      var checkboxContainer = document.querySelector("#allCheckBox");
      console.log(checkboxContainer);
      checkboxContainer.style.display = "block";
    });
  }, 



}


module.exports = UI;