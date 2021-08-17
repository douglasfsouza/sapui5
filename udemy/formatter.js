sap.ui.define([], function() {
    'use strict';
    return{
        tipoText:function(status){
            switch(status){
                case "C":
                    return "Crédito";
                case "D":
                    return "Débito";
                default:
                    return "Indefinido";
            }

        }
    }
    
});