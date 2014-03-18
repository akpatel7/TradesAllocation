define(['App/Controllers/Themes/ThemesController',
        'angular',
        'resource',
        'mocks'
], function (ThemesController) {
    describe('ThemesController', function () {
        describe('Given we have a themes controller', function() {
            var controller,
                scope,
                _FILTERS_CHANGED_ = 'changed';


            beforeEach(function() {
                module('App.controllers');
            });
            
            beforeEach(module(function ($provide) {
                $provide.constant('_FILTERS_CHANGED_', _FILTERS_CHANGED_);
            }));

            describe('When fetching the next page', function () {
                var passedArgs;
                beforeEach(inject(function ($rootScope, $controller) {
                    scope = $rootScope.$new();
                    scope.loadPageOfTiles = function () {
                        passedArgs = arguments;
                    };

                    scope.fetchNextPageOfTiles = function () {
                        passedArgs = arguments;
                    };
                   
                    controller = $controller(ThemesController, {
                        $scope: scope
                    });
                    scope.currentPage = 1;
                    scope.activeFilters = {
                        custom: [
                                {
                                    key: 'favourites',
                                    isSelected: false
                                }
                        ]
                    };
                    scope.fetchNextPage();
                }));
                
                it('Should get the next page of tiles with the right parameters', function () {
                    var expectedResult = {
                        '@graph': []
                    };
                    expect(passedArgs).toBeDefined();
                    expect(typeof passedArgs[0]).toBe('function');
                    expect(passedArgs[1]).toEqual({
                        page: 1,
                        filters: {
                            custom: [
                                {
                                    key: 'favourites',
                                    isSelected: false
                                }
                            ]
                        },
                        restrictToFavourites: false
                    });
                    expect(passedArgs[2]).toBe(scope.postProcessPageOfData);
                    expect(passedArgs[3](expectedResult)).toEqual([]);
                });

            });

            describe('When post processing page of data', function () {
                beforeEach(inject(function ($rootScope, $controller) {
                    scope = $rootScope.$new();
                    
                    scope.fetchNextPageOfTiles = function () {
                    };
                    controller = $controller(ThemesController, {
                        $scope: scope
                    });
                }));

                it('should call loadDislikeCount with the array of themes', function () {
                    spyOn(scope, 'loadDislikeCount').andCallThrough();
                    scope.postProcessPageOfData({
                        '@graph': []
                    });
                    expect(scope.loadDislikeCount).toHaveBeenCalledWith([]);
                });
               
                it('should call loadLikeCount with the array of themes', function () {
                    spyOn(scope, 'loadLikeCount').andCallThrough();
                    scope.postProcessPageOfData({
                        '@graph': []
                    });
                    expect(scope.loadLikeCount).toHaveBeenCalledWith([]);
                });
            });            

            describe('When loading like counts for themes', function () {
                var themes = [
                    {
                        '@id': 'http://data.emii.com/theme1'
                    },
                    {
                        '@id': 'http://data.emii.com/theme2'
                    },
                    {
                        '@id': 'http://data.emii.com/theme3'
                    }
                ];
                
                beforeEach(inject(function ($rootScope, $controller, Like) {
                    scope = $rootScope.$new();
                    spyOn(Like, 'getAggregatedLikeCount').andReturn({
                        then: function(expression) {
                            expression({
                                'theme1': 3,
                                'theme2': 4,
                                'theme3': 5
                            });
                        }
                    });
                    scope.fetchNextPageOfTiles = function () {
                    };
                    controller = $controller(ThemesController, {
                        $scope: scope
                    });
                }));
                
                it('should call the Like service with the right parameters', inject(function (Like) {
                    scope.loadLikeCount(themes);
                    expect(Like.getAggregatedLikeCount).toHaveBeenCalledWith('theme', ['theme1', 'theme2', 'theme3']);
                }));
                
                it('should extend the theme with a likeCount property', function () {
                    scope.loadLikeCount(themes);
                    expect(themes[0].likeCount).toBe(3);
                    expect(themes[1].likeCount).toBe(4);
                    expect(themes[2].likeCount).toBe(5);
                });
            });
            
            describe('When loading dislike counts for themes', function () {
                var themes = [
                    {
                        '@id': 'http://data.emii.com/theme1'
                    },
                    {
                        '@id': 'http://data.emii.com/theme2'
                    },
                    {
                        '@id': 'http://data.emii.com/theme3'
                    }
                ];
                beforeEach(inject(function ($rootScope, $controller, Like) {
                    scope = $rootScope.$new();
                    spyOn(Like, 'getAggregatedDislikeCount').andReturn({
                        then: function (expression) {
                            expression({
                                'theme1': 3,
                                'theme2': 4,
                                'theme3': 5
                            });
                        }
                    });
                    scope.fetchNextPageOfTiles = function () {
                    };
                    controller = $controller(ThemesController, {
                        $scope: scope
                    });
                }));

                it('should call the Like service with the right parameters', inject(function (Like) {
                    scope.loadDislikeCount(themes);
                    expect(Like.getAggregatedDislikeCount).toHaveBeenCalledWith('theme', ['theme1', 'theme2', 'theme3']);
                }));
                it('should extend the theme with a likeCount property', function () {
                    scope.loadDislikeCount(themes);
                    expect(themes[0].dislikeCount).toBe(3);
                    expect(themes[1].dislikeCount).toBe(4);
                    expect(themes[2].dislikeCount).toBe(5);
                });
            });
            
            describe('When applying filters', function () {
                var passedArgs,
                    resetCalled,
                    filters;

                beforeEach(inject(function () {
                    filters = {
                        someFilter: {}
                    };
                    scope.fetchNextPageOfTiles = function() {
                        passedArgs = arguments;
                    };
                    scope.reset = function() {
                        resetCalled = true;
                    };
                    scope.currentPage = 0;
                    scope.pageSize = 10;
                    scope.$root.$broadcast(_FILTERS_CHANGED_, filters);
                    scope.$root.$digest();
                }));

                it('Should get the next page of tiles with the right parameters', function () {
                    var expectedResult = {
                        '@graph': []
                    };
                    
                    expect(passedArgs).toBeDefined();
                    expect(typeof passedArgs[0]).toBe('function');
                    expect(passedArgs[1].page).toBe(0);
                    expect(passedArgs[1].pageSize).toBe(scope.pageSize);
                    expect(passedArgs[1].filters.someFilter).toBeDefined();
                    expect(typeof passedArgs[2]).toBe('function');
                    expect(passedArgs[3](expectedResult)).toEqual([]);
                });
           

            });
            
            describe('When loading the favourites page for the first time', function () {
                var passedArgs;
                beforeEach(inject(function ($rootScope, $controller) {
                    scope = $rootScope.$new();
                    scope.loadPageOfTiles = function () {
                        passedArgs = arguments;
                    };

                    scope.fetchNextPageOfTiles = function () {
                        passedArgs = arguments;
                    };

                    controller = $controller(ThemesController, {
                        $scope: scope
                    });
                    scope.currentPage = 1;
                    scope.restrictToFavourites = true;
                    scope.fetchNextPage();
                }));

                it('Should load the favourited themes', function () {
                    var expectedResult = {
                        '@graph': []
                    };
                    expect(passedArgs).toBeDefined();
                    expect(typeof passedArgs[0]).toBe('function');
                    expect(passedArgs[1]).toEqual({
                        page: 1,
                        filters: {
                            custom: [
                                {
                                    key: 'favourites',
                                    isSelected: true
                                }
                            ]
                        },
                        restrictToFavourites: true
                    });
                    expect(passedArgs[2]).toBe(scope.postProcessPageOfData);
                    expect(passedArgs[3](expectedResult)).toEqual([]);
                });

            });
        });
    });
});