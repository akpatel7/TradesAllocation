define(['underscore',
    'App/Services/LookupDataService',
    'angular',
    'mocks',
    'App/Services/services'
], function(_) {
    describe('LookupDataService', function() {
        describe('Given a LookupDataService', function() {
            var $httpBackend,
                expectedData,
                endpointUrl = 'http://localhost/api/trade-lookup-data';

            expectedData ={
                value: [
                    {
                        "id": "5",
                        "field": "benchmark_label",
                        "value": "S&P 500",
                        "trade_id": 1
                    }, {
                        "id": "44",
                        "field": "instruction_type_label",
                        "value": "Sell stop",
                        "trade_id": 1
                    },
                     {
                         "id": "6",
                         "field": "benchmark_label",
                         "value": "S&P 500",
                         "trade_id": 2
                     }
                ]
            };

            beforeEach(function() {
                module('App.services');
            });

            describe('When we query the service', function () {
                beforeEach(inject(function($q, DataEndpoint, _$httpBackend_) {
                    spyOn(DataEndpoint, 'getEndpoint').andCallFake(function(url) {
                        var deferred = $q.defer();
                        deferred.resolve(endpointUrl);
                        return deferred.promise;
                    });
                    $httpBackend = _$httpBackend_;
                    $httpBackend.expectGET(endpointUrl).respond(expectedData);
                }));
         

                it('should return deduplicated data', inject(function (LookupData) {
                    LookupData.getData()
                        .then(function(data) {
                            expect(data.benchmark_label.length).toBe(1);
                            expect(data.benchmark_label[0].name).toBe('S&P 500');
                        });
                    $httpBackend.flush();
                }));

            });
        });
    });

});