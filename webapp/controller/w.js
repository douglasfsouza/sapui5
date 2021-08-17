sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(Controller,JSONModel,formatter,Filter,FilterOperator){
    "use strict";
    return Controller.extend("doug.controller.w",{
        formatter: formatter,
        onInit: function(){
            var oViewModel = new JSONModel({
                currency : "EUR"
            });
            this.getView().setModel(oViewModel,"view");

        }
         
    });

});