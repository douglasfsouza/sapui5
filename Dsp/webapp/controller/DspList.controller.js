sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(
	Controller,
	MessageToast
) {
	"use strict";

	return Controller.extend("dgs.dsp.controller.DspList", {
		/**
		 * @override
		 */
		onInit: function() {
			//Controller.prototype.onInit.apply(this, arguments);
			//this.getView().bindElement("/StatusList('A')");
			this.getView().bindElement("/Expenses('Id1234')");
			 
			var oView = this.getView();
			var oModel = oView.getModel();

			//para funcionar o ListItem:
			// var serviceUrl = "http://localhost:32497/v1/";

			
			// var oServiceModel = new sap.ui.model.odata.ODataModel(serviceUrl,true);
			
			// oServiceModel.read("/StatusList",{
			// 	success: (oData) => {
			// 		MessageToast.show("success. Status: " + oData.results[0].Description) ;
			// 	},
			// 	error: (oError) =>{
			// 		alert("erro ao carregar os dados. Error: " + oError.Message);
			// 	} 
			// });
		},
		onInListPressed: function(oEvent){
			MessageToast.show("lista");
		},

		onDetailPressed: function(oEvent){
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("mydetail",{});
		},
		onBusyStateChanged: function(oEvent){
			oEvent.preventDefault();

            var bBusy = oEvent.getParameter("busy");

            if (!bBusy) {
                var oTable = oEvent.getSource();
                var oTpc = null;

                var bBusy = oEvent.getParameter("busy");

                if (!bBusy) {
                    oTable.setShowOverlay(false);
                }

                if (sap.ui.table.TablePointerExtension) {
                    oTpc = new sap.ui.table.TablePointerExtension(oTable);
                } else {
                    oTpc = new sap.ui.table.extensions.Pointer(oTable);
                }

                var aColumns = oTable.getColumns();

                for (var i = aColumns.length - 1; i >= 0; i--) {
                    var c = aColumns[i];
                    oTpc.doAutoResizeColumn(i);
                }
            }
		},
		onAddPressed: function(oEvent){
			MessageToast.show("add");
		},

		_dateFormat: function(date){
			if (date){
				return date.toLocaleDateString().replaceAll("/","-");
			}			
		}
	});
});