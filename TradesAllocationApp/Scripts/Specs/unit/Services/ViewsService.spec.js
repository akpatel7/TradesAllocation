define(['underscore',
        'App/Services/ViewsService',
        'angular',
        'mocks'], function(_) {
            describe('Views Service', function() {
                describe('Given we have a Views Service', function() {
                    var scope,
                        $httpBackend,
                        expectedData,
                        endpointUrl = 'http://localhost/api/views';

                    angular.module('ViewsService.spec', []).service('DataEndpoint', ['$q', function($q) {
                        return {
                            getTemplatedEndpoint: function() {
                                var deferred = $q.defer();
                                deferred.resolve(endpointUrl);
                                return deferred.promise;
                            }
                        };
                    }]);

                    beforeEach(function() {
                        module('App');
                        module('ViewsService.spec');
                    });

                    describe('When we get the views', function() {
                        beforeEach(inject(function(_$httpBackend_, $rootScope) {
                            expectedData = {
                                '@graph': [
                                ]
                            };
                            $httpBackend = _$httpBackend_;

                            $httpBackend.expectGET(endpointUrl)
                                .respond(expectedData);
                            scope = $rootScope.$new();
                        }));

                        it('views should be returned', inject(function(Views) {
                            Views.getViews().then(function (data) {
                                expect(data).toBeDefined();
                            });
                            scope.$root.$digest();
                            $httpBackend.flush();
                        }));
                    });
                    
                    describe('When we query the views endpoint', function() {
                        var args;
                        beforeEach(inject(function(DataEndpoint, $q) {
                            spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function() {
                                var deferred = $q.defer();
                                deferred.resolve({});
                                return deferred.promise;
                            });
                        }));
                        
                        it('should pass the filters to the endpoint', inject(function(DataEndpoint, Views) {
                            Views.getViews({
                                filters: {
                                    uri: 'http://data.emii.com/someUri'
                                }
                            }).then(function () {
                            });
                            scope.$root.$digest();
                            args = DataEndpoint.getTemplatedEndpoint.argsForCall[0][1];
                            expect(args[0].key).toBe('on');
                            expect(args[0].value).toBe('http://data.emii.com/someUri');
                        }));
                    });
                   
                });


            });
        });