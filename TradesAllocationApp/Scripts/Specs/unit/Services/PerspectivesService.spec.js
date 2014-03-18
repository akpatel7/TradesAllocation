define(['underscore',
        'angular',
        'mocks',
        'App/Services/services'], function (_) {
            describe('PerspectivesService', function () {
                describe('Given we have a Perspectives Service', function () {
                    var scope,
                        $httpBackend,
                        perspectiveData,
                        id = 'someid',
                        endpointUrl = 'http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/users/current/saved',
                        templatedEndpointUrl = 'http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/sometemplatedurlwithidonend/' + id;

                    angular.module('PerspectivesService.spec', []).service('DataEndpoint', ['$q', function ($q) {
                        return {
                            internaliseApiUrl: function (url) {
                                return url;
                            },
                            externaliseApiUrl: function (url) {
                                return url;
                            },
                            getEndpoint: function () {
                                var deferred = $q.defer();
                                deferred.resolve(endpointUrl);
                                return deferred.promise;
                            },
                            getTemplatedEndpoint: function () {
                                var deferred = $q.defer();
                                deferred.resolve(templatedEndpointUrl);
                                return deferred.promise;
                            }
                        };
                    }]);

                    beforeEach(function () {
                        module('App');
                        module('PerspectivesService.spec');
                    });

                    beforeEach(function () {
                        this.addMatchers({
                            toEqualData: function (expected) {
                                return angular.equals(this.actual, expected);
                            }
                        });
                    });
                    
                    describe('When we post a Viewable Perspective to the API', function () {                        
                        beforeEach(inject(function (_$httpBackend_, $rootScope) {
                            perspectiveData = {
                                'viewable-perspective': {
                                    'link': {
                                        '_rel': 'viewable',
                                        '_href': 'http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/sometemplatedurlwithidonend/' + id
                                    },
                                    'container-type': 'bookmark',
                                    'related-resource-type': 'viewable'
                                }
                            };
                            $httpBackend = _$httpBackend_;
                            scope = $rootScope.$new();
                        }));

                        describe('When favouriting a viewable', function () {
                            beforeEach(function () {
                                $httpBackend.expectPOST('http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/users/current/saved', perspectiveData)
                                      .respond(function () {
                                          return [201, {}, { Location: 'http://someuri/withid' }];
                                      });
                            });
                            
                            it('Should return the perspective id', inject(function (Perspectives) {
                                Perspectives.post(perspectiveData).then(function (response) {
                                    expect(response).toBe('withid');
                                });
                                
                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                        });

                        describe('When removing a viewable from favourites', function() {
                            beforeEach(function () {
                                $httpBackend.expectGET('http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/sometemplatedurlwithidonend/' + id)
                                     .respond(function () {
                                         return [278, {}, { Location: 'http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/someotherurl/' + id }];
                                     });
                                
                                $httpBackend.expectDELETE('http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/someotherurl/' + id)
                                      .respond(204);
                            });
                            
                            it('Should return true', inject(function (Perspectives) {
                                Perspectives.remove(id).then(function (response) {
                                    expect(response).toBe(true);
                                });

                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                        });
                    });
                    
                    describe('When we post a View Perspective to the API', function () {
                        beforeEach(inject(function (_$httpBackend_, $rootScope) {
                            perspectiveData = {
                                'view-perspective': {
                                    'link': {
                                        '_rel': 'view',
                                        '_href': 'http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/sometemplatedurlwithidonend/' + id
                                    },
                                    'container-type': 'bookmark',
                                    'related-resource-type': 'view'
                                }
                            };
                            $httpBackend = _$httpBackend_;
                            scope = $rootScope.$new();
                        }));

                        describe('When favouriting a view', function () {
                            beforeEach(function () {
                                $httpBackend.expectPOST('http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/users/current/saved', perspectiveData)
                                      .respond(function () {
                                          return [201, {}, { Location: 'http://someuri/withid' }];
                                      });
                            });

                            it('Should return the perspective id', inject(function (Perspectives) {
                                Perspectives.post(perspectiveData).then(function (response) {
                                    expect(response).toBe('withid');
                                });

                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                        });

                        describe('When removing a view from favourites', function () {
                            beforeEach(function () {
                                $httpBackend.expectGET('http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/sometemplatedurlwithidonend/' + id)
                                     .respond(function () {
                                         return [278, {}, { Location: 'http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/someotherurl/' + id }];
                                     });

                                $httpBackend.expectDELETE('http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/someotherurl/' + id)
                                      .respond(204);
                            });

                            it('Should return true', inject(function (Perspectives) {
                                Perspectives.remove(id).then(function (response) {
                                    expect(response).toBe(true);
                                });

                                scope.$root.$digest();
                                $httpBackend.flush();
                            }));
                        });
                    });
                });
            });
        });