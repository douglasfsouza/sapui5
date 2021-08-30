sap.ui.define([
    'sap/m/Text',
    'sap/ui/core/mvc/XMLView',
    'sap/ui/model/json/JSONModel'
], function(Text,XMLView,JSONModel) {
    'use strict';

    sap.ui.getCore().attachInit(function(){
        var oModel = new JSONModel({
            computer: "Dell",
            memory: "8GB",
            processor: "Core-i5"
        });

        sap.ui.getCore().setModel(oModel);

        new XMLView({
            viewName: "doug.ui.view.App"
        }).placeAt("content");

    });
        
});