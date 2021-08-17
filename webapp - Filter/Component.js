sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/ui/model/json/JSONModel',
    './controller/HelloDialog'
], function(UIComponent,JSONModel,HelloDialog){
    'use strict';

    return UIComponent.extend("doug.Component",{
        metadata:{
            manifest:"json"
        },
        init: function(){
            debugger;
            UIComponent.prototype.init.apply(this,arguments);
            var oData = {
                recipient : {
                    name : "World"
                },
                rec:{
                    nome : "yes"
                },
                caixa:{
                    texto: ""
                }
            };
            var oModel = new JSONModel(oData);
            this.setModel(oModel);        
            this._helloDialog = new HelloDialog(this.getRootControl());   
        },
        exit: function(){
            this._helloDialog.destroy();
            delete this._helloDialog;
        },

        openHelloDialog: function()
        {
            this._helloDialog.open();
        }
        

    });
})