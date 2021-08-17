sap.ui.require([
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/mvc/XMLView'
], function(JSONModel, XMLView) {
    'use strict';

    sap.ui.getCore().attachInit(function(){
        var oModel = new JSONModel({
            firstName : "Doug",
            lastName: "Ferreira",
            enabled: true,
            title: "Clients"
        });

        sap.ui.getCore().setModel(oModel);

        new XMLView({
            viewName: "doug.ui.View.App"
        }).placeAt("content");

    });  


    
});