sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function(Controller, JSONModel,MessageToast) {
	"use strict";

	return Controller.extend("sap.ui.table.sample.TreeTable.JSONTreeBinding.Controller", {
		onInit: function() {
			var oModel = new JSONModel("CadHierarchy.json");
			this.getView().setModel(oModel);
		},

		onCollapseAll: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.collapseAll();
		},

		onCollapseSelection: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.collapse(oTreeTable.getSelectedIndices());
		},

		onExpandFirstLevel: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.expandToLevel(1);
		},

		onExpandSelection: function() {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.expand(oTreeTable.getSelectedIndices());
		},
		onLerCampo: function(){
			debugger;
	
			var valor = this.byId("valor");	
			
			MessageToast.show(valor.mProperties.value);		 
			
		}
	});
});