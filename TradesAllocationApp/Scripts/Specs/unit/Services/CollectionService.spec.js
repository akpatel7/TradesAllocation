define(['underscore',
        'App/Services/CollectionService',
        'angular',
        'mocks'], function(_) {
            describe('Collection Service', function () {
                describe('Given we have a Collection Service', function () {
                    var scope,
                        $httpBackend,
                        endpointUrl = 'http://localhost/api/collection';

                   
                    beforeEach(function() {
                        module('App');
                    });

                    describe('When we query the collection endpoint', function() {
                        var args;
                        beforeEach(inject(function (DataEndpoint, $q, $rootScope, _$httpBackend_) {
                            spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function() {
                                var deferred = $q.defer();
                                deferred.resolve(endpointUrl);
                                return deferred.promise;
                            });
                            $httpBackend = _$httpBackend_;

                            $httpBackend.expectGET(endpointUrl)
                                .respond({});
                            scope = $rootScope.$new();
                        }));

                        describe('And optional parameters are missing', function() {
                            it('should pass default parameters to the endpoint', inject(function(DataEndpoint, Collection) {
                                Collection.get({}).then(function() {
                                });
                                scope.$root.$digest();
                                args = DataEndpoint.getTemplatedEndpoint.argsForCall[0][1];
                                expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith('collection', [
                                        { key: 'type', value: '' },
                                        { key: 'joining-predicate', value: '' },
                                        { key: 'joining-resource', value: '' },
                                        { key: 'limit', value: 50 }
                                    ]
                                );
                            }));
                        });
                        
                        it('should pass parameters to the endpoint', inject(function (DataEndpoint, Collection) {
                            Collection.get({
                                type: 'http://data.emii.com/ontologies/location/Region',
                                limit: 100
                            }).then(function () {
                            });
                            scope.$root.$digest();
                            args = DataEndpoint.getTemplatedEndpoint.argsForCall[0][1];
                            expect(args[0].key).toBe('type');
                            expect(args[0].value).toBe('http://data.emii.com/ontologies/location/Region');
                            expect(args[3].key).toBe('limit');
                            expect(args[3].value).toBe(100);
                        }));
                    });
                   
                });


            });
        });