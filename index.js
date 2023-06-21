
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

view.ui.add(legendExpand, "bottom-left");

//new stuff
const search = new Search({
    container: document.createElement("div"),
    view: view,
    allPlaceholder: "Search RECOVER fires, submitted fires, or location",
    includeDefaultSources: true, // to include Esri geocoder
    sources: [
        {
            layer: recoverFires,
            searchFields: ["poly_IncidentName", "irwin_UniqueFireIdentifier"], // Note: Cannot use field aliases nor "*" wildcard for searchFields
            suggestionTemplate: "{poly_IncidentName} ({irwin_UniqueFireIdentifier})",
            exactMatch: false,
            outFields: ["*"],
            placeholder: "Search RECOVER fires",
            name: "RECOVER Fires"
        },
        {
            layer: commFires,
            searchFields: ["Fire_Name", "Unique_ID"],
            suggestionTemplate: "{Fire_Name} ({Unique_ID})",
            exactMatch: false,
            outFields: ["*"],
            placeholder: "Search submitted fires",
            name: "Submitted Fires"
        }
    ]
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
    expandIconClass: "esri-icon-question", // This property is deprecated in 4.27
    expandTooltip: "Expand Instructions",
    collapseTooltip: "Collapse Instructions",
    view: view,
    content: document.getElementById("infoDiv")
});

const aboutInfo = new Expand({
    expandIconClass: "esri-icon-description",
    expandTooltip: "Expand About",
    collapseTooltip: "Collapse About",
    view: view,
    content: document.getElementById("aboutDiv")
});

view.ui.add(instructions, {
    position: "bottom-right",
    index: 0
});

view.ui.add(aboutInfo, {
    position: "bottom-right",
    index: 1
});

view.when(() => {
    console.log('view ready');
});