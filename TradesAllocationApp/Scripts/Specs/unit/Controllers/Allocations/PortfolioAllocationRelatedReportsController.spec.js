define(['App/Controllers/Allocations/PortfolioAllocationRelatedReportsController',
        'angular',
        'resource',
        'mocks',
        'route',
        'App/Controllers/controllers'
], function (PortfolioAllocationRelatedReportsController) {
    describe('PortfolioAllocationRelatedReportsController', function () {
        describe('Given we create the controller', function () {
            var controller,
                scope,
                listener,
                _TREE_GRID_RESIZE_INFO_ = 'tree-grid:resize-info',
                data = [{ "key": "http://data.emii.com/annotation-types/support", "label": "Supports", "title": "Supporting Research", "index": 0, "values": [{ "references": { "@id": "http://data.emii.com/bca/portfolio/cis-low-risk-porfolio" }, "@type": "Annotation", "annotationText": "Annotation to support some portfolio 3", "annotationFor": { "title": "CIS Agricultural Products Doc", "lastModified": "2014-02-18T17:32:33.0412611+00:00", "@type": "Document", "publishedIn": { "@type": "Service", "@id": "http://data.emii.com/bca/services/cis", "canonicalLabel": "China Investment Strategy" }, "@id": "http://content.emii.com/documents/bca.gis_sr_2013_11_01_2", "published": "2013-11-01T00:00:00+00:00" }, "@id": "http://content.emii.com/documents/bca.gis_sr_2013_11_01_2#1", "annotatedAs": { "@id": "http://data.emii.com/annotation-types/support" }, "hasPermission": true }, { "references": { "@id": "http://data.emii.com/bca/portfolio/cis-low-risk-porfolio" }, "@type": "Annotation", "annotationText": "Annotation to support some portfolio 2", "annotationFor": { "title": "CIS Agricultural Products Doc 1.1", "lastModified": "2014-02-18T17:32:33.041761+00:00", "@type": "Document", "publishedIn": { "@type": "Service", "@id": "http://data.emii.com/bca/services/cis", "canonicalLabel": "China Investment Strategy" }, "@id": "http://content.emii.com/documents/bca.gis_sr_2013_09_01_2", "published": "2013-09-01T00:00:00+01:00" }, "@id": "http://content.emii.com/documents/bca.gis_sr_2013_09_01_2#1", "annotatedAs": { "@id": "http://data.emii.com/annotation-types/support" }, "hasPermission": true }, { "references": { "@id": "http://data.emii.com/bca/portfolio/cis-low-risk-porfolio" }, "@type": "Annotation", "annotationText": "Annotation to support some portfolio 1", "annotationFor": { "title": "CIS Agricultural Products Doc 1", "lastModified": "2014-02-18T17:32:33.0412611+00:00", "@type": "Document", "publishedIn": { "@type": "Service", "@id": "http://data.emii.com/bca/services/cis", "canonicalLabel": "China Investment Strategy" }, "@id": "http://content.emii.com/documents/bca.gis_sr_2013_10_20_2", "published": "2013-10-20T00:00:00+01:00" }, "@id": "http://content.emii.com/documents/bca.gis_sr_2013_10_20_2#1", "annotatedAs": { "@id": "http://data.emii.com/annotation-types/support" }, "hasPermission": true }] }, { "key": "http://data.emii.com/annotation-types/counter-argument", "label": "Counters", "title": "Counter Views", "index": 1, "values": [] }, { "key": "http://data.emii.com/annotation-types/scenario", "label": "Scenarios", "title": "Scenarios", "index": 2, "values": [] }, { "key": "http://data.emii.com/annotation-types/mention", "label": "Mentions", "title": "Mentions", "index": 3, "values": [] }];


            beforeEach(module('App.controllers'));

            beforeEach(inject(function (Annotations) {
                spyOn(Annotations, 'getAnnotations').andReturn({
                    then: function (expression) {
                        return expression(data);
                    }
                });
            }));

            describe('When we view related reports for a Portfolio or Allocation', function () {
                beforeEach(inject(function ($controller, $rootScope) {
                    scope = $rootScope.$new();
                    scope.item = {
                        uri: 'http://data.emii.com/bca/allocation/cis-low-risk-porfolio'
                    };
                    scope.row = {
                        id: 'p-1'
                    };

                    listener = jasmine.createSpy('listener');
                    scope.$on(_TREE_GRID_RESIZE_INFO_, listener);
                    
                    controller = $controller(PortfolioAllocationRelatedReportsController, { $scope: scope });
                    scope.$root.$digest();
                }));

                it('Should attach the annotations data to the scope', function() {
                    expect(scope.annotations).toEqual(data);
                });
                
                it('Should tell the TreeGrid to resize the more info section containing the related reports', function () {
                    expect(listener).toHaveBeenCalled();
                });
            });
        });
    });
});