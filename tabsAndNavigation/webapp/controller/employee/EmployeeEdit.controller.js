sap.ui.define([
	"sap/ui/demo/nav/controller/BaseController"	
], function(
	BaseController	
) {
	"use strict";

	return BaseController.extend("sap.ui.demo.nav.controller.employee.EmployeeEdit", {
        /**
         * @override
         */
        onInit: function() {
            var oRouter = this.getRouter();
            oRouter.getRoute("employeeEdit").attachMatched(this._onRouteMatched,this);
            
        
        },
        _onRouteMatched: function(oEvent){
            var oArgs, oView;
            oArgs = oEvent.getParameter("arguments");

            oView = this.getView();

            oView.bindElement({
                path: "/Employees(" + oArgs.employeeId + ")",
                    events: {
                        change: this._onBindingChange.bind(this),
                        dataRequested: function(oEvent){
                            oView.setBusy(true);
                        },
                        dataReceived: function(oEvent){
                            oView.setBusy(false);
                        }
                    }

            });
        },
        _onBindingChange: function(oEvent){
            if (!this.getView().getBindingContext()){
                this.getRouter().navTo("notFound");
            }
        },
        onShowResume: function(oEvent){
            var oCtx = this.getView().getElementBinding().getBoundContext();

            this.getRouter().navTo("employeeResume", {
                employeeId: oCtx.getProperty("EmployeeID")
            });
        }
	});
});