sap.ui.define([
	"sap/ui/demo/nav/controller/BaseController",
    "sap/m/MessageBox"
], function(BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("sap.ui.demo.nav.controller.Home", {
        onDougClick:function(oEvent){
			MessageBox.show("Hello on Home");
        },
		onGoRoom: function(oEvent){
			this.getRouter().navTo("appRoom",{},true);
		},
		onDisplayNotfound: function(oEvent){
			this.getRouter().getTargets().display("notFound",{
				fromTarget: "home"
			});
		},
		onNavToEmployee: function(oEvent){
			this.getRouter().navTo("employeesList");
		},
		onNavToEmployeeOverview: function(oEvent){
			//alert("iMPLEMENTAR");
			this.getRouter().navTo("employeeOverview");
		}
	});
});