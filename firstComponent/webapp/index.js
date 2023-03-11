sap.ui.define([
    'sap/ui/core/ComponentContainer'
], function(ComponentContainer) {
    'use strict';

    new ComponentContainer({
        name: 'dgs.comp',
        settings: {
            id: 'comp'
        },
        async: true
    }).placeAt("content");
    
});