sap.ui.require([
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/mvc/XMLView'
], function(JSONModel, XMLView) {
    'use strict';

    sap.ui.getCore().attachInit(function(){
        
        var oModel = new JSONModel({
            firstName: "douglas",
            lastName:"fsouza2014",
            enabled:true,
            title:"Names",
            address:{
                street:"Rua Itambe, 128",
                city:"Jandira",
                state:"SP",
                zip:"06624-030",
                neighborhood:"Jd. Nossa Senhora de Fatima"
            },
            salesAmount: 12345,
            currencyCode: "R$"
        });

        sap.ui.getCore().setModel(oModel);

        var oProductModel = new JSONModel();
        oProductModel.loadData("./Model/Products.json");
        sap.ui.getCore().setModel(oProductModel,"products");

        var oView = new XMLView({
            viewName: "doug.ui.View.App"
        });

        sap.ui.getCore().getMessageManager().registerObject(oView,true);

        oView.placeAt("content");

        
    });
    
});