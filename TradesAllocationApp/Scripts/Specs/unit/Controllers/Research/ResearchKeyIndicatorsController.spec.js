define(['App/Controllers/Research/ResearchKeyIndicatorsController',
        'underscore',
        'moment',
        'angular',
        'resource',
        'mocks',
        'App/Controllers/controllers'], function (ResearchKeyIndicatorsController) {
           describe('Research Key Indicators Controller', function () {
                describe('Given we have a research key indicators controller', function () {
                    var controller,
                        scope;

                    var viewable = {
                        '@id': 'http://data.emii.com/commodities-markets/gold'
                    };
                    beforeEach(function () {
                        module('App');
                    });

                    beforeEach(inject(function ($rootScope, $controller, KeyIndicators, $q) {
                        var data = {
                            totalCount: 4,
                            indicators: [
                                    {
                                        link: {
                                            _href: '/charts/chart1',
                                            _rel: 'chart'
                                        },
                                        name: 'BCA U.S. SPECULATION INDEX',
                                        published: "/Date(-62135596800000)/",
                                        value: '1.4396',
                                        trend: '-0.056',
                                        viewable: {
                                            service: [
                                                {
                                                    _resource: 'http://data.emii.com/bca/services/ces'
                                                },
                                                {
                                                    _resource: 'http://data.emii.com/bca/services/usis'
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        link: {
                                            _href: '/charts/chart2',
                                            _rel: 'chart'
                                        },
                                        name: 'U.S. S&#38;P 500',
                                        published: "/Date(-62135596800000)/",
                                        value: '1786',
                                        trend: '24.81',
                                        viewable: {
                                            service: [{
                                                    _resource: 'http://data.emii.com/bca/services/ces'
                                                }]
                                        }
                                    }
                            ]
                        };
                        scope = $rootScope.$new();
                        
                        scope.$parent.viewable = viewable;
                        spyOn(KeyIndicators, 'get').andReturn({
                            then: function(expression) {
                                return expression(data);
                            }
                        });
                        var fakeUrlProvider = {
                            getBanUrl: function (chartId) {
                                return 'http://banUrl/chart/' + chartId;
                            },
                            getChartImageUrl: function (chartId) {
                                var deferred = $q.defer();
                                deferred.resolve('http://localhost/chart/' + chartId + '/image');
                                return deferred.promise;
                            }
                        };

                        controller = $controller(ResearchKeyIndicatorsController, {
                            $scope: scope,
                            UrlProvider: fakeUrlProvider
                        });
                        scope.pageSize = 2;
                        scope.$root.$digest();
                    }));

                    it('should fetch the first page of indicators for the viewable', inject(function(KeyIndicators) {
                        expect(KeyIndicators.get).toHaveBeenCalledWith({
                            viewable: 'http://data.emii.com/commodities-markets/gold',
                            page: 1,
                            pageSize: scope.pageSize
                        });
                    }));

                    it('should load the indicators', function() {
                        expect(scope.indicators.length).toBe(2);
                    });

                    it('total count should be 4', function () {
                        expect(scope.totalCount).toBe(4);
                    });

                    it('indicators should have the ban url', function() {
                        expect(scope.indicators[0].banUrl).toBe('http://banUrl/chart/chart1');
                        expect(scope.indicators[1].banUrl).toBe('http://banUrl/chart/chart2');
                    });
                    
                    it('indicators should have the chart image url', function () {
                        expect(scope.indicators[0].image).toBe('http://localhost/chart/chart1/image');
                        expect(scope.indicators[1].image).toBe('http://localhost/chart/chart2/image');
                    });
                    
                    describe('When showing more', function() {
                        beforeEach(function () {
                            expect(scope.indicators.length).toBe(2);
                            scope.showMore();
                        });
                        it('should fetch another page of data', inject(function(KeyIndicators) {
                            expect(KeyIndicators.get).toHaveBeenCalledWith({
                                viewable: 'http://data.emii.com/commodities-markets/gold',
                                page: 2,
                                pageSize: scope.pageSize
                            });
                        }));
                        it('should add a new page of data', function() {
                            expect(scope.indicators.length).toBe(4);
                        });
                        
                        describe('When showing more again', function () {
                            beforeEach(inject(function (KeyIndicators) {
                                KeyIndicators.get.reset();
                                expect(scope.indicators.length).toBe(4);
                                expect(scope.totalCount).toBe(4);
                                scope.showMore();
                            }));
                            it('should not try to fetch another page of data', inject(function (KeyIndicators) {
                                expect(KeyIndicators.get).not.toHaveBeenCalled();
                            }));
                          
                        });
                    });
                });
            });
        });

