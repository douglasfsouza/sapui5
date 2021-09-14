sap.ui.define([
	"sap/ui/demo/nav/controller/BaseController"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("sap.ui.demo.nav.controller.employee.Resume", {
        /**
         * @override
         */
        onInit: function() {
            var oRouter = this.getRouter();

            oRouter.getRoute("employeeResume").attachMatched(this._onRouteMatched,this);
            
        
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
                        oView.setBusy(false);

                    }
                }
            });


            
        },
        _onBindingChange: function(oEvent){
            if (!this.getView().getBindingContext()){
                this.getRouter().getTargets().display("notFound");
            }
        }

	});
});