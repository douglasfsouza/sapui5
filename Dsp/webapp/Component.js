sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/ui/model/json/JSONModel',
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast"
], function(UIComponent,
	JSONModel,
	ODataModel,
	MessageToast ) {
    'use strict';

    return UIComponent.extend("dgs.dsp.Component",{
        metadata : {
            "interfaces": ["sap.ui.core.IAsyncContentCreation"],
            "manifest": "json"           
        },

        init : function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);

            // set data model
            // var oData = {
            //     recipient : {
            //         name : "Hello World !!!!"
            //     }
            // };
            // var oModel = new JSONModel(oData);
            // this.setModel(oModel,"h");	

            // var serviceUrl = "http://localhost:32497/v1/";
            // var oServiceModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);

            // this.setModel(oServiceModel);
            
            this.getModel().attachEventOnce("metadataFailed", function (oEvent) {
				/*eslint-disable no-alert */
                MessageToast.show("Falha ao carregar o servico oData.");
				//alert("Falha ao carregar o servico oData.");
				/*eslint-enable no-alert */
			});

            this.getRouter().initialize();	 
        }
    });
    
});