sap.ui.require([
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/mvc/XMLView'
], function(JSONModel, XMLView) {
    'use strict';
    sap.ui.getCore().attachInit(function(){
        var oModel = new JSONModel({
            firstName: "Doug",
            lastName: "Ferreira",
            enabled: true,
            title: "Names Panel",
            address:{
                city: "Jandira",
                state: "SP",
                zip: "06624-030",
                neighborhood: "Jardim Nossa Senhora de Fatima",
                street:"Rua Itambe, 128",
                country: "Brazil"
            }
        });
        
        sap.ui.getCore().setModel(oModel);
        new XMLView({
            viewName:"doug.ui.View.App"
        }).placeAt("content");

    })
    
});