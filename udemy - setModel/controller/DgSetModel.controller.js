sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',
    "sap/ui/model/json/JSONModel"
], function(Controller,MessageToast,JSONModel) {
    'use strict';
    return Controller.extend("udemy.controller.DgSetModel", {
        onInit: function(){
            var oData = {
                Recipient: {
                    Name: "world"
                }
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);           
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
            //debugger;            

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

        }
    });    
});