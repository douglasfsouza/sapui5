sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function(Controller,	MessageBox) {
    'use strict';

    return Controller.extend("doug.ui.smartControls.controller.App", {
        onNavigationTargetsObtained: function(oEvent){
            var oParameters = oEvent.getParameters();
            var oSemanticAttributes = oParameters.semanticAttributes;

            oParameters.show("Supplier", new sap.ui.comp.navpopover.LinkData({
                text: "Homepage",
                href: "http://sap.com",
                target: "_blank"
            }),[ new sap.ui.comp.navpopover.LinkData({
                text: "Go to shoping cart"
            })

            ], new sap.ui.layout.form.SimpleForm({
                maxContainerCols: 1,
                content: [
                    new sap.ui.core.Title({
                        text: "Product Description"
                    }), new sap.m.Image({
                        src: "img/HT-1052.jpg",
                        densityAware: false,
                        width: "50px",
                        height: "50px",
                        layoutData: new sap.m.FlexItemData({
                            growFactor: 1
                        })
                    }), new sap.m.Text({
                            text: oSemanticAttributes.Description

                    })
                ]
            })
            );},
        onNavigate: function(oEvent){
            var oParameters = oEvent.getParameters();
            if (oParameters.text === "homepage"){
                return;
            }
            MessageBox.show(oParameters.text + "has been pressed", {
                icon: sap.m.MessageBox.Icon.INFORMATION,
                title: "Smartchart Demo",
                actions: [
                    sap.m.MessageBox.Action.OK
                ]
            });

        }
        
    });
});