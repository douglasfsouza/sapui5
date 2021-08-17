sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/ui/model/json/JSONModel'
], function(UIComponent,JSONModel){
    'use strict';

    return UIComponent.extend("doug.Component",{
        metadata:{
            manifest:"json"
        },
        init: function(){
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
        }
    });
})