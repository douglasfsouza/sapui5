sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function(Controller,
	UIComponent) {
    'use strict';

    return Controller.extend("doug.ui.smartControls.controller.App", {
        metadata :{
            manifest: "json"
        },
        
        init: function(){
            UIComponent.prototype.init.apply(this, arguments);
            //this.getView().byId("smartFormPage").bindElement("/Products('4711')");

        },
        /**
         * @override
         */
        destroy: function() {
            Controller.prototype.destroy.apply(this, arguments);
            
        
        }
    })
});