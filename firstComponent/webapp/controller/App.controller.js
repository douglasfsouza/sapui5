sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast'
], function(Controller, MessageToast) {
    'use strict';

    return Controller.extend("dgs.comp.controller.App",{
        onButtonPressed: function(oEvent){
            var oModel = this.getView().getModel();
            var msg = oModel.getProperty("/recipient/name");
            MessageToast.show(msg);
        }
    })    
});