/*
 * ${copyright}
 */

sap.ui.define([], function() {
    'use strict';
  
    /**
     * OpenUI5 library: varsis.www.library
     *
     * @namespace
     * @name webapp.utilities
     * @author marcelo.cuin
     * @version ${version}
     * @public
     */
    sap.ui.getCore().initLibrary({
      name: 'webapp.utilities',
      dependencies: [
        'sap.f',
        'sap.m',
        'sap.ui.core',
        'sap.ui.layout',
        'sap.ui.table'
      ],
      types: [
          "webapp.SaveAsTileMode"
      ],
      controls: [
		    "webapp.SaveAsTile"
      ],
      noLibraryCSS: true,
      version: '${version}',
    });

    var thisLib = webapp.utilities;

    thisLib.SaveAsTileMode = {
        Create: "Create",
        Change: "Change" 
    };
    
    return thisLib;
});


