
// Imports
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import Map from "@arcgis/core/Map.js";
import MapView from '@arcgis/core/views/MapView.js';
import Home from "@arcgis/core/widgets/Home.js";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle.js";
import Legend from "@arcgis/core/widgets/Legend.js";
import Search from "@arcgis/core/widgets/Search.js";
import LayerList from "@arcgis/core/widgets/LayerList.js";
import Expand from "@arcgis/core/widgets/Expand.js";
import Editor from "@arcgis/core/widgets/Editor.js";

// Script
const commFires = new FeatureLayer({
    url: "https://services1.arcgis.com/z5tlnpYHokW9isdE/arcgis/rest/services/community_fire_submissions/FeatureServer/0"
});
const recoverFires = new FeatureLayer({
    url: "https://services1.arcgis.com/z5tlnpYHokW9isdE/arcgis/rest/services/RECOVER_Fires/FeatureServer"
});

const map = new Map({
    basemap: "topo",
    layers: [commFires, recoverFires]
});

const view = new MapView({
    map: map,
    center: [-112.5, 40.5],
    zoom: 5,
    container: "viewDiv"
});

view.ui.move("zoom", "top-right");

const basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "satellite"
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
    expandTooltip: "Expand Legend", 
    view: view, 
    content: recLegend
});

view.ui.add(legendExpand, "bottom-right");

//new stuff
let search = new Search({
    container: document.createElement("div"),
    view: view
});

let lyrList = new LayerList({
    container: document.createElement("div"),
    view: view
});

let submissionEditor = new Editor({
    container: document.createElement("div"),
    view: view,
});

let expand1 = new Expand({
    view: view,
    content: search,
    group: "top-left"
});
let expand2 = new Expand({
    view: view,
    content: lyrList,
    group: "top-left"
});
let expand3 = new Expand({
    view: view,
    content: submissionEditor,
    group: "top-left"
});

  
view.ui.add([expand1, expand2, expand3], "top-left");

const instructions = new Expand({
    expandIcon: "esri-icon-comment",
    expandTooltip: "Expand Me!",
    collapseTooltip: "Collapse Me!",
    expanded: true,
    view: view,
    content: document.getElementById("infoDiv")
});

view.ui.add(instructions, "bottom-left");

view.when(() => {
    console.log('view ready');
});