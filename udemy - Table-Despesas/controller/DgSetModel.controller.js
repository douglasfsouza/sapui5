sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../formatter"
], function(Controller,MessageToast,JSONModel,ResourceModel,Filter,FilterOperator,formatter) {
    'use strict';
    return Controller.extend("udemy.controller.DgSetModel", {
        formatter: formatter,
        onInit: function(){
            var oData = {
                Recipient: {
                    Name: "world"
                }
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);      
            
            var oDespesas = new JSONModel("Despesas.json");
            this.getView().setModel(oDespesas,"despesas");
        },
        onShowHello : function() {           
            MessageToast.show("Hello World");
        },
        onGerarModel : function(){
            var oData = {car: "peogeout"};
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
            MessageToast.show("gerar");
        },
        onLerModel : function(){            
            //var oModel = this.getView().getModel("car");

            var oModel = this.getView().getModel();
			var dados = oModel.getData();

            MessageToast.show(dados.car);

        },
        onLerInput: function(){
            var oModel = this.getView().getModel();
            var dados = oModel.getData();
            MessageToast.show(dados.Recipient.Name);
        },
        onMudarInput: function(){
            var oModel = this.getView().getModel();
            var dados = oModel.getData();
            dados.Recipient.Name = "Alterado pelo botão";
            oModel = new JSONModel(dados);
            this.getView().setModel(oModel);

        },
        onVerificarLiveChange: function(){
            MessageToast.show('LiveChange');
        },
        onFilterDespesas: function(oEvent){
           
            var aFilter = [];
            var sQuery = oEvent.getParameter("query");
            if (sQuery){
                aFilter.push( new Filter("Descricao",FilterOperator.Contains,sQuery));
            }

            var oList = this.byId("despesasList");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        }
    });    
});