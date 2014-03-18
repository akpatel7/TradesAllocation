define(['App/Controllers/Research/ResearchPublicationsController',
        'underscore',
        'moment',
        'angular',
        'resource',
        'mocks',
        'App/Controllers/controllers'], function (ResearchPublicationsController) {
            describe('Research Publications Controller', function () {
                describe('Given we have a research publications controller', function () {
                    var controller,
                        scope,
                        fakeAnnotationsService,
                        fakeUrlProvider;
                    var annotations = [
                    {
                        "annotationText": "Scenario for gold 3",
                        "annotationFor": {
                            "title": "Document on gold 3",
                            "lastModified": "2013-08-03",
                            "@type": "Content",
                            "publishedIn": {
                                "@type": "Service",
                                "@id": "http://data.emii.com/bca/services/gis",
                                "canonicalLabel": "Global Investment Strategy"
                            },
                            "@id": "urn:document:doc_04",
                            "published": "2013-07-03"
                        },
                        "@id": "urn:annotation:doc_04.4",
                        "annotatedAs": {
                            "@id": "http://data.emii.com/annotation-types/scenario"
                        },
                        "hasPermission": true
                    },
                    {
                        "annotationText": "Scenario for gold 2",
                        "annotationFor": {
                            "title": "Document to support GIS view 2 on Gold",
                            "lastModified": "2013-08-02",
                            "@type": "Content",
                            "publishedIn": {
                                "@type": "Service",
                                "@id": "http://data.emii.com/bca/services/gis",
                                "canonicalLabel": "Global Investment Strategy"
                            },
                            "@id": "urn:document:doc_03",
                            "published": "2013-08-02"
                        },
                        "@id": "urn:annotation:doc_03.4",
                        "annotatedAs": {
                            "@id": "http://data.emii.com/annotation-types/scenario"
                        },
                        "hasPermission": false
                    }
                    ];
                    beforeEach(function () {
                        module('App');
                    });

                    beforeEach(inject(function ($rootScope, $controller, $q) {

                        fakeAnnotationsService = {
                            getAnnotations: function () {
                                var deferred = $q.defer();
                                deferred.resolve(annotations);
                                return deferred.promise;
                            }
                        };

                        fakeUrlProvider = {
                            getReportUrl: function (uri) {
                                var deferred = $q.defer();
                                deferred.resolve("http://tempuru.org/" + uri);
                                return deferred.promise;
                            },
                            getDocumentImageUrl: function (uri) {
                                var deferred = $q.defer();
                                deferred.resolve("http://tempuru.org/" + uri + "/thumb");
                                return deferred.promise;
                            },
                            getLiveReportUrl: function (uri) {
                            return "http://tempuru.org/live/" + uri;
                        }
                    };
                        spyOn(fakeAnnotationsService, 'getAnnotations').andCallThrough();
                        spyOn(fakeUrlProvider, 'getReportUrl').andCallThrough();
                        spyOn(fakeUrlProvider, 'getLiveReportUrl').andCallThrough();
                        scope = $rootScope.$new();

                        controller = $controller(ResearchPublicationsController, {
                            $scope: scope,
                            Annotations: fakeAnnotationsService,
                            UrlProvider: fakeUrlProvider
                        });
                    }));

                    describe('When the viewable is set should load associated documents', function () {
                        it("Should load the documents for the viewable", inject(function ($rootScope) {
                            scope.viewable = { 'activeView': { '@set': [{ '@id': 'http://some/view/id' }] } };
                            scope.pageSize = 2;
                            $rootScope.$digest();
                            expect(fakeAnnotationsService.getAnnotations).toHaveBeenCalledWith({
                                conceptUri: ['http://some/view/id'],
                                noGrouping: true
                            });
                            expect(fakeUrlProvider.getReportUrl).toHaveBeenCalled();
                            expect(fakeUrlProvider.getReportUrl.calls.length).toEqual(2);
                            expect(fakeUrlProvider.getLiveReportUrl).toHaveBeenCalled();
                            expect(fakeUrlProvider.getLiveReportUrl.calls.length).toEqual(2);
                            expect(scope.documents.length).toBe(2);

                            // no permission for urn:document:doc_04
                            expect(scope.documents[0]['@id']).toBe("urn:document:doc_03");
                            expect(scope.documents[0]['snippet']).toBeFalsy();
                            expect(scope.documents[0]['published']).toBe("2013-08-02");
                            expect(scope.documents[0]['reportUrl']).toBe("http://tempuru.org/urn:document:doc_03");
                            expect(scope.documents[0]['reportImageUrl']).toBeFalsy();
                            expect(scope.documents[0]['liveReportUrl']).toBe("http://tempuru.org/live/urn:document:doc_03");
                            
                            // has permission for urn:document:doc_04
                            expect(scope.documents[1]['@id']).toBe("urn:document:doc_04");
                            expect(scope.documents[1]['snippet']).toBe("Scenario for gold 3");
                            expect(scope.documents[1]['published']).toBe("2013-07-03");
                            expect(scope.documents[1]['reportUrl']).toBe("http://tempuru.org/urn:document:doc_04");
                            expect(scope.documents[1]['reportImageUrl']).toBe("http://tempuru.org/urn:document:doc_04/thumb");
                            expect(scope.documents[1]['liveReportUrl']).toBe("http://tempuru.org/live/urn:document:doc_04");
                        }));
                    });

                    describe('When I do not want see publications I am not authorized to see', function () {
                        it("Should display only the documents I have permission for", inject(function ($rootScope) {
                            scope.viewable = { 'activeView': { '@set': [{ '@id': 'http://some/view/id' }] } };
                            scope.pageSize = 2;
                            scope.showAuthorisedContentOnly = true;
                            $rootScope.$digest();

                            expect(scope.documents.length).toBe(1);
                            expect(scope.documents[0]['@id']).toBe("urn:document:doc_04");
                         }));
                    });

                    describe('When I want to see more documents', function () {
                        it("Should display more documents when I click on the show more button", inject(function ($rootScope) {
                            scope.viewable = { 'activeView': { '@set': [{ '@id': 'http://some/view/id' }] } };
                            scope.pageSize = 1;
                            $rootScope.$digest();
                            expect(scope.documents.length).toBe(1);

                            scope.showMore();
                            $rootScope.$digest();
                            expect(scope.documents.length).toBe(2);
                        }));
                    });
                });
            });
        });