define(['underscore',
        'angular',
        'mocks',
        'jquery',
        'App/Directives/ThemeBrick'], function(_) {
            'use strict';

            describe('Theme Brick directive', function() {
                var scope,
                    element,
                    $httpBackend;

                beforeEach(function() {
                    module('App');
                    module('ThemeBrick.Spec');
                });

                function deferStub(q, result) {
                    return function () {
                        var deferred = q.defer();
                        deferred.resolve(result);
                        return deferred.promise;
                    };
                }

                angular.module('ThemeBrick.Spec', []).service('Perspectives', ['$q', function ($q) {
                    return {
                        post: deferStub($q, 'someid'),
                        remove: deferStub($q, true)
                    };
                }]).service('PerspectiveBuilder', ['$q', function ($q) {
                    return {
                        buildPerspective: deferStub($q, {})
                    };
                }]).factory('Analytics', function () {
                    return {
                        registerPageTrack: function () {
                        },
                        registerClick: function () {
                        },
                        logUsage: function () {
                        }
                    };
                });


                describe('Given a parent theme with child themes', function() {
                    beforeEach(inject(function ($rootScope, $compile, _$httpBackend_) {
                        scope = $rootScope;
                        $httpBackend = _$httpBackend_;
                        scope.theme = {
                            "@type": "Theme",
                            "lastApplied": "2013-07-22T09:00:00Z",
                            "created": "2013-07-20T09:00:00Z",
                            "impact": "neutral",
                            "childTheme": {
                                "@set": [
                                    {
                                        "lastApplied": "2013-08-22T09:00:00Z",
                                        "created": "2013-07-20T09:00:00Z",
                                        "@type": "Theme",
                                        "description": "FES Theme 4",
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/fes",
                                            "canonicalLabel": "Foreign Exchange Strategy"
                                        },
                                        "parentTheme": {
                                            "@id": "http://data.emii.com/bca/themes/bcah-theme4"
                                        },
                                        "@id": "http://data.emii.com/bca/themes/fes-theme4",
                                        "impactedView": {
                                            "@set": [
                                                {
                                                    "viewOn": {
                                                        "@id": "http://data.emii.com/currency-pairs/usd-hkd",
                                                        "canonicalLabel": "USD/HKD"
                                                    },
                                                    "service": {
                                                        "@id": "http://data.emii.com/bca/services/fes",
                                                        "canonicalLabel": "Foreign Exchange Strategy"
                                                    },
                                                    "@id": "http://data.emii.com/bca/views/fes-view7",
                                                    "canonicalLabel": "FES USD/HKD 6 months (2013/08/17) short(A)"
                                                },
                                                {
                                                    "viewOn": {
                                                        "@id": "http://data.emii.com/currencies/inr",
                                                        "canonicalLabel": "Indian rupee"
                                                    },
                                                    "service": {
                                                        "@id": "http://data.emii.com/bca/services/fes",
                                                        "canonicalLabel": "Foreign Exchange Strategy"
                                                    },
                                                    "@id": "http://data.emii.com/bca/views/fes-view6",
                                                    "canonicalLabel": "FES Indian rupee 3 months (2013/02/05) underweight(R)"
                                                }
                                            ]
                                        },
                                        "canonicalLabel": "Concerns over U.S. fiscal policy may grow into the November elections, adding downside pressure on the dollar.",
                                        "isFavourited": false
                                    },
                                    {
                                        "lastApplied": "2013-08-22T09:00:00Z",
                                        "created": "2013-07-20T09:00:00Z",
                                        "@type": "Theme",
                                        "description": "USIS Theme 5",
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/usis",
                                            "canonicalLabel": "U.S. Investment Strategy"
                                        },
                                        "parentTheme": {
                                            "@id": "http://data.emii.com/bca/themes/bcah-theme4"
                                        },
                                        "@id": "http://data.emii.com/bca/themes/usis-theme5",
                                        "impactedView": {
                                            "@set": [
                                                {
                                                    "viewOn": {
                                                        "@id": "http://data.emii.com/economies/wld",
                                                        "canonicalLabel": "Global Economy"
                                                    },
                                                    "service": {
                                                        "@id": "http://data.emii.com/bca/services/usis",
                                                        "canonicalLabel": "U.S. Investment Strategy"
                                                    },
                                                    "@id": "http://data.emii.com/bca/views/usis-view8",
                                                    "canonicalLabel": "USIS Global Economy 6 months (2013/05/05) stronger(E)"
                                                },
                                                {
                                                    "viewOn": {
                                                        "@id": "http://data.emii.com/fixed-income/usa-crp-ig",
                                                        "canonicalLabel": "American Corporate Investment Grade Bonds"
                                                    },
                                                    "service": {
                                                        "@id": "http://data.emii.com/bca/services/usis",
                                                        "canonicalLabel": "U.S. Investment Strategy"
                                                    },
                                                    "@id": "http://data.emii.com/bca/views/usis-view9",
                                                    "canonicalLabel": "USIS American Corporate Investment Grade Bonds 6 months (2013/11/22) overweight(R) Rel to: American Govertitnment Bonds"
                                                }
                                            ]
                                        },
                                        "canonicalLabel": "Federal Reserve Communication Strategy",
                                        "isFavourited": false
                                    }
                                ]
                            },
                            "description": "BCA House Theme 4",
                            "service": {
                                "@id": "http://data.emii.com/bca/services/bcah",
                                "canonicalLabel": "BCA House"
                            },
                            "@id": "http://data.emii.com/bca/themes/bcah-theme4",
                            "impactedView": {
                                "@set": [
                                    {
                                        "viewOn": {
                                            "@id": "http://data.emii.com/economies/wld",
                                            "canonicalLabel": "Global Economy"
                                        },
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/bcah",
                                            "canonicalLabel": "BCA House"
                                        },
                                        "@id": "http://data.emii.com/bca/views/bcah-view6",
                                        "canonicalLabel": "BCAH Global Economy 6 months (2013/05/05) stronger(E)"
                                    },
                                    {
                                        "viewOn": {
                                            "@id": "http://data.emii.com/economies/gbr",
                                            "canonicalLabel": "United Kingdom Economy"
                                        },
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/bcah",
                                            "canonicalLabel": "BCA House"
                                        },
                                        "@id": "http://data.emii.com/bca/views/bcah-view7",
                                        "canonicalLabel": "BCAH United Kingdom Economy 9 months (2013/10/20) weaker(E)"
                                    }
                                ]
                            },
                            "canonicalLabel": "For the remainder of the year, the economy will limp along at a 2% pace, the euro zone recession will continue and the Chinese economy will continue to turn the corner",
                            "isFavourited": false
                        };
                      
                        element = $compile('<div theme-brick theme="theme"></div>')(scope);
                    }));

                    describe('When rendering the tile', function () {
                        it('Should render the information in the tile', function () {
                            scope.$digest();
                            expect(element.find('.box.neutral').length).toBe(1);
                            expect(element.find('.brick-title').text().trim()).toBe('For the remainder of the year, the economy will limp along at a 2% pace, the euro zone recession will continue and the Chinese economy will continue t...');
                            expect(element.find('.last-update').text().trim()).toBe('22 Jul 2013');
                            expect(element.find('.markets-count').text().trim()).toBe('5');
                            expect(element.find('.impact').text().trim()).toBe('NEUTRAL');
                            expect(element.find('.child-theme-count').text().trim()).toBe('2');
                        });

                        it('should show a favourited icon', function () {
                            scope.theme.isFavourited = true;
                            scope.$digest();
                            expect(element.find('.icon-star').length).toBe(1);
                        });
                        
                        describe('When clicking on the brick', function () {
                            beforeEach(function () {
                                $httpBackend.expectGET('/Templates/Themes/ServiceThemes.html')
                                                            .respond('');
                                scope.$digest();
                                element.trigger('click');
                            });

                            it('theme should be expanded', function () {
                                expect(scope.theme.expanded).toBe(true);
                            });
                            it('open tab should be theme', function () {
                                expect(element.isolateScope().tabs['market'].open).toBe(false);
                                expect(element.isolateScope().tabs['theme'].open).toBe(true);
                            });
                        });

                        describe('When maximizing it', function () {
                            beforeEach(function () {
                                $httpBackend.expectGET('/Templates/Themes/ServiceThemes.html')
                                                            .respond('');
                                scope.$digest();
                                element.children().find('.icon-resize-full').trigger('click');
                            });

                            it('theme should be expanded', function () {
                                expect(scope.theme.expanded).toBe(true);
                            });
                            it('open tab should be theme', function () {
                                expect(element.isolateScope().tabs['market'].open).toBe(false);
                                expect(element.isolateScope().tabs['theme'].open).toBe(true);
                            });
                        });
                        
                        describe('When opening the related markets', function () {
                            beforeEach(function () {
                                $httpBackend.expectGET('/Templates/Themes/RelatedMarkets.html')
                                                              .respond('');
                                scope.$digest();
                                element.children().find('.icon-th').trigger('click');
                                $httpBackend.flush();
                            });
                            afterEach(function () {
                                $httpBackend.verifyNoOutstandingExpectation();
                                $httpBackend.verifyNoOutstandingRequest();
                            });
                            it('open tab should be market', function () {
                                expect(element.isolateScope().tabs['market'].open).toBe(true);
                                expect(element.isolateScope().tabs['theme'].open).toBe(false);
                            });
                            
                            it('theme should be expanded', function () {
                                expect(scope.theme.expanded).toBe(true);
                            });
                            
                            it('market icon should have the class selected', function () {
                                expect(element.find('.icon-th.selected').length).toBe(1);
                            });

                            describe('And minimizing', function () {
                                beforeEach(function () {
                                    element.children().find('.icon-resize-small').trigger('click');
                                });

                                it('theme should not be expanded', function () {
                                    expect(scope.theme.expanded).toBe(false);
                                });

                                it('tabs should be closed', function() {
                                    expect(element.isolateScope().tabs.market.open).toBe(false);
                                    expect(element.isolateScope().tabs.theme.open).toBe(false);
                                });
                            });
                        });

                        describe('When opening the service themes', function () {
                            beforeEach(function () {
                                $httpBackend.expectGET('/Templates/Themes/ServiceThemes.html')
                                                              .respond('');
                                scope.$digest();
                                element.children().find('.icon-list').trigger('click');
                                $httpBackend.flush();
                            });
                            afterEach(function () {
                                $httpBackend.verifyNoOutstandingExpectation();
                                $httpBackend.verifyNoOutstandingRequest();
                            });
                            it('open tab should be theme', function () {
                                expect(element.isolateScope().tabs['market'].open).toBe(false);
                                expect(element.isolateScope().tabs['theme'].open).toBe(true);
                            });
                            it('theme should be expanded', function () {
                                expect(scope.theme.expanded).toBe(true);
                            });

                            it('theme details icon should have the class selected', function () {
                                expect(element.find('.icon-list.selected').length).toBe(1);
                            });
                            
                            describe('And minimizing', function () {
                                beforeEach(function () {
                                    element.children().find('.icon-resize-small').trigger('click');
                                });

                                it('theme should not be expanded', function () {
                                    expect(scope.theme.expanded).toBe(false);
                                });
                                
                                it('tabs should be closed', function () {
                                    expect(element.isolateScope().tabs.market.open).toBe(false);
                                    expect(element.isolateScope().tabs.theme.open).toBe(false);
                                });
                            });
                        });
                    });
                    
                    describe('When rendering the tile expanded', function () {
                        beforeEach(inject(function (_$httpBackend_) {
                            _$httpBackend_.expectGET('/Templates/Themes/ServiceThemes.html')
                                .respond('');
                            scope.theme.expanded = true;
                            scope.$digest();
                        }));
                        it('Should render the information in the tile', function () {
                            expect(element.find('.box.neutral').length).toBe(1);
                            expect(element.find('.brick-title').text().trim()).toBe('For the remainder of the year, the economy will limp along at a 2% pace, the euro zone recession will continue and the Chinese economy will continue to turn the corner');
                            expect(element.find('.last-update').text().trim()).toBe('Latest applied: 22 Jul 2013');
                            expect(element.find('.created').text().trim()).toBe('Created: 20 Jul 2013');
                            expect(element.find('.markets-count').text().trim()).toBe('5');
                            expect(element.find('.impact').text().trim()).toBe('NEUTRAL');
                            expect(element.find('.child-theme-count').text().trim()).toBe('2');
                        });

                        it('should render the description', function() {
                            expect(element.find('.description').text()).toBe('BCA House Theme 4');
                        });
                        
                        describe('When minimizing it', function () {
                            beforeEach(function () {
                                element.children().find('.icon-resize-small').trigger('click');
                            });
                            
                            it('theme should not be expanded', function () {
                                expect(scope.theme.expanded).not.toBe(true);
                            });
                        });

                    
                    });
                    
                    describe('Favouriting', function() {
                        describe('Given the theme is not favourited', function () {
                            beforeEach(function () {
                                scope.theme.isFavourited = false;
                            });

                            it('should show an unfavourited icon', function () {
                                scope.$digest();
                                expect(element.find('.icon-star-off').length).toBe(1);
                            });

                            describe('When I select the favourite star', function () {
                                it('theme should be marked favourited', function () {
                                    scope.$digest();
                                    element.find('.icon-star-off').closest('a').trigger('click');
                                    expect(scope.theme.isFavourited).toBe(true);
                                });

                                it('should call the success notifier', inject(function (Notifications) {
                                    spyOn(Notifications, 'success');
                                    scope.$digest();
                                    element.find('.icon-star-off').closest('a').trigger('click');
                                    expect(Notifications.success).toHaveBeenCalledWith('‘For the remainder of the year, the economy will limp along at a 2% pace, the euro zone recession will continue and the Chinese economy will continue to turn the corner’ has been added to your favourites.');
                                }));
                            });
                        });

                        describe('Given the theme has been favourited directly', function () {
                            beforeEach(function () {
                                scope.theme.isFavourited = true;
                                scope.theme.perspectiveId = 'someId';
                            });
                            afterEach(function() {
                                scope.theme.isFavourited = undefined;
                                scope.theme.perspectiveId = undefined;
                            });
                            it('should show a favourited icon', function () {
                                scope.$digest();
                                expect(element.find('.icon-star-on').length).toBe(1);
                            });

                            describe('When I unfavourite the theme', function () {
                                it('theme should be marked as not favourited', function () {
                                    scope.$digest();
                                    element.find('.icon-star-on').closest('a').trigger('click');
                                    expect(scope.theme.isFavourited).toBe(false);
                                });

                                it('should call the perspective endpoint', inject(function(Perspectives) {
                                    spyOn(Perspectives, 'remove').andReturn({
                                        then: function(expression) {
                                            expression(true);
                                        }
                                    });
                                    scope.$digest();
                                    element.find('.icon-star-on').closest('a').trigger('click');
                                    expect(Perspectives.remove).toHaveBeenCalledWith('someId');
                                }));
                                it('should call the success notifier', inject(function (Notifications) {
                                    spyOn(Notifications, 'success');
                                    scope.$digest();
                                    element.find('.icon-star-on').closest('a').trigger('click');
                                    expect(Notifications.success).toHaveBeenCalledWith('‘For the remainder of the year, the economy will limp along at a 2% pace, the euro zone recession will continue and the Chinese economy will continue to turn the corner’ has been removed from your favourites.');
                                }));
                            });
                        });

                        describe('Given the theme has not been favourited directly (ie. one of its child has been favourited)', function () {
                            beforeEach(function () {
                                scope.theme.isFavourited = true;
                                scope.theme.perspectiveId = undefined;
                                scope.theme.childTheme['@set'][0].isFavourited = true;
                                scope.theme.childTheme['@set'][0].perspectiveId = 'perspectiveId1';
                                scope.theme.childTheme['@set'][1].isFavourited = true;
                                scope.theme.childTheme['@set'][1].perspectiveId = 'perspectiveId2';
                            });
                            afterEach(function () {
                                scope.theme.isFavourited = undefined;
                                scope.theme.perspectiveId = undefined;
                                scope.theme.childTheme['@set'][0].isFavourited = undefined;
                                scope.theme.childTheme['@set'][0].perspectiveId = undefined;
                                scope.theme.childTheme['@set'][1].isFavourited = undefined;
                                scope.theme.childTheme['@set'][1].perspectiveId = undefined;
                            });
                            
                            describe('When I unfavourite the theme', function () {
                                it('theme should be marked as not favourited', function () {
                                    scope.$digest();
                                    element.find('.icon-star-on').closest('a').trigger('click');
                                    expect(scope.theme.isFavourited).toBe(false);
                                });

                                it('should call the perspective endpoint', inject(function (Perspectives) {
                                    spyOn(Perspectives, 'remove').andReturn({
                                        then: function (expression) {
                                            expression(true);
                                        }
                                    });
                                    scope.$digest();
                                    element.find('.icon-star-on').closest('a').trigger('click');
                                    expect(Perspectives.remove).toHaveBeenCalledWith('perspectiveId1');
                                    expect(Perspectives.remove).toHaveBeenCalledWith('perspectiveId2');
                                }));
                                it('should call the success notifier', inject(function (Notifications) {
                                    spyOn(Notifications, 'success');
                                    scope.$digest();
                                    element.find('.icon-star-on').closest('a').trigger('click');
                                    expect(Notifications.success).toHaveBeenCalledWith('‘For the remainder of the year, the economy will limp along at a 2% pace, the euro zone recession will continue and the Chinese economy will continue to turn the corner’ has been removed from your favourites.');
                                }));
                            });
                        });
                    });

                    describe('Following', function () {
                        describe('Given the theme is not followed', function () {
                            beforeEach(function () {
                                scope.theme.isFollowed = false;
                            });

                            it('should show an unfollow icon', function () {
                                scope.$digest();
                                expect(element.find('.icon-arrow-right-off').length).toBe(1);
                            });

                            describe('When I select the follow arrow', function () {
                                it('theme should be marked as following', function () {
                                    scope.$digest();
                                    element.find('.icon-arrow-right-off').closest('a').trigger('click');
                                    expect(scope.theme.isFollowed).toBe(true);
                                });

                                it('should call the success notifier', inject(function (Notifications) {
                                    spyOn(Notifications, 'success');
                                    scope.$digest();
                                    element.find('.icon-arrow-right-off').closest('a').trigger('click');
                                    expect(Notifications.success).toHaveBeenCalledWith('‘For the remainder of the year, the economy will limp along at a 2% pace, the euro zone recession will continue and the Chinese economy will continue to turn the corner’ is now being followed.');
                                }));
                            });
                        });

                        describe('Given the theme has been followed directly', function () {
                            beforeEach(function () {
                                scope.theme.isFollowed = true;
                                scope.theme.followPerspectiveId = 'someId';
                            });
                            afterEach(function () {
                                scope.theme.isFollowed = undefined;
                                scope.theme.followPerspectiveId = undefined;
                            });
                            it('should show a follow icon', function () {
                                scope.$digest();
                                expect(element.find('.icon-arrow-right-on').length).toBe(1);
                            });

                            describe('When I unfollow the theme', function () {
                                it('theme should be marked as not following', function () {
                                    scope.$digest();
                                    element.find('.icon-arrow-right-on').closest('a').trigger('click');
                                    expect(scope.theme.isFollowed).toBe(false);
                                });

                                it('should call the perspective endpoint', inject(function (Perspectives) {
                                    spyOn(Perspectives, 'remove').andReturn({
                                        then: function (expression) {
                                            expression(true);
                                        }
                                    });
                                    scope.$digest();
                                    element.find('.icon-arrow-right-on').closest('a').trigger('click');
                                    expect(Perspectives.remove).toHaveBeenCalledWith('someId');
                                }));
                                it('should call the success notifier', inject(function (Notifications) {
                                    spyOn(Notifications, 'success');
                                    scope.$digest();
                                    element.find('.icon-arrow-right-on').closest('a').trigger('click');
                                    expect(Notifications.success).toHaveBeenCalledWith('‘For the remainder of the year, the economy will limp along at a 2% pace, the euro zone recession will continue and the Chinese economy will continue to turn the corner’ is no longer being followed.');
                                }));
                            });
                        });

                        describe('Given the theme has not been followed directly (ie. one of its child has been followed)', function () {
                            beforeEach(function () {
                                scope.theme.isFollowed = true;
                                scope.theme.followPerspectiveId = undefined;
                                scope.theme.childTheme['@set'][0].isFollowed = true;
                                scope.theme.childTheme['@set'][0].followPerspectiveId = 'perspectiveId1';
                                scope.theme.childTheme['@set'][1].isFollowed = true;
                                scope.theme.childTheme['@set'][1].followPerspectiveId = 'perspectiveId2';
                            });
                            afterEach(function () {
                                scope.theme.isFollowed = undefined;
                                scope.theme.followPerspectiveId = undefined;
                                scope.theme.childTheme['@set'][0].isFollowed = undefined;
                                scope.theme.childTheme['@set'][0].followPerspectiveId = undefined;
                                scope.theme.childTheme['@set'][1].isFollowed = undefined;
                                scope.theme.childTheme['@set'][1].followPerspectiveId = undefined;
                            });

                            describe('When I folow the theme', function () {
                                it('theme should be marked as not following', function () {
                                    scope.$digest();
                                    element.find('.icon-arrow-right-on').closest('a').trigger('click');
                                    expect(scope.theme.isFollowed).toBe(false);
                                });

                                it('should call the perspective endpoint', inject(function (Perspectives) {
                                    spyOn(Perspectives, 'remove').andReturn({
                                        then: function (expression) {
                                            expression(true);
                                        }
                                    });
                                    scope.$digest();
                                    element.find('.icon-arrow-right-on').closest('a').trigger('click');
                                    expect(Perspectives.remove).toHaveBeenCalledWith('perspectiveId1');
                                    expect(Perspectives.remove).toHaveBeenCalledWith('perspectiveId2');
                                }));
                                it('should call the success notifier', inject(function (Notifications) {
                                    spyOn(Notifications, 'success');
                                    scope.$digest();
                                    element.find('.icon-arrow-right-on').closest('a').trigger('click');
                                    expect(Notifications.success).toHaveBeenCalledWith('‘For the remainder of the year, the economy will limp along at a 2% pace, the euro zone recession will continue and the Chinese economy will continue to turn the corner’ is no longer being followed.');
                                }));
                            });
                        });
                    });
                });
               
                describe('Given an orphan theme', function () {
                    beforeEach(inject(function ($rootScope, $compile) {
                        scope = $rootScope;

                        scope.theme = {
                            "@type": "Theme",
                            "lastApplied": "2013-07-22T09:00:00Z",
                            "created": "2013-07-20T09:00:00Z",
                            "description": "BCA House Theme 4",
                            "impact": "neutral",
                            "service": {
                                "@id": "http://data.emii.com/bca/services/bcah",
                                "canonicalLabel": "BCA House"
                            },
                            "@id": "http://data.emii.com/bca/themes/bcah-theme4",
                            "impactedView": {
                                "@set": [
                                    {
                                        "viewOn": {
                                            "@id": "http://data.emii.com/economies/wld",
                                            "canonicalLabel": "Global Economy"
                                        },
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/bcah",
                                            "canonicalLabel": "BCA House"
                                        },
                                        "@id": "http://data.emii.com/bca/views/bcah-view6",
                                        "canonicalLabel": "BCAH Global Economy 6 months (2013/05/05) stronger(E)"
                                    },
                                    {
                                        "viewOn": {
                                            "@id": "http://data.emii.com/economies/gbr",
                                            "canonicalLabel": "United Kingdom Economy"
                                        },
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/bcah",
                                            "canonicalLabel": "BCA House"
                                        },
                                        "@id": "http://data.emii.com/bca/views/bcah-view7",
                                        "canonicalLabel": "BCAH United Kingdom Economy 9 months (2013/10/20) weaker(E)"
                                    }
                                ]
                            },
                            "canonicalLabel": "House Theme 4",
                            "isFavourited": false
                        };
                        element = $compile('<div theme-brick theme="theme"></div>')(scope);
                    }));

                    describe('When rendering the tile', function () {
                        it('Should render the information in the tile', function () {
                            scope.$digest();
                            expect(element.find('.box.neutral').length).toBe(1);
                            expect(element.find('.brick-title').text().trim()).toBe('House Theme 4');
                            expect(element.find('.last-update').text().trim()).toBe('22 Jul 2013');
                            expect(element.find('.markets-count').text().trim()).toBe('2');
                            expect(element.find('.impact').text().trim()).toBe('NEUTRAL');
                            expect(element.find('.child-theme-count').text().trim()).toBe('0');
                        });
                    });
                    
                    describe('Favouriting', function () {
                        describe('Given the theme has been favourited', function () {
                            beforeEach(function () {
                                scope.theme.isFavourited = true;
                                scope.theme.perspectiveId = 'someId';
                            });
                            afterEach(function () {
                                scope.theme.isFavourited = undefined;
                                scope.theme.perspectiveId = undefined;
                            });
                            
                            it('should show a favourited icon', function () {
                                scope.$digest();
                                expect(element.find('.icon-star-on').length).toBe(1);
                            });

                            describe('When I unfavourite the theme', function () {
                                it('theme should be marked as not favourited', function () {
                                    scope.$digest();
                                    element.find('.icon-star-on').closest('a').trigger('click');
                                    expect(scope.theme.isFavourited).toBe(false);
                                });

                                it('should call the perspective endpoint', inject(function (Perspectives) {
                                    spyOn(Perspectives, 'remove').andReturn({
                                        then: function (expression) {
                                            expression(true);
                                        }
                                    });
                                    scope.$digest();
                                    element.find('.icon-star-on').closest('a').trigger('click');
                                    expect(Perspectives.remove).toHaveBeenCalledWith('someId');
                                }));
                                
                                it('should call the success notifier', inject(function (Notifications) {
                                    spyOn(Notifications, 'success');
                                    scope.$digest();
                                    element.find('.icon-star-on').closest('a').trigger('click');
                                    expect(Notifications.success).toHaveBeenCalledWith('‘House Theme 4’ has been removed from your favourites.');
                                }));
                            });
                        });
                       
                    });
                });
              
            });
        });


