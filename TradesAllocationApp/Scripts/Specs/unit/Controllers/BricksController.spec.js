define(['App/Controllers/BricksController',
        'underscore',
        'angular',
        'resource',
        'mocks'
], function (BricksController, _) {
    describe('BricksController', function () {
        describe('Given we have a tiles controller', function () {
            var controller,
                scope,
                fakeEndpoint,
                 _REQUEST_ENDED_ = '_REQUEST_ENDED_',
                 _TILE_SIZE_CHANGING_ = '_TILE_SIZE_CHANGING_';

            angular.module('BricksController.Spec', []).factory('Analytics', function () {
                return {
                    registerPageTrack: function () {
                    },
                    registerClick: function () {
                    },
                    logUsage: function () {
                    }
                };
            });

            beforeEach(function () {
                module('App.controllers');
                module('BricksController.Spec');
            });
            beforeEach(module(function ($provide) {
                $provide.constant('_TILE_SIZE_CHANGING_', _TILE_SIZE_CHANGING_);
                $provide.constant('_REQUEST_ENDED_', _REQUEST_ENDED_);
            }));

            beforeEach(inject(function ($rootScope, $controller, $q) {
                scope = $rootScope.$new();
                fakeEndpoint = {
                    fail: function () {
                        var deferred = $q.defer();
                        deferred.reject();
                        return deferred.promise;
                    },
                    load: function (filterOptions) {
                        var deferred = $q.defer();

                        if (filterOptions && filterOptions.page && filterOptions.page === 5) {
                            deferred.resolve({
                                totalCount: 0,
                                results: []
                            });
                        } else if (filterOptions && filterOptions.page && filterOptions.page === 4) {
                            deferred.resolve({
                                totalCount: 5,
                                results: [
                                    {
                                        '@id': 'item41'
                                    },
                                    {
                                        '@id': 'item42'
                                    },
                                    {
                                        '@id': 'item43'
                                    },
                                    {
                                        '@id': 'item44'
                                    },
                                    {
                                        '@id': 'item45'
                                    }
                                ]
                            });
                        } else {
                            deferred.resolve({
                                totalCount: 5,
                                results: [
                                    {
                                        '@id': 'item1'
                                    },
                                    {
                                        '@id': 'item2'
                                    },
                                    {
                                        '@id': 'item3'
                                    },
                                    {
                                        '@id': 'item4'
                                    },
                                    {
                                        '@id': 'item5'
                                    }
                                ]
                            });
                        }
                        return deferred.promise;
                    }
                };
                controller = $controller(BricksController, {
                    $scope: scope
                });
            }));

            describe('When loading next page', function () {
                describe('And no callback is provided', function () {
                    beforeEach(function () {
                        scope.fetchNextPageOfTiles(fakeEndpoint.load, {}, undefined, function (data) {
                            return data.results;
                        });
                        scope.$root.$digest();
                    });
                    it('should have 5 items', function () {
                        expect(scope.tiles.length).toBe(5);
                    });
                    it('last page length should be 5', function () {
                        expect(scope.lastPageLength).toBe(5);
                    });
                    it('should not be busy', function () {
                        expect(scope.busy).toBe(false);
                    });
                    it('total count should be 5', function () {
                        expect(scope.totalCount).toBe(5);
                    });

                    describe('And gets another page', function () {
                        beforeEach(function () {
                            scope.fetchNextPageOfTiles(fakeEndpoint.load, { page: 4 }, undefined, function (data) {
                                return data.results;
                            });
                            scope.$root.$digest();
                        });

                        it('should have 5 items', function () {
                            expect(scope.tiles.length).toBe(10);
                        });

                        it('total count should not change (use value from first page)', function () {
                            expect(scope.totalCount).toBe(5);
                        });

                    });
                });
                describe('And callback is provided', function () {
                    it('should fire the callback when loading the data', function () {
                        var dataReceived;
                        scope.fetchNextPageOfTiles(fakeEndpoint.load, {}, function (data) {
                            dataReceived = data;
                        }, function (data) {
                            return data.results;
                        });
                        scope.$root.$digest();
                        expect(dataReceived.results.length).toBe(5);
                    });
                });

                describe('And there is no more data to fetch', function () {
                    beforeEach(function () {
                        scope.lastPageLength = 0;
                    });
                    it('should not fetch more data', function () {
                        var moreDataFetched = false;
                        scope.fetchNextPageOfTiles(function () {
                            moreDataFetched = true;
                        });
                        expect(moreDataFetched).toBe(false);
                    });
                });
                describe('And response is empty', function () {
                    beforeEach(function () {
                        scope.fetchNextPageOfTiles(fakeEndpoint.load, { page: 0 }, undefined, function (data) {
                            return data.results;
                        });
                        scope.$root.$digest();
                        expect(scope.totalCount).toBe(5);

                        scope.fetchNextPageOfTiles(fakeEndpoint.load, { page: 4 }, undefined, function (data) {
                            return data.results;
                        });
                        scope.$root.$digest();
                    });

                    it('The total count should not be updated', function () {
                        expect(scope.totalCount).toBe(5);
                    });
                });
                describe('And response fails', function () {
                    beforeEach(function () {
                        scope.fetchNextPageOfTiles(fakeEndpoint.fail, { page: 0 }, undefined, function (data) {
                            return data.results;
                        });
                        scope.$root.$digest();
                    });

                    it('Is busy should be reset', function () {
                        expect(scope.busy).toBe(false);
                    });
                });
            });

            describe('Given we reset the data', function () {
                describe('And there is no pending request', function () {
                    beforeEach(function () {
                        scope.totalCount = 10;
                        scope.currentPage = 2;
                        scope.lastPageLength = 0;
                        scope.reset();
                    });
                    it('should reset current page to 0', function () {
                        expect(scope.currentPage).toBe(0);
                    });
                    it('should reset total count to undefined', function () {
                        expect(scope.totalCount).toBeUndefined();
                    });
                    it('should reset the lastPageLength to 1', function () {
                        expect(scope.lastPageLength).toBe(1);
                    });
                });

                describe('And there is a request in progress', function () {
                    var endpoint;
                    beforeEach(inject(function ($q) {
                        endpoint = {
                            get: function () {
                                var deferred = $q.defer();
                                deferred.resolve([
                                    {}, {}
                                ]);
                                return deferred.promise;
                            }
                        };

                        scope.fetchNextPageOfTiles(endpoint.get, {}, function (data) {
                        }, function (data) { return data; });
                      
                    }));

                    it('should have 1 request in the queue', function() {
                        expect(scope.requests.length).toBe(1);
                    });
                    
                    it('should cancel the current request', function () {
                        var canceller = scope.requests[0];
                        spyOn(canceller, 'resolve').andCallThrough();
                       
                        scope.reset();
                        
                        expect(canceller.resolve).toHaveBeenCalled();
                    });
                    
                    it('should clear the request queue', function () {
                        scope.reset();
                        expect(scope.requests.length).toBe(0);
                    });
                    
                    it('should reset the busy flag', function () {
                        expect(scope.busy).toBe(true);
                        scope.reset();
                        expect(scope.busy).toBe(false);
                    });

                });

            });

        });
    });
});