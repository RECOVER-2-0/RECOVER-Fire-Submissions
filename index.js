
// Imports
import WebMap from "@arcgis/core/WebMap.js";
import MapView from '@arcgis/core/views/MapView.js';
import Home from "@arcgis/core/widgets/Home.js";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle.js";
import Legend from "@arcgis/core/widgets/Legend.js";
import Search from "@arcgis/core/widgets/Search.js";
import LayerList from "@arcgis/core/widgets/LayerList.js";
import Expand from "@arcgis/core/widgets/Expand.js";
import Editor from "@arcgis/core/widgets/Editor.js";

// Script
const webmap = new WebMap({
    portalItem: { // autocasts as new PortalItem()
      id: "72e8ab3919ad4f56ba0ab7abbe3aafae"
    }
});

const view = new MapView({
    map: webmap,
    center: [-112.5, 40.5],
    zoom: 5,
    container: "viewDiv"
});

view.ui.move("zoom", "top-right");

const basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "topo"
  });
  
view.ui.add(basemapToggle, {
    position: "top-right",
    index: 0
});

const homeWidget = new Home({
    view: view
});

// TODO: figure out how to just add stuff all at once
// instead of needing to view.ui.add() everytime
view.ui.add(homeWidget, {
    position: "top-right",
    index: 1
});

const recLegend = new Legend({
    container: document.createElement("div"),
    view: view
});

const legendExpand = new Expand({
    expandIcon: "legend", 
    expandTooltip: "Expand Legend",
    view: view, 
    content: recLegend
});

view.ui.add(legendExpand, "bottom-right");

let search = new Search({
    container: document.getElementById("searchDiv"),
    view: view
});

view.ui.add(document.getElementById("sidebar"), "left");

// let lyrList = new LayerList({
//     container: document.createElement("div"),
//     view: view
// });

// let submissionEditor = new Editor({
//     container: document.createElement("div"),
//     view: view,
//     icon: "layers-editable"
// });

// let expand1 = new Expand({
//     view: view,
//     content: search,
//     expandIcon: "search",
//     group: "top-left"
// });
// let expand2 = new Expand({
//     view: view,
//     content: lyrList,
//     expandIcon: "legend-plus",
//     group: "top-left"
// });
// let expand3 = new Expand({
//     view: view,
//     content: submissionEditor,
//     expandIcon: "layers-editable",
//     group: "top-left"
// });
  
// view.ui.add([expand1, expand2, expand3], "top-left");

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}

view.when(() => {
    console.log('view ready');
});