define(['App/Controllers/Trades/TradeReportsController',
        'underscore',
        'angular',
        'mocks',
        'App/Services/services',
        'App/Controllers/controllers'
], function (TradeReportsController, _) {
    describe('TradesReportsController', function () {
        var scope, annotations, groupedItems, groupedItemsWithUrls;

        beforeEach(function () {
            module('App.services');
            module('App.controllers');
        });

        beforeEach(function() {
            annotations = [
                {
                    "references": {
                        "@id": "http://data.emii/trade/1"
                    },
                    "@type": "Annotation",
                    "annotationText": "Annotation to support some content 3",
                    "annotationFor": {
                        "title": "GIS Agricultural Products Doc",
                        "lastModified": "2013-11-19T16:10:54.1344234+00:00",
                        "@type": "Document",
                        "publishedIn": {
                            "@type": "Service",
                            "@id": "http://data.emii.com/bca/services/gis",
                            "canonicalLabel": "Global Investment Strategy"
                        },
                        "@id": "http://content.emii.com/documents/bca.gis_sr_2013_11_01_2",
                        "published": "2013-11-01T00:00:00+00:00"
                    },
                    "@id": "http://content.emii.com/documents/bca.gis_sr_2013_11_01_2#1",
                    "annotatedAs": {
                        "@id": "http://data.emii.com/annotation-types/support"
                    },
                    "hasPermission": true
                },
                {
                    "references": {
                        "@id": "http://data.emii/trade/1"
                    },
                    "@type": "Annotation",
                    "annotationText": "Annotation to support some content 2",
                    "annotationFor": {
                        "title": "GIS Agricultural Products Doc 1.1",
                        "lastModified": "2013-11-19T16:10:54.1339233+00:00",
                        "@type": "Document",
                        "publishedIn": {
                            "@type": "Service",
                            "@id": "http://data.emii.com/bca/services/gis",
                            "canonicalLabel": "Global Investment Strategy"
                        },
                        "@id": "http://content.emii.com/documents/bca.gis_sr_2013_09_01_2",
                        "published": "2013-09-01T00:00:00+01:00"
                    },
                    "@id": "http://content.emii.com/documents/bca.gis_sr_2013_09_01_2#1",
                    "annotatedAs": {
                        "@id": "http://data.emii.com/annotation-types/counter-argument"
                    },
                    "hasPermission": true
                },
                {
                    "references": {
                        "@id": "http://data.emii/trade/1"
                    },
                    "@type": "Annotation",
                    "annotationText": "Annotation to support some content 1",
                    "annotationFor": {
                        "title": "GIS Agricultural Products Doc 1",
                        "lastModified": "2013-11-19T16:10:54.1339233+00:00",
                        "@type": "Document",
                        "publishedIn": {
                            "@type": "Service",
                            "@id": "http://data.emii.com/bca/services/gis",
                            "canonicalLabel": "Global Investment Strategy"
                        },
                        "@id": "http://content.emii.com/documents/bca.gis_sr_2013_10_20_2",
                        "published": "2013-10-20T00:00:00+01:00"
                    },
                    "@id": "http://content.emii.com/documents/bca.gis_sr_2013_10_20_2#1",
                    "annotatedAs": {
                        "@id": "http://data.emii.com/annotation-types/mention"
                    },
                    "hasPermission": true
                },
                {
                    "references": {
                        "@id": "http://data.emii/trade/1"
                    },
                    "@type": "Annotation",
                    "annotationText": "Annotation to support some content 1",
                    "annotationFor": {
                        "title": "GIS Agricultural Products Doc 1",
                        "lastModified": "2013-11-19T16:10:54.1339233+00:00",
                        "@type": "Document",
                        "publishedIn": {
                            "@type": "Service",
                            "@id": "http://data.emii.com/bca/services/gis",
                            "canonicalLabel": "Global Investment Strategy"
                        },
                        "@id": "http://content.emii.com/documents/bca.gis_sr_2013_10_20_2",
                        "published": "2013-10-20T00:00:00+01:00"
                    },
                    "@id": "http://content.emii.com/documents/bca.gis_sr_2013_10_20_2#1",
                    "annotatedAs": {
                        "@id": "http://data.emii.com/annotation-types/scenario"
                    },
                    "hasPermission": true
                }
            ];

            groupedItems = [
                {
                    key: 'http://data.emii.com/annotation-types/support',
                    label: 'Supports',
                    title: 'Supporting Research',
                    index: 0,
                    values: [annotations[0]]
                },
                {
                    key: 'http://data.emii.com/annotation-types/counter-argument',
                    label: 'Counters',
                    title: 'Counter Views',
                    index: 1,
                    values: [annotations[1]]
                },
                {
                    key: 'http://data.emii.com/annotation-types/scenario',
                    label: 'Scenarios',
                    title: 'Scenarios',
                    index: 2,
                    values: [annotations[2]]
                },
                {
                    key: 'http://data.emii.com/annotation-types/mention',
                    label: 'Mentions',
                    title: 'Mentions',
                    index: 3,
                    values: [annotations[3]]
                }];
        });

        describe('Given a TradeReportsController', function() {

            beforeEach(inject(function ($q, $rootScope, $controller, Annotations, DataEndpoint, authorisationService, UrlProvider) {
                scope = $rootScope.$new();

                spyOn(Annotations, 'getAnnotations').andCallFake(function() {
                    var deferred = $q.defer();
                    deferred.resolve(groupedItems);
                    return deferred.promise;
                });

                spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function() {
                    var deferred = $q.defer();
                    deferred.resolve('http://someapi/somedocumentpdfuri');
                    return deferred.promise;
                });

                spyOn(authorisationService, 'getAuthorisationToken').andReturn('SOME AUTH TOKEN');

                spyOn(UrlProvider, 'getLiveReportUrl').andCallFake(function(id) {
                    return 'http://livereports/#/reports/' + UrlProvider._extractDocumentId(id);
                });

                $controller(TradeReportsController, {
                    $scope: scope
                });
            }));            

            describe('When we want to see reports related to a particular trade', function () {
                var trade;
                
                beforeEach(inject(function () {
                    trade = {
                        trade: {
                            'trade_uri': 'http://sometradeuri'
                        },
                        isInformationOpen: true
                    };
                    
                    scope.init(trade);
                    scope.$root.$digest();
                }));

                it('Should retrieve all reports with annotations related to the trade', inject(function(Annotations) {
                    expect(scope.tradeReports.reports['support'].length).toBe(1);
                    expect(scope.tradeReports.reports['counter-argument'].length).toBe(1);
                    expect(scope.tradeReports.reports['scenario'].length).toBe(1);
                    expect(scope.tradeReports.reports['mention'].length).toBe(1);
                    expect(Annotations.getAnnotations).toHaveBeenCalledWith({
                        conceptUri: trade.trade.trade_uri
                    });
                }));
            });
        });
    });
});

