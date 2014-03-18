define(['App/Controllers/Trades/TradeHistoryController',
    'underscore',
    'angular',
    'mocks',
    'App/Services/services',
    'App/Controllers/controllers'
], function(TradeHistoryController, _) {
    describe('TradeHistoryController', function() {
        var scope, endpointUrl, tradeLine, fakeData;

        function buildQueryString(skip, take) {
            var filterPart = '$filter=trade_id+eq+' + tradeLine.trade.trade_id;
            var orderbyPart = '$orderby=date+desc';
            var skipPart = '$skip=' + skip;
            var countPart = "$inlinecount=allpages";
            var topPart = '$top=' + take;
            var queryString = "?" + filterPart + "&" + countPart + "&" + orderbyPart + "&" + skipPart + "&" + topPart;
            return queryString;
        }

        beforeEach(function() {
            module('App.services');
            module('App.controllers');
        });

        beforeEach(inject(function(DataEndpoint, $q) {

            spyOn(DataEndpoint, 'getEndpoint').andCallFake(function(endpointName) {
                var deferred = $q.defer();
                switch (endpointName) {
                case 'trade-history':
                    deferred.resolve(endpointUrl);
                    break;
                default:
                    throw 'unexpected endpoint';
                }
                return deferred.promise;
            });

            endpointUrl = 'http://someapi/tradeHistory';

            tradeLine = { trade: { "trade_id": 1 } };
            
            fakeData = {
                "odata.count": "6",
                "value": [{
                    "date": "2013-11-10T12:28:33.677",
                    "status": "blah",
                    "instructions_type": "type",
                    "instructions_comments": "comments",
                    "interest_rate": "i rate",
                    "mark_to_market_rate": "mtm rate",
                    "spot": "a spot",
                    "carry": "a carry",
                    "absolute_performance_value": "a value",
                    "absolute_performance_type": "a type",
                    "relative_performance_value": "r value",
                    "relative_performance_type": "r type",
                    "return_performance_benchmark": "bench"
                }, {
                    "date": "2013-11-11T12:28:33.677",
                    "status": "blah2",
                    "instructions_type": "type2",
                    "instructions_comments": "comments2",
                    "interest_rate": "i rate2",
                    "mark_to_market_rate": "mtm rate2",
                    "spot": "a spot2",
                    "carry": "a carry2",
                    "absolute_performance_value": "a value2",
                    "absolute_performance_type": "a type2",
                    "relative_performance_value": "r value2",
                    "relative_performance_type": "r type2",
                    "return_performance_benchmark": "bench2"
                }, {
                    "date": "2013-11-12T12:28:33.677",
                    "status": "blah3",
                    "instructions_type": "type3",
                    "instructions_comments": "comments3",
                    "interest_rate": "i rate3",
                    "mark_to_market_rate": "mtm rate3",
                    "spot": "a spo3t",
                    "carry": "a carry3",
                    "absolute_performance_value": "a value3",
                    "absolute_performance_type": "a type3",
                    "relative_performance_value": "r value3",
                    "relative_performance_type": "r type3",
                    "return_performance_benchmark": "bench3"
                }]
            };
        }));

        describe('Given a TradeHistoryController', function() {

            beforeEach(inject(function($rootScope, $controller) {
                scope = $rootScope.$new();
                $controller(TradeHistoryController, {
                    $scope: scope
                });
            }));

            it('trade object should not have history data', function () {
                expect(tradeLine.tradeHistory).not.toBeDefined();
            });

            describe('When we fetch first page', function() {
                beforeEach(inject(function (_$httpBackend_) {
                    _$httpBackend_.expectGET(endpointUrl + buildQueryString(0, 5)).respond(fakeData);
                    scope.init(tradeLine);
                    
                    scope.$root.$digest();
                    _$httpBackend_.flush();
                }));
                
                it('Should display a page of history data', function () {
                    expect(scope.tradeHistory.data).toEqual(fakeData.value);
                });
                
                it('Should extend trade object with history data', function () {
                    expect(tradeLine.tradeHistory).toBeDefined();
                });
                
                describe('When fetch next page', function () {
                    beforeEach(inject(function ($q, DataEndpoint, _$httpBackend_) {
                        var url = endpointUrl + buildQueryString(3, 10);
                        _$httpBackend_.expectGET(url).respond(fakeData);

                        scope.fetchNextPage();
                        scope.$root.$digest();
                        _$httpBackend_.flush();
                    }));
                    
                    it('Should load extra data', function () {
                        expect(scope.tradeHistory.data.length).toBe(6);
                    });
                    
                    describe('While more data cannot be taken', function () {
                        beforeEach(function () {
                            scope.fetchNextPage();
                        });
                        it('Should not load extra data', inject(function (_$httpBackend_) {
                            _$httpBackend_.verifyNoOutstandingExpectation();
                            expect(scope.isLoading).toBe(false);
                        }));
                    });
                });
            });
            
            describe('When data is already loaded', function () {
                beforeEach(inject(function () {
                    tradeLine.tradeHistory = { data: [] };
                    scope.init(tradeLine);
                }));

                it('Should user existing data and no http calls made', inject(function (_$httpBackend_) {
                    _$httpBackend_.verifyNoOutstandingExpectation();
                    expect(scope.isLoading).toBe(false);
                    expect(scope.tradeHistory.data).toEqual([]);
                }));
            });
        });
    });
});