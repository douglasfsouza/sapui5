sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller,MessageBox) {
	"use strict";

	return Controller.extend("sap.ui.demo.nav.controller.App", {

		onInit: function () {

		},
		onDougClick:function(oEvent){
			MessageBox.show("Hello");

		}

	});

});

