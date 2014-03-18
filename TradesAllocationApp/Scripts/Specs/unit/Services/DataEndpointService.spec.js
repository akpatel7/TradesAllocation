define([
        'underscore',
        'App/Services/DataEndpointService',
        'angular',
        'mocks',
        'App/Services/services'
], function (_) {
    describe('DataEndpointService', function () {
        describe('Given we have a DataEndpointService', function () {
            var $httpBackend,
                isisResponse,
                usersResponse;

            angular.module('DataEndpointService.Spec', []).service('config', function () {
                return {
                    isisRootApi: 'http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api',
                    clientServicePath: 'http://localhost.com/api'
                };
            });

            beforeEach(function () {
                module('App.services');
                module('DataEndpointService.Spec');
            });

            describe('When traversing api', function () {

                beforeEach(inject(function (_$httpBackend_) {
                    isisResponse = {
                        "application": {
                            "identifierNamespaces": {
                                "namespace": [
                                    {
                                        "_description": "BCA Research",
                                        "_prefix": "bca"
                                    },
                                    {
                                        "_description": "Euroweek",
                                        "_prefix": "ewk"
                                    }
                                ]
                            },
                            "link": [
                                {
                                    "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/charts",
                                    "_rel": "charts"
                                },
                                {
                                    "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/datasets",
                                    "_rel": "datasets"
                                },
                                {
                                    "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/users",
                                    "_rel": "users"
                                },
                                {
                                    "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/documents",
                                    "_rel": "documents"
                                },
                                {
                                    "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/views",
                                    "_href_template": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/views?service={serviceUri}",
                                    "_rel": "views"
                                },
                                {
                                    "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/themes",
                                    "_rel": "themes"
                                },
                                {
                                    "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/resource-groups",
                                    "_rel": "resource-groups"
                                },
                                {
                                    "_href_template": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/groups/{id}/members",
                                    "_rel": "group-members"
                                },
                                {
                                    "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/images",
                                    "_rel": "images"
                                },
                                {
                                    "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/docs",
                                    "_rel": "api-documentation"
                                },
                                {
                                    "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/house-views",
                                    "_rel": "house-views"
                                },
                                {
                                    "_href_template": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/viewables/{id}{?service*,page}",
                                    "_rel": "viewables"
                                }
                            ]
                        }
                    };

                    usersResponse = {
                        "users-resources": {
                            "link": [
                                {
                                    "_href_template": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/users/{userId}",
                                    "_rel": "user"
                                },
                                {
                                    "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/users/bulk",
                                    "_rel": "bulk"
                                },
                                {
                                    "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/users/current",
                                    "_rel": "current-user"
                                },
                                {
                                    "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/users/current/saved",
                                    "_rel": "saved"
                                },
                                {
                                    "_href": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/users/current/annotations",
                                    "_rel": "annotations"
                                }
                            ]
                        }
                    };

                    $httpBackend = _$httpBackend_;
                    $httpBackend.expectGET('http://localhost.com/api\\')
                        .respond(isisResponse);

                }));

                describe('When we want to retrieve the endpoint url for house-views', function () {
                    it('should return "http://localhost.com/api/house-views"', inject(function (DataEndpoint) {
                        DataEndpoint.getEndpoint('house-views')
                            .then(function (result) {
                                expect(result).toBe('http://localhost.com/api/house-views');
                            });

                        // http needs to be flushed, otherwise the promise wont be resolved, and the test wont be executed
                        $httpBackend.flush();
                    }));
                });
                
                describe('When we want to retrieve the endpoint url for views', function () {
                    it('should return "http://localhost.com/api/views"', inject(function (DataEndpoint) {
                        DataEndpoint.getEndpoint('views')
                            .then(function (result) {
                                expect(result).toBe('http://localhost.com/api/views');
                            });

                        // http needs to be flushed, otherwise the promise wont be resolved, and the test wont be executed
                        $httpBackend.flush();
                    }));
                });

                describe('When we want to retrieve the templated endpoint url for views', function () {
                    it('should return "http://localhost.com/api/views?service=http://some.service/uri"', inject(function (DataEndpoint) {
                        DataEndpoint.getTemplatedEndpoint('views', [{ key: 'serviceUri', value: 'http://some.service/uri' }])
                            .then(function (result) {
                                expect(result).toBe('http://localhost.com/api/views?service=' + encodeURIComponent('http://some.service/uri'));
                            });

                        // http needs to be flushed, otherwise the promise wont be resolved, and the test wont be executed
                        $httpBackend.flush();
                    }));

                    it('should return "http://localhost.com/api/views?service="', inject(function (DataEndpoint) {
                        DataEndpoint.getTemplatedEndpoint('views', [{ key: 'serviceUri', value: undefined }])
                            .then(function (result) {
                                expect(result).toBe('http://localhost.com/api/views?service=');
                            });

                        // http needs to be flushed, otherwise the promise wont be resolved, and the test wont be executed
                        $httpBackend.flush();
                    }));

                    it('should accept objects for parameters, because arrays of objects are a bit weird', inject(function (DataEndpoint) {
                        DataEndpoint.getTemplatedEndpoint('views', { serviceUri: 'xyz' })
                            .then(function (result) {
                                expect(result).toBe('http://localhost.com/api/views?service=xyz');
                            });

                        // http needs to be flushed, otherwise the promise wont be resolved, and the test wont be executed
                        $httpBackend.flush();
                    }));

                    it('should throw an exception if no params is passed', inject(function (DataEndpoint) {
                        try {
                            DataEndpoint.getTemplatedEndpoint('views');
                        } catch (e) {
                            expect(e.name).toBe('Invalid params');
                            expect(e.message).toBe('Params must be an array of key/value pairs');
                        }
                    }));
                });

                describe('Retrieving an endpoint multiple times', function () {
                    describe('Given we have retrieved the endpoint once', function () {
                        describe('When retrieving the endpoint a second time', function () {
                            it('Should be cached, and no round trip to the server should be made', inject(function (DataEndpoint) {
                                DataEndpoint.getEndpoint('house-views');
                                $httpBackend.flush();
                                DataEndpoint.getEndpoint('house-views');
                                $httpBackend.verifyNoOutstandingRequest();
                            }));
                        });
                    });

                    describe('Given we have retrieved a templated endpoint once', function () {
                        describe('When retrieving the endpoint a second time', function () {
                            it('Should be cached, and no round trip to the server should be made', inject(function (DataEndpoint) {
                                DataEndpoint.getTemplatedEndpoint('views', [{ key: '{serviceUri}', value: 'http://some.service/uri' }]);
                                $httpBackend.flush();
                                DataEndpoint.getTemplatedEndpoint('views', [{ key: '{serviceUri}', value: 'http://some.service/uri' }]);
                                $httpBackend.verifyNoOutstandingRequest();
                            }));
                        });
                    });
                });

                describe('When traversing the API to get a templated endpoint that includes query string parameters', function () {
                    it('Should parse the templated endpoint correctly', inject(function (DataEndpoint) {
                        DataEndpoint.getTemplatedEndpoint('viewables', [
                            { key: 'service', value: ['item1', 'item2'] },
                            { key: 'page', value: 1 },
                            { key: 'id', value: 22 }
                        ]).then(function (result) {
                            expect(result).toBe('http://localhost.com/api/viewables/22?service=item1&service=item2&page=1');
                        });
                        $httpBackend.flush();
                    }));
                });

                describe('When traversing the API to get a templated endpoint that includes complex query string parameters', function () {
                    it('Should index the query parameters so complex objects can be deserialized on the server', inject(function (DataEndpoint) {
                        DataEndpoint.getTemplatedEndpoint('viewables', [
                            { key: 'service', value: [{ id: 'id1', val: 'val1' }, { id: 'id2', val: 'val2' }], complex: true },
                            { key: 'page', value: 1 },
                            { key: 'id', value: 22 }
                        ]).then(function (result) {
                            expect(result).toBe('http://localhost.com/api/viewables/22?service%5B0%5D.id=id1&service%5B0%5D.val=val1&service%5B1%5D.id=id2&service%5B1%5D.val=val2&page=1');
                        });
                        $httpBackend.flush();
                    }));
                });

                describe('When traversing the API to get a templated endpoint that does not include query string parameters', function () {
                    it('Should ignore extra arguments', inject(function (DataEndpoint) {
                        DataEndpoint.getTemplatedEndpoint('group-members', [
                            { key: 'page', value: 1 },
                            { key: 'id', value: 22 }
                        ]).then(function (result) {
                            expect(result).toBe('http://localhost.com/api/groups/22/members');
                        });
                        $httpBackend.flush();
                    }));
                });
                
                describe('When traversing the API to get to the users endpoint', function () {
                    beforeEach(inject(function (_$httpBackend_) {
                        $httpBackend = _$httpBackend_;
                        $httpBackend.expectGET('http://localhost.com/api/users')
                            .respond(usersResponse);
                    }));

                    afterEach(function () {
                        $httpBackend.verifyNoOutstandingRequest();
                    });

                    it('Retrieving the "saved" relation should return http://localhost.com/api/users/current/saved', inject(function (DataEndpoint) {
                        DataEndpoint.getEndpoint(['users', 'saved'])
                            .then(function (result) {
                                expect(result).toBe('http://localhost.com/api/users/current/saved');
                            });

                        // http needs to be flushed, otherwise the promise wont be resolved, and the test wont be executed
                        $httpBackend.flush();
                    }));

                    describe('When retrieving the "user" relation passing userId "rohit.modi" ', function() {
                        it('should return http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/users/rohit.modi', inject(function (DataEndpoint) {
                            DataEndpoint.getTemplatedEndpoint(['users', 'user'], [{ key: 'userId', value: 'rohit.modi' }])
                                .then(function (result) {
                                    expect(result).toBe('http://localhost.com/api/users/rohit.modi');
                                });

                            // http needs to be flushed, otherwise the promise wont be resolved, and the test wont be executed
                            $httpBackend.flush();
                        }));
                    });

                    describe('When retrieving the templated endpoint multiple times', function () {
                        it('the endpoint result should be cached', inject(function (DataEndpoint) {
                            DataEndpoint.getTemplatedEndpoint(['users', 'user'], [{ key: 'userId', value: 'rohit.modi' }])
                               .then(function (result) {
                                   expect(result).toBe('http://localhost.com/api/users/rohit.modi');
                               });
                            
                            $httpBackend.flush();
                            DataEndpoint.getTemplatedEndpoint(['users', 'user'], [{ key: 'userId', value: 'rohit.modi' }])
                             .then(function (result) {
                                 expect(result).toBe('http://localhost.com/api/users/rohit.modi');
                             });

                            $httpBackend.verifyNoOutstandingRequest();
                        }));
                    });
                });
            });

            describe('When internalising URL', function () {
                var apiRoots = ['http://isis-staging.euromoney.internal', 'https://staging156.dashboard.bcaresearch.com/isis', 'http://isis.delphidev.euromoneydigital.com', 'http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api', 'https://dashboard.bcaresearch.com/isis'];
                var apiPaths = [
                    '', '/', '/users', '/house-views?date=2013-08-01&service=http://data.emii.com/bca/services/bcah',
                    '/views?uri=http://isis-staging.euromoney.internal/bcah',
                    '/views?uri=https://staging156.dashboard.bcaresearch.com/isis',
                    '?a', '?a=77', '?uri=https://staging156.dashboard.bcaresearch.com/isis'
                ];

                it('should translate external URL to internal', inject(function (DataEndpoint) {
                    _.each(apiRoots, function (apiRoot) {
                        _.each(apiPaths, function (apiPath) {
                            expect(DataEndpoint.internaliseApiUrl(apiRoot + apiPath)).toBe('http://localhost.com/api' + apiPath);
                        });
                    });
                }));

                it('should translate internal URL to external', inject(function (DataEndpoint) {
                    _.each(apiRoots, function (apiRoot) {
                        _.each(apiPaths, function (apiPath) {
                            expect(DataEndpoint.externaliseApiUrl(apiRoot + apiPath)).toBe('http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api' + apiPath);
                        });
                    });
                }));
            });

            describe('When following Endpoint', function () {
                var permalinkUri = 'http://localhost.com/api/some/redirect',
                    resourceUri = 'http://localhost.com/api/user/654',
                    resourceUriExternal = 'http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/user/654';

                describe('When followEndpoint() called on resource uri', function() {
                    beforeEach(inject(function(_$httpBackend_) {
                        $httpBackend = _$httpBackend_;

                        $httpBackend.expectGET(resourceUri)
                            .respond({ data: 'uniqueData' });
                    }));

                    it('should return data', inject(function(DataEndpoint) {
                        DataEndpoint.followEndpoint(resourceUri)
                            .then(function(data) {
                                expect(data.data).toBe('uniqueData');
                            });
                        $httpBackend.flush();
                    }));
                });

                describe('When followEndpoint() called on permalink resource', function () {
                    beforeEach(inject(function (_$httpBackend_) {
                        $httpBackend = _$httpBackend_;

                        $httpBackend.expectGET(permalinkUri)
                            .respond(null, { 'Location': resourceUriExternal });
                        
                        $httpBackend.expectGET(resourceUri)
                            .respond({ data: 'uniqueData' });
                    }));

                    it('should follow redirect and return data', inject(function (DataEndpoint) {
                        DataEndpoint.followEndpoint(permalinkUri)
                        .then(function (data) {
                            expect(data.data).toBe('uniqueData');
                        });

                        $httpBackend.flush();
                    }));
                });
            });
        });
    });
});