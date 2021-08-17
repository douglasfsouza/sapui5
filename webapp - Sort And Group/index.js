sap.ui.define([
    "sap/ui/core/ComponentContainer"
],function(ComponentContainer){
    "use strict";

    new ComponentContainer({
        name: "doug",
        settings: {
            id: "doug"
        },
        async: true,        
    }).placeAt("content");    
});