define(['underscore',
        'angular',
        'mocks',
        'jquery',
        'App/Directives/ThemeTile'], function (_) {
            'use strict';

            describe('Theme Tile directive', function () {
                var scope,
                    element;



                beforeEach(function () {
                    module('App');
                });


                describe('Given a theme', function () {
                    beforeEach(inject(function ($rootScope, $compile) {
                        scope = $rootScope;

                        scope.theme = {
                            "@type": "Theme",
                            "service": {
                                "@type": "Service",
                                "@id": "http://data.emii.com/bca/servicis/cis"
                            },
                            "@id": "http://data.emii.com/bca/themes/cis-theme4",
                            "canonicalLabel": "CONSTRUCTIVE BIAS TOWARDS COMMODITIES"

                        };
                        element = $compile('<div theme-tile theme="theme"></div>')(scope);

                    }));

                    describe('When rendering the tile', function () {
                        it('Should render the information in the tile', function () {
                            scope.$digest();
                            expect(element.find('.title').text().trim()).toBe('CONSTRUCTIVE BIAS TOWARDS COMMODITIES');
                        });
                    });

                    describe('When clicking on the tile', function () {
                        it('should redirect to the themes page', inject(function ($location) {
                            scope.$digest();
                            element.find('.title').trigger('click');
                            expect($location.path()).toBe('/themes');
                            expect($location.search()).toEqual({
                                uri: 'http://data.emii.com/bca/themes/cis-theme4'
                            });
                        }));
                    });

                    describe('Given a theme with a long title', function () {
                        beforeEach(inject(function ($rootScope, $compile) {
                            scope = $rootScope;

                            scope.theme = {
                                "@type": "Theme",
                                "service": {
                                    "@type": "Service",
                                    "@id": "http://data.emii.com/bca/servicis/cis"
                                },
                                "@id": "http://data.emii.com/bca/themes/cis-theme4",
                                "canonicalLabel": "2013 - Monetary re-entry/exit strategy/forward guidance - 2008-2013 (was: Feds exit strategy and timing) 2013 - Monetary re-entry/exit strategy/forward guidance - 2008-2013 (was: Feds exit strategy and timing)"

                            };
                            element = $compile('<div theme-tile theme="theme"></div>')(scope);

                        }));

                        describe('When rendering the tile', function () {
                            it('Should wrap the title', function () {
                                scope.$digest();
                                expect(element.find('.title').text().trim()).toBe('2013 - Monetary re-entry/exit strategy/forward guidance - 2008-2013 (was: Feds exit strategy and timing) 2013 - Monetary re-entry/exit strategy/forwar...');
                            });
                        });

                    });
                });


            });
        });


