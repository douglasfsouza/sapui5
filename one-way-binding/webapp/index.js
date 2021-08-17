sap.ui.require([
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/BindingMode',
    'sap/ui/core/mvc/XMLView'
], function(JSONModel, BindingMode,XMLView) {
    'use strict';

    sap.ui.getCore().attachInit(function(){
        var oModel = new JSONModel({
            firstName: "Doug",
            lastName: "Ferreira",
            enabled: true,
            title: "Names"
        });
        oModel.setDefaultBindingMode(BindingMode.OneWay);

        sap.ui.getCore().setModel(oModel);

        new XMLView({
            viewName: "doug.ui.View.App"
        }).placeAt("content");

    });
    
});