sap.ui.define([
	"sap/ui/demo/nav/controller/BaseController",
    "sap/m/MessageBox"
], function(BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("sap.ui.demo.nav.controller.Room", {
        onDougClick:function(oEvent){
			MessageBox.show("Hello on Room");
        }
	});
});