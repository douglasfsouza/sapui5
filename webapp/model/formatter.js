sap.ui.define([     
], function() {
    'use strict';
    return {
        statusText : function(sStatus){
            switch(sStatus){
                case "A":
                    return "invoiceStatusA";
                case "B":
                    return "invoiceStatusB";
                case "C":
                    return "invoiceStatusC";
                default:
                    return sStatus;         

            }
        }
    }
    
});