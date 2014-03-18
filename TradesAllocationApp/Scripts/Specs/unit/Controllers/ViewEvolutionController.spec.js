define(['App/Controllers/AllViews/ViewEvolutionController',
        'angular',
        'resource',
        'mocks'
], function (ViewEvolutionController) {
    describe('ViewEvolutionController', function () {
        describe('Given we have a view evolution controller', function () {
            var controller,
                scope,
                _TILE_SIZE_CHANGING_ = '_TILE_SIZE_CHANGING_';

            beforeEach(function () {
                module('App');
            });

            beforeEach(module(function ($provide) {
                $provide.constant('_TILE_SIZE_CHANGING_', _TILE_SIZE_CHANGING_);
            }));


            describe('When updating the viewable', function () {
                beforeEach(inject(function ($rootScope, $controller, Views, Annotations) {
                    scope = $rootScope.$new();
                    
                    spyOn(Views, 'getViews')
                        .andReturn({
                            then: function (expression) {
                                return expression({
                                    '@graph': [
                                        {
                                            '@id': 'http://data.emii.com/view1',
                                            hasPermission: true
                                        },
                                        {
                                            '@id': 'http://data.emii.com/view2',
                                            hasPermission: false
                                        },
                                        {
                                            '@id': 'http://data.emii.com/view3',
                                            hasPermission: true
                                        }
                                    ]
                                });
                            }
                        });
                    
                    spyOn(Annotations, 'getAnnotations').andReturn({
                        then: function (expression) {
                            return expression({
                                'http://data.emii.com/view1': {},
                                'http://data.emii.com/view3': {}
                            });
                        }
                    });
                    controller = $controller(ViewEvolutionController, {
                        $scope: scope
                    });
                    scope.$root.$digest();
                    
                    scope.viewable = {
                        '@id': 'http://data.emii.com/viewable1'
                    };
                    
                    scope.$root.$digest();
                }));

                it('should load views evolutions for the current viewable', inject(function (Views) {
                    expect(Views.getViews).toHaveBeenCalledWith({
                        filters: {
                            uri: 'http://data.emii.com/viewable1'
                        }
                    });
                }));

                it('should only keep authorized views', function() {
                    expect(scope.viewEvolutions.views.length).toBe(2);
                });
                
                it('should fetch annotations for the authorized views', inject(function (Annotations) {
                    expect(Annotations.getAnnotations).toHaveBeenCalledWith({
                        conceptUri: ['http://data.emii.com/view1', 'http://data.emii.com/view3']
                    });
                }));
                
                describe('And changing the viewable again', function () {
                    beforeEach(function () {
                        scope.viewable = {
                            '@id': 'http://data.emii.com/viewable2'
                        };

                        scope.$root.$digest();
                    });

                    it('should clear the view evolutions for the previous viewable', function () {
                        expect(scope.viewEvolutions.views.length).toBe(2);
                    });
                });

            });
            
          

            describe('Related viewable', function () {
                beforeEach(inject(function ($rootScope, $controller) {
                    scope = $rootScope.$new();
                    scope.viewable = {
                        '@id': 'http://data.emii.com/viewable1'
                    };
                    
                    controller = $controller(ViewEvolutionController, {
                        $scope: scope
                    });
                }));
                describe('When getting suggestions', function () {
                    it('should call the suggest api', inject(function (Suggest) {
                        spyOn(Suggest, 'suggest').andCallFake(function () {
                            return {
                                then: function () {
                                }
                            };
                        });

                        scope.getSuggestedItems('America');
                        expect(Suggest.suggest).toHaveBeenCalledWith({
                            q: 'America',
                            type: 'http://data.emii.com/ontologies/bca/ViewableThing'
                        });
                    }));
                });

                describe('When selecting a related market', function () {
                    describe('and there is only one viewable loaded', function () {
                        beforeEach(inject(function (Views, Annotations) {
                            scope.autosuggest.selected = 'UK Economy';
                            spyOn(Views, 'getViews').andReturn({
                                then: function (expression) {
                                    expression({
                                        '@graph': [
                                            {
                                                '@id': 'http://data.emii.com/related-view1',
                                                hasPermission: true
                                            }
                                        ]
                                    });
                                }
                            });
                            spyOn(Annotations, 'getAnnotations').andReturn({
                                then: function (expression) {
                                    return expression({
                                        'http://data.emii.com/related-view1': {}
                                    });
                                }
                            });
                            scope.selectSuggestedItem({
                                '@id': 'http://data.emii.com/economy/uk'
                            });
                        }));
                        it('should load the view evolutions for the viewable', inject(function (Views) {
                            expect(Views.getViews).toHaveBeenCalledWith({
                                filters: {
                                    uri: 'http://data.emii.com/economy/uk'
                                }
                            });
                        }));

                        it('should set the related viewable', function () {
                            expect(scope.viewEvolutions.relatedViewable).toBeDefined();
                        });

                        it('should reset the selected suggestion', function () {
                            expect(scope.autosuggest.selected).toBe('');
                        });
                        
                        it('should load the annotations for the related viewable', inject(function (Annotations) {
                            expect(Annotations.getAnnotations).toHaveBeenCalledWith({
                                conceptUri: ['http://data.emii.com/related-view1']
                            });
                        }));
                    });
                   
                    describe('and there are more than 2 distinct viewables loaded', function () {
                        beforeEach(function () {
                            scope.viewEvolutions = {
                                views: [
                                    {
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/chn'
                                        }
                                    },
                                    {
                                        viewOn: {
                                            '@id': 'http://data.emii.com/viewable1'
                                        }
                                    }
                                ],
                                relatedViewable: {
                                    '@id': 'http://data.emii.com/economy/chn'
                                }
                            };
                        });
                        
                        it('should not load the view evolutions for the viewable', inject(function (Views) {
                            spyOn(Views, 'getViews').andReturn({
                                then: function () {
                                }
                            });
                            scope.selectSuggestedItem({
                                '@id': 'http://data.emii.com/economy/uk'
                            });
                            expect(Views.getViews).not.toHaveBeenCalled();
                        }));
                        it('should not be able to add related market', function () {
                            expect(scope.canAddRelatedMarket()).toBe(false);
                        });
                    });

                    describe('And there is no view for the selected viewable', function() {
                        it('should notify the user with the message "No views found for this market or economy."', inject(function (Views, Notifications) {
                            spyOn(Views, 'getViews').andReturn({
                                then: function (expression) {
                                    expression({
                                        '@graph': [
                                        ]
                                    });
                                }
                            });
                            spyOn(Notifications, 'info');
                            scope.selectSuggestedItem({
                                '@id': 'http://data.emii.com/economy/uk'
                            });

                            expect(Notifications.info).toHaveBeenCalledWith('No views found for this market or economy.');
                        }));
                    });
                    
                    describe('And we get an empty response for the selected viewable', function () {
                        it('should notify the user with the message "No views found for this market or economy."', inject(function (Views, Notifications) {
                            spyOn(Views, 'getViews').andReturn({
                                then: function (expression) {
                                    expression({});
                                }
                            });
                            spyOn(Notifications, 'info');
                            scope.selectSuggestedItem({
                                '@id': 'http://data.emii.com/economy/uk'
                            });

                            expect(Notifications.info).toHaveBeenCalledWith('No views found for this market or economy.');
                        }));
                    });
                    
                    describe('And there is no view with permission for the selected viewable', function () {
                        it('should notify the user with the message "Please contact your account manager to subscribe to this content."', inject(function (Views, Notifications) {
                            spyOn(Views, 'getViews').andReturn({
                                then: function (expression) {
                                    expression({
                                        '@graph': [
                                            {
                                                hasPermission: false
                                            }
                                        ]
                                    });
                                }
                            });
                            spyOn(Notifications, 'info');
                            scope.selectSuggestedItem({
                                '@id': 'http://data.emii.com/economy/uk'
                            });

                            expect(Notifications.info).toHaveBeenCalledWith('Please contact your account manager to subscribe to this content.');
                        }));
                    });
                    
                    describe('And there is more than one view for the selected viewable', function () {
                        it('should not notify the user', inject(function (Views, Notifications) {
                            spyOn(Views, 'getViews').andReturn({
                                then: function (expression) {
                                    expression({
                                        '@graph': [{
                                            hasPermission: true
                                        }]
                                    });
                                }
                            });
                            spyOn(Notifications, 'info');

                            scope.selectSuggestedItem({
                                '@id': 'http://data.emii.com/economy/uk'
                            });

                            expect(Notifications.info).not.toHaveBeenCalled();
                        }));
                    });
                });

                describe('Removing a viewable', function () {
                    beforeEach(function() {
                        scope.viewEvolutions = {
                            views: [
                                {
                                    '@id': 'http://data.emii.com/viewable1-view1',
                                    viewOn: {
                                        '@id': 'http://data.emii.com/viewable1'
                                    }
                                },
                                {
                                    '@id': 'http://data.emii.com/viewable2-view1',
                                    viewOn: {
                                        '@id': 'http://data.emii.com/viewable2'
                                    }
                                }],
                           relatedViewable: {
                               '@id': 'http://data.emii.com/viewable2'
                           }
                        };
                        
                    });
                    describe('When trying to remove the original viewable', function() {
                        it('should not remove the views for the viewable', function() {
                            expect(scope.viewEvolutions.views.length).toBe(2);
                            scope.removeViewable(scope.viewable);
                            expect(scope.viewEvolutions.views.length).toBe(2);
                        });
                    });
                    
                    describe('When trying to remove a related viewable', function () {
                        it('should remove the viewable', function () {
                            expect(scope.viewEvolutions.relatedViewable).toBeDefined();
                            scope.removeViewable({
                                '@id': 'http://data.emii.com/viewable2'
                            });
                            expect(scope.viewEvolutions.relatedViewable).not.toBeDefined();
                        });

                        it('should remove the views for the related viewable', function () {
                            expect(scope.viewEvolutions.views.length).toBe(2);
                            scope.removeViewable({
                                '@id': 'http://data.emii.com/viewable2'
                            });
                            expect(scope.viewEvolutions.views.length).toBe(1);
                        });
                    });

                });

                describe('When the chart is created', function () {
                    beforeEach(function() {
                        spyOn(scope, "$emit");
                        scope.chartCreatedCallback();
                    });
                    it('should emit a _TILE_SIZE_CHANGING_ event', function () {
                        expect(scope.$emit).toHaveBeenCalledWith(_TILE_SIZE_CHANGING_);
                    });
                });
            });
        });
    });
});