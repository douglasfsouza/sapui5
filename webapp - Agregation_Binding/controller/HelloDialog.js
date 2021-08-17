sap.ui.define([
    'sap/ui/base/ManagedObject',
    'sap/ui/core/Fragment'
], function(ManagedObject,Fragment) {
    'use strict';
    return ManagedObject.extend("doug.controller.App",{       
        constructor: function(oView){
            this._oView = oView;           
        },
        exit: function(){
            delete this._oView;
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