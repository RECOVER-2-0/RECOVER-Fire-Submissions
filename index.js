
// Imports
import WebMap from '@arcgis/core/WebMap.js';
import MapView from '@arcgis/core/views/MapView.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js'
import Editor from "@arcgis/core/widgets/Editor.js";
import ExpressionInfo from "@arcgis/core/popup/ExpressionInfo.js";
import FormTemplate from "@arcgis/core/form/FormTemplate.js";
import GroupElement from "@arcgis/core/form/elements/GroupElement.js";
import FieldElement from "@arcgis/core/form/elements/FieldElement.js";
import Home from "@arcgis/core/widgets/Home.js";

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

const validationExpression = new ExpressionInfo({
    expression: document.getElementById("validation").text,
    name: "validation",
    title: "Valid",
    returnType: "string"
});

// Required expression must be an Arcade expression that resolves to the "true" boolean
const reqExpression = "1 == 1";

// Field elements for fire location grouping
const stateFieldElement = new FieldElement({
    label: "State",
    editable: false,
    fieldName: "State",
    input: {
        type: "text-box",
        minLength: 0
    },
    valueExpression: stateExpression.name,
    requiredExpression: reqExpression
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
    },
    requiredExpression: reqExpression
});

const fireYearFieldElement = new FieldElement ({
    label: "Year",
    description: "Enter the year this fire occurred.",
    editable: true,
    fieldName: "Fire_Year",
    hint: "2023",
    input: {
        type: "text-box",
        minLength: 4,
        maxLength: 4
    },
    requiredExpression: reqExpression
});

const uidFieldElement = new FieldElement({
    label: "Unique ID",
    description: "This field is automatically generated based on fire name, year, and location.",
    editable: false, 
    fieldName: "Unique_ID",
    input: {
        type: "text-box",
        minLength: 0
    },
    valueExpression: uidExpression.name,
    requiredExpression: reqExpression
});

const firstNameFieldElement = new FieldElement({
    label: "First Name",
    editable: true,
    fieldName: "Sub_FirstName",
    input: {
        type: "text-box",
        minLength: 0,
        maxLength: 255
    },
    requiredExpression: reqExpression
});

const lastNameFieldElement = new FieldElement({
    label: "Last Name",
    editable: true,
    fieldName: "Sub_LastName",
    input: {
        type: "text-box",
        minLength: 0,
        maxLength: 255
    },
    requiredExpression: reqExpression
});

const emailFieldElement = new FieldElement({
    label: "Email Address",
    description: "Please enter a valid email address.",
    editable: true,
    fieldName: "Sub_Email",
    input: {
        type: "text-box",
        minLength: 0,
        maxLength: 255
    },
    requiredExpression: reqExpression
});

const validationFieldElement = new FieldElement({
    label: "Is the provided email address valid?",
    description: "This field checks the Email field for validity. If an invalid email is entered, the submitted polygon will NOT be included in RECOVER 2.0.",
    editable: false,
    fieldName: "Email_Val",
    input: {
        type: "text-box",
        minLength: 0
    },
    valueExpression: validationExpression.name,
    requiredExpression: reqExpression
});

const orgFieldElement = new FieldElement({
    label: "Organization",
    description: "If you belong to a federal, state, local, or other organization, please enter it here.",
    editable: true,
    fieldName: "Sub_Org",
    hint: "Ex. USFS, NPS, etc.", 
    input: {
        type: "text-box",
        minLength: 0,
        maxLength: 255
    }
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
    elements: [fireNameFieldElement, fireYearFieldElement, uidFieldElement],
    initialState: "expanded"
});

const groupElementSubmitterInfo = new GroupElement({
    label: "Submitter Information",
    description: "This information is only used by the RECOVER development team and is not shared publicly.",
    elements: [
        firstNameFieldElement, 
        lastNameFieldElement, 
        emailFieldElement, 
        validationFieldElement, 
        orgFieldElement],
    initialState: "collapsed"
});

// Set properties for comm fire feature layer's FormTemplate
const fireFormTemplate = new FormTemplate({
    title: "Community Fire Submission",
    description: "Submit a fire polygon for inclusion in RECOVER 2.0",
    elements: [groupElementFireInfo, groupElementLocation, groupElementSubmitterInfo],
    expressionInfos: [stateExpression, nearCityExpression, uidExpression, validationExpression, reqExpression]
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

    const homeWidget = new Home({
        view: view
    });

    view.ui.add({
        component: homeWidget,
        position: "top-left",
        index: 1
    });
});
