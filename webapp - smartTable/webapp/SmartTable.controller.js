sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(Controller,
	MessageBox,
	MessageToast) {
	"use strict";

	return Controller.extend("sap.ui.demo.smartControls.SmartTable",{
		onProcessar: function(){
			MessageBox.success("Processar");
		},
		onComer: function(){
			MessageToast.show("Comer");

		}
	});



});
