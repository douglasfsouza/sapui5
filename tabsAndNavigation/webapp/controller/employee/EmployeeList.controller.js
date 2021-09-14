sap.ui.define([
	"sap/ui/demo/nav/controller/BaseController"
], function(
	BaseController
) {
	"use strict";

	return BaseController.extend("sap.ui.demo.nav.controller.employee.EmployeeList", {
        onEmployeePress: function(oEvent){
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            var employeeId = oCtx.getProperty("EmployeeID");
            //alert(employeeId);
            this.getRouter().navTo("employeeEdit",{
                employeeId: employeeId
            });
            //debugger;
        }
	});
});