sap.ui.define([
	"sap/ui/demo/nav/controller/BaseController"
], function(
	BaseController
) {
	"use strict";

	return BaseController.extend("sap.ui.demo.nav.controller.NotFound", {
		/**
		 * @override
		 */
		onInit: function() {
			//BaseController.prototype.onInit.apply(this, arguments);
			var oRouter, oTarget;

			oRouter = this.getRouter();
			oTarget = oRouter.getTarget("notFound");
			
			oTarget.attachDisplay(function(oEvent){
				debugger;
				this._oDataDgs = oEvent.getParameter("data");
			}, this);	
			
			
		
		},
		/**
		 * @override
		 */
		onNavBack: function() {
			if (this._oDataDgs && this._oDataDgs.fromTarget){
				this.getRouter().getTargets().display(this._oDataDgs.fromTarget);
				delete this._oDataDgs.fromTarget;
				return;
			}
			BaseController.prototype.onNavBack.apply(this, arguments);
			
		
		}
		
	});
});