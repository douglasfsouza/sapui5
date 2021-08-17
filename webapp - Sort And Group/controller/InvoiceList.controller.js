sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(Controller,JSONModel,formatter,Filter,FilterOperator){
    "use strict";
    return Controller.extend("doug.controller.InvoiceList",{
        formatter: formatter,
        onInit: function(){
            var oViewModel = new JSONModel({
                currency : "EUR"
            });
            this.getView().setModel(oViewModel,"view");

        },
        onFilterInvoice: function(oEvent){
            
            var oList = this.byId("invoiceList");
            var sQuery = oEvent.getParameter("query");
            var aQuery = [];
            if (sQuery){
                aQuery.push(new Filter("ProductName",FilterOperator.Contains,sQuery));
            }
            var oBinding = oList.getBinding("items");
            oBinding.filter(aQuery);
            debugger;

        }
    });

});