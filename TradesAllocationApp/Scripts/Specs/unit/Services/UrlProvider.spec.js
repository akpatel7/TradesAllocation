define(['underscore',
        'App/Services/UrlProvider',
        'angular',
        'mocks'], function (_) {
            describe('UrlProvider', function () {
                describe('Given we have a Url Provider', function () {
                    var documentId = 'documentId',
                        endpointUrl = 'http://isisapi.com/documents/' + documentId;

                    angular.module('UrlProvider.spec', []).service('DataEndpoint', ['$q', function($q) {
                        return {
                            getTemplatedEndpoint: function() {
                                var deferred = $q.defer();
                                deferred.resolve(endpointUrl);
                                return deferred.promise;
                            }
                        };
                    }]).service('authorisationService', function() {
                         return {
                            getCookieValue: function() {
                            },
                            isAuthorised: function () {
                            },
                            setAuthorisationHeader: function() {
                            },
                            getAuthorisationToken: function () {
                                return 'YXV0aFRva2Vu';
                            }
                        };
                    })
                    .value('config', {
                        reportsBaseUrl: 'http://livereport/',
                        banBaseUrl: 'http://ban'
                    });

                    beforeEach(function () {
                        module('App');
                        module('UrlProvider.spec');
                    });
                    
                    describe('When we get the report url', function () {
                        // YXV0aFRva2Vu is the Base64 version of authToken
                        it('Should return "http://isisapi.com/documents/documentId/pdf?auth=YXV0aFRva2Vu&consumerid=gbgnwk1g310y"', inject(function ($rootScope, UrlProvider) {
                            UrlProvider.getReportUrl(documentId)
                                .then(function(result) {
                                    expect(result).toBe('http://isisapi.com/documents/documentId/pdf?auth=YXV0aFRva2Vu&consumerid=gbgnwk1g310y');
                                });
                            $rootScope.$digest();
                        }));
                    });
                    
                    describe('When extracting the document id from a uri', function () {
                        it('Should return the document id', inject(function (UrlProvider) {
                            var result = UrlProvider._extractDocumentId('urn:document:documentId');
                            expect(result).toBe('documentId');
                        }));
                    });

                    describe('When extracting the document id from a http url', function () {
                        it('Should return the document id', inject(function (UrlProvider) {
                            var result = UrlProvider._extractDocumentId('http://tempuri.org/path/documentId');
                            expect(result).toBe('documentId');
                        }));
                    });

                    describe('When we get the live report url', function () {
                        it('Should return "http://livereport/documentId"', inject(function (UrlProvider) {
                            var result = UrlProvider.getLiveReportUrl('urn:document:documentId');
                            expect(result).toBe('http://livereport/#/reports/documentId');
                        }));
                    });

                    describe('When we get the ban chart url', function () {
                        it('Should return "http://ban/charts/chartId"', inject(function (UrlProvider) {
                            var result = UrlProvider.getBanUrl('chartId');
                            expect(result).toBe('http://ban/charts/chartId');
                        }));
                    });

                    describe('When we get view history export to excel url', function () {
                        beforeEach(inject(function ($q, DataEndpoint) {
                            DataEndpoint.getTemplatedEndpoint = function() {
                                var deferred = $q.defer();
                                deferred.resolve('http://tempuri.org/');
                                return deferred.promise;
                            };
                            spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallThrough();
                        }));
                        it('Should call correct templated end-point when fecthing excel export url for all views', inject(function (UrlProvider, DataEndpoint) {
                            var viewableId = "viewable1", recommendationType = ["recommendationType1"],
                                categories = [{ service: 'service1', viewRelativeTo: 'benchmark1' }];
                            var result = UrlProvider.getViewHistoryExcelExportUrl(viewableId, recommendationType, categories, true);
                            expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith('views', [
                                { key: 'on', value: viewableId },
                                { key: 'includeAnnotations', value: true },
                                { key: 'recommendationType', value: recommendationType },
                                { key: 'format', value: 'xlsx' },
                                { key: 'categories', value: categories, complex: true },
                                { key: 'includeEvolvedViews', value: true },
                                { key: 'defaultViewRecommendationType', value: true }
                            ]);
                        }));
                        
                        it('Should call correct templated end-point when fecthing excel export url for active views only', inject(function (UrlProvider, DataEndpoint) {
                            var viewableId = "viewable1", recommendationType = ["recommendationType1"],
                                categories = [{ service: 'service1', viewRelativeTo: 'benchmark1' }];
                            var result = UrlProvider.getViewHistoryExcelExportUrl(viewableId, recommendationType, categories, false);
                            expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith('views', [
                                { key: 'on', value: viewableId },
                                { key: 'includeAnnotations', value: true },
                                { key: 'recommendationType', value: recommendationType },
                                { key: 'format', value: 'xlsx' },
                                { key: 'categories', value: categories, complex: true },
                                { key: 'includeEvolvedViews', value: false },
                                { key: 'defaultViewRecommendationType', value: true }
                            ]);
                        }));
                    });
                    
                    describe('When we get the chart image url', function () {
                        // YXV0aFRva2Vu is the Base64 version of authToken
                        it('Should return "http://isisapi.com/charts/chartId/pdf?auth=YXV0aFRva2Vu&consumerid=gbgnwk1g310y"', inject(function ($rootScope, UrlProvider) {
                            UrlProvider.getChartImageUrl(documentId)
                                .then(function (result) {
                                    expect(result).toBe('http://isisapi.com/documents/documentId/image?auth=YXV0aFRva2Vu&consumerid=gbgnwk1g310y');
                                });
                            $rootScope.$digest();
                        }));
                    });
                    
                    describe('When we get the document image url', function () {
                        // YXV0aFRva2Vu is the Base64 version of authToken
                        it('Should return "http://isisapi.com/documents/documentId/thumb?auth=YXV0aFRva2Vu&consumerid=gbgnwk1g310y"', inject(function ($rootScope, UrlProvider) {
                            UrlProvider.getDocumentImageUrl(documentId)
                                .then(function (result) {
                                    expect(result).toBe('http://isisapi.com/documents/documentId/thumb?auth=YXV0aFRva2Vu&consumerid=gbgnwk1g310y');
                                });
                            $rootScope.$digest();
                        }));
                    });

                    describe('When we get the trades export url', function() {
                        it('Should return the URL with all required query string params including auth token and consumer id', inject(function(UrlProvider) {
                            var params = {
                                '$orderby': 'LastUpdated desc',
                                '$filter': 'some_field eq 1',
                                '$expand': 'TradeLines',
                                'showFavouritesOnly': true,
                                'showFollowsOnly': true                                
                            }, baseUrl = 'http://someapi/bca/Trades', columns = ['service_code', 'length_type_label', 'structure_type_label'];

                            expect(UrlProvider.getTradesExportUrl(baseUrl, params, columns)).toBe('http://someapi/bca/Trades?%24orderby=LastUpdated+desc&%24filter=some_field+eq+1&%24expand=TradeLines&showFavouritesOnly=true&showFollowsOnly=true&export=true&auth=YXV0aFRva2Vu&consumerid=gbgnwk1g310y&columns=service_code,length_type_label,structure_type_label');
                        }));
                    });
                });
            });
        });