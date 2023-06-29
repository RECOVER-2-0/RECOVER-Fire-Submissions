
// Imports
import WebMap from '@arcgis/core/WebMap.js';
import MapView from '@arcgis/core/views/MapView.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js'
import Editor from "@arcgis/core/widgets/Editor.js";
import ExpressionInfo from "@arcgis/core/popup/ExpressionInfo.js";
import FormTemplate from "@arcgis/core/form/FormTemplate.js";
import GroupElement from "@arcgis/core/form/elements/GroupElement.js";
import FieldElement from "@arcgis/core/form/elements/FieldElement.js";

// Config
// esriConfig.apiKey = "AAPK423affd003ff4318b71f02e00fc6a3acnZSab_6W0_qFoTc7xiALo9tGF8k8TsK-LAI8a0-U5mIWjvv1Pn6f19gO_oO4gk6U";

// Set expressionInfos for fire form Template
const stateExpression = new ExpressionInfo({
    expression: document.getElementById("state").text,
    name: "state",
    title: "State",
    returnType: "string"
});

const nearCityExpression = new ExpressionInfo({
    expression: document.getElementById("nearest-city").text,
    name: "nearest-city",
    title: "Nearest Major City",
    returnType: "string"
});

const uidExpression = new ExpressionInfo({
    expression: document.getElementById("uid").text,
    name: "unique-id",
    title: "Unique ID",
    returnType: "string"
});

// Field elements for fire location grouping
const stateFieldElement = new FieldElement({
    label: "State",
    editable: false,
    fieldName: "State",
    input: {
    type: "text-box",
    minLength: 0
    },
    valueExpression: stateExpression.name
});

const cityFieldElement = new FieldElement({
    label: "Nearest major city",
    editable: false,
    fieldName: "City",
    input: {
    type: "text-box",
    minLength: 0
    },
    valueExpression: nearCityExpression.name
});

const fireNameFieldElement = new FieldElement({
    label: "Fire Name",
    editable: true,
    fieldName: "Fire_Name",
    input: {
    type: "text-box",
    minLength: 0,
    maxLength: 255
    }
});

const uidFieldElement = new FieldElement({
    label: "Unique ID",
    editable: false, 
    fieldName: "Unique_ID",
    input: {
    type: "text-box",
    minLength: 0
    },
    valueExpression: uidExpression.name
});

// Group elements for location
const groupElementLocation = new GroupElement({
    label: "Location",
    elements: [stateFieldElement, cityFieldElement],
    initialState: "collapsed"
});

// Group elements for fire info
const groupElementFireInfo = new GroupElement({
    label: "Fire Information",
    elements: [fireNameFieldElement, uidFieldElement],
    initialState: "expanded"
});

// Set properties for comm fire feature layer's FormTemplate
const fireFormTemplate = new FormTemplate({
    title: "Community Fire Submission",
    description: "Submit a fire polygon for inclusion in RECOVER 2.0",
    elements: [groupElementFireInfo, groupElementLocation],
    expressionInfos: [stateExpression, nearCityExpression, uidExpression]
});

// Access webmap, set view, add editor widget
const webmap = new WebMap({
    portalItem: {
    id: "0c8e1fd68b2449cfb891b7f9ba314e80"
    }
});

const view = new MapView({
    map: webmap,
    center: [-111.236885, 41.409494],
    zoom: 10,
    container: "viewDiv"
});

view.when(() => {
    view.map.loadAll().then(() => {
        view.map.editableLayers.forEach((layer) => {
            // Grab comm fires from web map and set form template
            if (layer.type === "feature" && layer.title === "Community Fire Submissions") {
                layer.formTemplate = fireFormTemplate;
            }
        });
    });
    
    const editor = new Editor({
        view: view,
        supportingWidgetDefaults: {
            featureForm: {
                groupDisplay: "sequential"
            }
        }
    });
    
    view.ui.add(editor, "top-right");
});
