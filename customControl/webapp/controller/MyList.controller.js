sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(
	Controller,
	MessageToast
) {
	"use strict";

	return Controller.extend("dgs.customctrl.controller.MyList", {
		onInListPressed: function(oEvent){
			MessageToast.show("lista");
		},

		onDetailPressed: function(oEvent){
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("mydetail",{});
		}
	});
});