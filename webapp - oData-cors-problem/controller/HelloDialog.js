sap.ui.define([
    'sap/ui/base/ManagedObject',
    'sap/ui/core/Fragment',
    'sap/m/MessageToast'
], function(ManagedObject,Fragment,MessageToast) {
    'use strict';
    return ManagedObject.extend("doug.controller.App",{       
        constructor: function(oView){
            this._oView = oView;           
        },
        exit: function(){
            delete this._oView;
        },

        hi:function(){
            debugger;
            MessageToast.show("hi");

        },

        onOpenHelloDialog: function(){
            MessageToast.show("Dialog opening");
            this.getOwnerComponent().openHelloDialog();
        },

        onDgHello: function(){
            debugger;
            //var oBundle = this.getView().getModel("i18n").getResourceBundle();
            //var sRecipient = this.getView().getModel().getProperty("/recipient/name");
            //var sMsg = oBundle.getText("helloMsg",[sRecipient]);

            //MessageToast.show(sMsg);
            MessageToast.show("Hello");
            
        },
        
        open: function(){
             
            var oView = this._oView();
            if (!this.pDialog){
                var oFragmentController = {
                    onCloseDialog: function(){
                        oView.byId("helloDialog").close();
                    }
                }

                this.pDialog = Fragment.load({
                    id:oView.getId(),
                    name:"doug.view.HelloDialog",
                    controller:oFragmentController
                }).then(function(oDialog){
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this.pDialog.then(function(oDialog){
                oDialog.open();
            });
        }
        

    });
    
});