sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/ui/model/json/JSONModel'   
], function(UIComponent, JSONModel ) {
    'use strict';

    return UIComponent.extend("dgs.customctrl.Component",{
        metadata : {
            "interfaces": ["sap.ui.core.IAsyncContentCreation"],
            "manifest": "json"           
        },

        init : function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);

            // set data model
            var oData = {
                recipient : {
                    name : "Hello World !!!!"
                }
            };
            var oModel = new JSONModel(oData);
            this.setModel(oModel);		

            this.getRouter().initialize();	 
        }
    });
    
});