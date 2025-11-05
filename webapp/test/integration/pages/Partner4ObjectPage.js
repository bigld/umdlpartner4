sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'com.redbull.sb.umdlpartner4.umdlpartner4',
            componentId: 'Partner4ObjectPage',
            contextPath: '/Partner4'
        },
        CustomPageDefinitions
    );
});