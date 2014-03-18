define(['underscore',
        'angular',
        'mocks',
        'jquery',
        'App/Directives/ViewTile'
    ], function (_) {
            'use strict';

            describe('View Tile directive', function() {
                var scope,
                    element;
                
               

                beforeEach(function () {
                    module('App');
                });


                describe('Given a view', function() {
                    beforeEach(inject(function($rootScope, $compile) {
                        scope = $rootScope;

                        scope.view = {
                            "viewRelativeTo": {
                                "@type": "EquityMarket",
                                "@id": "http://data.emii.com/equity-markets/jpn",
                                "canonicalLabel": "Japanese Equities"
                            },
                            "viewRecommendationType": {
                                "@type": "ViewRecommendationType",
                                "@id": "http://data.emii.com/view-recommendation-types/strategic",
                                "canonicalLabel": "Strategic"
                            },
                            "viewHorizon": "P9M",
                            "viewOn": {
                                "@type": "EquityMarket",
                                "@id": "http://data.emii.com/equity-markets/che",
                                "canonicalLabel": "Swiss Equities"
                            },
                            "status": {
                                "@type": "Status",
                                "@id": "http://data.emii.com/status/published",
                                "canonicalLabel": "Published"
                            },
                            "@type": "View",
                            "horizonEndDate": "2014-12-07",
                            "viewType": {
                                "@type": "ViewType",
                                "@id": "http://data.emii.com/view-types/relative",
                                "canonicalLabel": "Relative"
                            },
                            "canonicalLabel": "BCAH Switzerland Equities 9 months (2013/11/01) overweight(R) Rel to: Japan Equities",
                            "horizonStartDate": "2014-03-10",
                            "description": "Description for BCAH View 8",
                            "viewConviction": {
                                "@type": "ViewConviction",
                                "@id": "http://data.emii.com/view-convictions/medium",
                                "canonicalLabel": "Medium"
                            },
                            "service": {
                                "@type": "Service",
                                "description": "China Investment Strategy",
                                "@id": "http://data.emii.com/bca/services/cis",
                                "canonicalLabel": "BCA House"
                            },
                            "viewWeighting": {
                                "@type": "ViewWeighting",
                                "@id": "http://data.emii.com/view-weightings/overweight",
                                "canonicalLabel": "Overweight"
                            },
                            "viewOrigin": {
                                "@id": "http://data.emii.com/bca/views/bcah-view8"
                            },
                            "@id": "http://data.emii.com/bca/views/bcah-view8-e1"
                        };
                        element = $compile('<div view-tile view="view"></div>')(scope);
                       
                    }));

                    describe('When rendering the tile', function() {
                        it('Should render the information in the tile', function() {
                            scope.$digest();
                            expect(element.find('.title').text()).toBe('Swiss Equities');
                            expect(element.find('.sub-title').text()).toBe('VS: Japanese Equities');
                            expect(element.find('.last-update').text()).toBe('Last updated: 10 Mar 2014');
                            expect(element.find('.service-name').text()).toBe('CIS');
                            expect(element.find('[view-horizon]').text()).toBe('9 months');
                        });
                    });
                    
                    describe('When clicking on the tile', function () {
                        it('should redirect to the themes page', inject(function ($location) {
                            scope.$digest();
                            element.find('.title').trigger('click');
                            expect($location.path()).toBe('/views');
                            expect($location.search()).toEqual({
                                uri: 'http://data.emii.com/equity-markets/che'
                            });
                        }));
                    });
                });

              
            });
        });


