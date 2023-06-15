
// Imports
import WebMap from "@arcgis/core/WebMap.js";
import MapView from '@arcgis/core/views/MapView.js';
import Home from "@arcgis/core/widgets/Home.js";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle.js";
import Legend from "@arcgis/core/widgets/Legend.js";
import Expand from "@arcgis/core/widgets/Expand.js";

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
    expandIcon: "legend", 
    expandTooltip: "Expand Legend",
    expanded: true, 
    view: view, 
    content: recLegend
});

view.ui.add(legendExpand, "bottom-right");

view.when(() => {
    console.log('view ready');
});