sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast'
], function(Controller, MessageToast) {
    'use strict';

    Controller.extend("dgs.man.controller.App",{
        onButtonPressed: function(oEvent){
            var oModel = this.getView().getModel();
            MessageToast.show(oModel.getProperty("/recipient/name"));
        }
    })
    
});