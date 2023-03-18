sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function(
	Controller,
	History,
	MessageToast
) {
	"use strict";

	return Controller.extend("dgs.customctrl.controller.MyDetail", {
        onNavBackPressed: function(oEvent){
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash == undefined){
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("mylist",{});
			}
			else{
				window.history.go(-1);				 
			}           
        },

		onRatingChange: function(oEvent){
			var fValue = oEvent.getParameter("value");
			MessageToast.show(`Você selecionou ${fValue} estrelas`);
		},

		onResetRating: function(oEvent){
			this.byId("rating").reset();
		}
	});
});