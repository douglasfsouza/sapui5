sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/ui/model/json/JSONModel'   
], function(UIComponent, JSONModel ) {
    'use strict';

    return UIComponent.extend("dgs.comp.Component",{
        metadata : {
			"interfaces": ["sap.ui.core.IAsyncContentCreation"],
			"rootView": {
				"viewName": "dgs.comp.view.App",
				"type": "XML",
				/*"async": true, // implicitly set via the sap.ui.core.IAsyncContentCreation interface*/
				"id": "app"
			}
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
		}
    });
    
});