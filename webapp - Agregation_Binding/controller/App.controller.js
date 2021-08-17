sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment'
], function(Controller,MessageToast,Fragment) {
    'use strict';
    return Controller.extend("doug.controller.App",{       
        onDgHello: function(){
            debugger;
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var sRecipient = this.getView().getModel().getProperty("/recipient/name");
            var sMsg = oBundle.getText("helloMsg",[sRecipient]);

            MessageToast.show(sMsg);
            
        },
        onBtClick: function(){
            debugger;
            var dgRecipient = this.getView().getModel().getProperty("/caixa/texto");            
            MessageToast.show("teste");

        },
        HelloDialog_OnSave: function(){
            debugger;

        },
        onClose: function(){
            MessageToast.show("Closing");
            this.byId("helloDialog").close();
        },
        onOpenHelloDialog: function(){
            MessageToast.show("Dialog opening");
            this.getOwnerComponent().openHelloDialog();
        },
        onOpenDialog: function(){
            MessageToast.show("Dialog opening");
            this.getOwnerComponent().openHelloDialog();
            /*
            var oView = this.getView();
            if (!this.pDialog){
                this.pDialog = Fragment.load({
                    id:oView.getId(),
                    name:"doug.view.HelloDialog",
                    controller:this
                }).then(function(oDialog){
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this.pDialog.then(function(oDialog){
                oDialog.open();
            });
            */
        }
        

    });
    
});