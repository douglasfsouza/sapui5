sap.ui.define([
	"sap/ui/demo/nav/controller/BaseController",
	"sap/m/MessageBox",
	"sap/base/Log"
], function (BaseController,
	MessageBox,
	Log) {
	"use strict";

	return BaseController.extend("sap.ui.demo.nav.controller.App", {

		onInit: function () {

			debugger;
			
			Log.setLevel(Log.Level.INFO);
			var oRouter = this.getRouter();

			oRouter.attachBypassed(function(oEvent){
				var sHash = oEvent.getParameter("hash");
				Log.info("Sorry, the hash: " + sHash + " is invalid!!");
			});
			

		},
		onDougClick:function(oEvent){
			MessageBox.show("Hello");

		}

	});

});

