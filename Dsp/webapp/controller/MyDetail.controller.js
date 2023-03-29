sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("dgs.dsp.controller.MyDetail", {
        onNavBackPressed: function(oEvent){
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("dsplist",{});
        }
	});
});