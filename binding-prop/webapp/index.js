sap.ui.require([
    'sap/m/Text',
    'sap/ui/model/json/JSONModel'
], function(Text,JSONModel) {
    'use strict';
    
    sap.ui.getCore().attachInit(function(){
        var oModel = new JSONModel({
            greeting: "Hi, my name is Doug"
        });

        sap.ui.getCore().setModel(oModel);

        new Text({
            id: "txtGreeting",
            text: "{/greeting}"
        }).placeAt("content");


    });
    


});