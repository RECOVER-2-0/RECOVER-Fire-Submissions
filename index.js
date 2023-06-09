
// Imports
import Map from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle.js";

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

const basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "satellite"
  });
  
view.ui.add(basemapToggle, "top-left");

view.when(() => {
    console.log('view ready');
});