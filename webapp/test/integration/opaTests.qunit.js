sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/redbull/sb/umdlpartner4/umdlpartner4/test/integration/FirstJourney',
		'com/redbull/sb/umdlpartner4/umdlpartner4/test/integration/pages/Partner4List',
		'com/redbull/sb/umdlpartner4/umdlpartner4/test/integration/pages/Partner4ObjectPage'
    ],
    function(JourneyRunner, opaJourney, Partner4List, Partner4ObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/redbull/sb/umdlpartner4/umdlpartner4') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThePartner4List: Partner4List,
					onThePartner4ObjectPage: Partner4ObjectPage
                }
            },
            opaJourney.run
        );
    }
);