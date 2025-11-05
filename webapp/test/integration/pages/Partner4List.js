sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'com.redbull.sb.umdlpartner4.umdlpartner4',
            componentId: 'Partner4List',
            contextPath: '/Partner4'
        },
        CustomPageDefinitions
    );
});