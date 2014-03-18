define(['App/Controllers/Allocations/PortfolioAllocationCommentsController',
        'underscore',
        'angular',
        'mocks',
        'App/Services/services',
        'App/Controllers/controllers'
], function (PortfolioAllocationCommentsController, _) {
    describe('PortfolioAllocationCommentsController', function () {
        var scope, trade, $httpBackend, commentsPage1, commentsPage2, listener, _TREE_GRID_RESIZE_INFO_ = 'tree-grid:resize-info';

        beforeEach(function () {
            module('App.services');
            module('App.controllers');
        });

        beforeEach(function() {
            trade = {
                trade: {
                    trade_id: 3
                }
            };

            commentsPage1 = {
                "odata.metadata": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/bca/$metadata#PortfolioComments",
                "odata.count": "15",
                "value": [
                    {
                        "Id": 1,
                        "Text": "Some comment for Model Low Risk Portfolio 1",
                        "CreatedOn": "2014-02-25T09:40:44.883",
                        "Portfolio_Id": 1,
                        "Allocation_Id": null,
                        "Service_Id": 5
                    }, {
                        "Id": 2,
                        "Text": "Some comment for Model Low Risk Portfolio 2",
                        "CreatedOn": "2014-02-25T09:40:44.883",
                        "Portfolio_Id": 1,
                        "Allocation_Id": null,
                        "Service_Id": 5
                    }, {
                        "Id": 3,
                        "Text": "Some comment for Model Low Risk Portfolio 3",
                        "CreatedOn": "2014-02-25T09:40:44.883",
                        "Portfolio_Id": 1,
                        "Allocation_Id": null,
                        "Service_Id": 5
                    }, {
                        "Id": 4,
                        "Text": "Some comment for Model Low Risk Portfolio 4",
                        "CreatedOn": "2014-02-25T09:40:44.883",
                        "Portfolio_Id": 1,
                        "Allocation_Id": null,
                        "Service_Id": 5
                    }, {
                        "Id": 5,
                        "Text": "Some comment for Model Low Risk Portfolio 5",
                        "CreatedOn": "2014-02-25T09:40:44.883",
                        "Portfolio_Id": 1,
                        "Allocation_Id": null,
                        "Service_Id": 5
                    }
                ]
            };

            commentsPage2 = {
                "odata.metadata": "http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/bca/$metadata#PortfolioComments",
                "odata.count": "15",
                "value": [
                    {
                        "Id": 6,
                        "Text": "Some comment for Model Low Risk Portfolio 6",
                        "CreatedOn": "2014-02-25T09:40:44.883",
                        "Portfolio_Id": 1,
                        "Allocation_Id": null,
                        "Service_Id": 5
                    }, {
                        "Id": 7,
                        "Text": "Some comment for Model Low Risk Portfolio 7",
                        "CreatedOn": "2014-02-25T09:40:44.883",
                        "Portfolio_Id": 1,
                        "Allocation_Id": null,
                        "Service_Id": 5
                    }, {
                        "Id": 8,
                        "Text": "Some comment for Model Low Risk Portfolio 8",
                        "CreatedOn": "2014-02-25T09:40:44.883",
                        "Portfolio_Id": 1,
                        "Allocation_Id": null,
                        "Service_Id": 5
                    }, {
                        "Id": 9,
                        "Text": "Some comment for Model Low Risk Portfolio 9",
                        "CreatedOn": "2014-02-25T09:40:44.883",
                        "Portfolio_Id": 1,
                        "Allocation_Id": null,
                        "Service_Id": 5
                    }, {
                        "Id": 10,
                        "Text": "Some comment for Model Low Risk Portfolio 10",
                        "CreatedOn": "2014-02-22T09:40:44.883",
                        "Portfolio_Id": 1,
                        "Allocation_Id": null,
                        "Service_Id": 5
                    }, {
                        "Id": 11,
                        "Text": "Some comment for Model Low Risk Portfolio 11",
                        "CreatedOn": "2014-02-22T09:40:44.883",
                        "Portfolio_Id": 1,
                        "Allocation_Id": null,
                        "Service_Id": 5
                    }, {
                        "Id": 12,
                        "Text": "Some comment for Model Low Risk Portfolio 12",
                        "CreatedOn": "2014-02-22T09:40:44.883",
                        "Portfolio_Id": 1,
                        "Allocation_Id": null,
                        "Service_Id": 5
                    }, {
                        "Id": 13,
                        "Text": "Some comment for Model Low Risk Portfolio 13",
                        "CreatedOn": "2014-02-22T09:40:44.883",
                        "Portfolio_Id": 1,
                        "Allocation_Id": null,
                        "Service_Id": 5
                    }, {
                        "Id": 14,
                        "Text": "Some comment for Model Low Risk Portfolio 14",
                        "CreatedOn": "2014-02-22T09:40:44.883",
                        "Portfolio_Id": 1,
                        "Allocation_Id": null,
                        "Service_Id": 5
                    }, {
                        "Id": 15,
                        "Text": "Some comment for Model Low Risk Portfolio 15",
                        "CreatedOn": "2014-02-22T09:40:44.883",
                        "Portfolio_Id": 1,
                        "Allocation_Id": null,
                        "Service_Id": 5
                    }
                ]
            };
        });

        describe('Given a PortfolioAllocationCommentsController', function () {
            
            beforeEach(inject(function ($q, DataEndpoint, Dates, _$httpBackend_, $rootScope) {
                $httpBackend = _$httpBackend_;
                spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function() {
                    var deferred = $q.defer();
                    deferred.resolve('http://someapi/bca/PortfolioComments');
                    return deferred.promise;
                });
                
                scope = $rootScope.$new();
                
                listener = jasmine.createSpy('listener');
                scope.$on(_TREE_GRID_RESIZE_INFO_, listener);
            }));

            describe('When we want to see comments related to a Portfolio', function () {
                beforeEach(inject(function ($controller) {
                    $httpBackend.expectGET('http://someapi/bca/PortfolioComments?$filter=Portfolio_Id+eq+1&$inlinecount=allpages&$orderby=CreatedOn+desc&$skip=0&$top=5').respond(commentsPage1);

                    scope.item = {
                        id: 1,
                        isPortfolio: true
                    };
                    scope.row = {
                        id: 'p-1'  
                    };

                    $controller(PortfolioAllocationCommentsController, {
                        $scope: scope
                    });

                    $httpBackend.flush();
                }));
                
                describe('And we fetch the first page', function() {                    
                    it('Should display the first page of comments', inject(function(DataEndpoint) {
                        expect(scope.comments).toEqual(commentsPage1.value);
                        expect(scope.totalItems).toBe(parseInt(commentsPage1['odata.count'], 10));
                        expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith(['bca-trades', 'portfolio-comments']);
                    }));

                    it('Should tell the TreeGrid to resize the more info section containing the comments', function() {
                        expect(listener).toHaveBeenCalled();
                    });

                    describe('And we fetch the second page', function() {
                        beforeEach(function() {
                            $httpBackend.expectGET('http://someapi/bca/PortfolioComments?$filter=Portfolio_Id+eq+1&$inlinecount=allpages&$orderby=CreatedOn+desc&$skip=5&$top=15').respond(commentsPage2);
                            scope.showMore();
                            $httpBackend.flush();
                        });

                        it('Should display the second page of comments', inject(function(DataEndpoint) {
                            expect(scope.comments).toEqual(_.union(commentsPage1.value, commentsPage2.value));
                            expect(scope.totalItems).toBe(parseInt(commentsPage2['odata.count'], 10));
                            expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith(['bca-trades', 'portfolio-comments']);
                        }));
                    });
                });
            });
            
            describe('When we want to see comments related to a Allocation', function () {
                beforeEach(inject(function ($controller) {
                    $httpBackend.expectGET('http://someapi/bca/PortfolioComments?$filter=Allocation_Id+eq+1&$inlinecount=allpages&$orderby=CreatedOn+desc&$skip=0&$top=5').respond(commentsPage1);

                    scope.item = {
                        id: 1,
                        isPortfolio: false
                    };
                    
                    scope.row = {
                        id: 'p-1'
                    };

                    $controller(PortfolioAllocationCommentsController, {
                        $scope: scope
                    });

                    $httpBackend.flush();
                }));

                describe('And we fetch the first page', function () {
                    it('Should display the first page of comments', inject(function (DataEndpoint) {
                        expect(scope.comments).toEqual(commentsPage1.value);
                        expect(scope.totalItems).toBe(parseInt(commentsPage1['odata.count'], 10));
                        expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith(['bca-trades', 'portfolio-comments']);
                    }));

                    it('Should tell the TreeGrid to resize the more info section containing the comments', function () {
                        expect(listener).toHaveBeenCalled();
                    });

                    describe('And we fetch the second page', function () {
                        beforeEach(function () {
                            $httpBackend.expectGET('http://someapi/bca/PortfolioComments?$filter=Allocation_Id+eq+1&$inlinecount=allpages&$orderby=CreatedOn+desc&$skip=5&$top=15').respond(commentsPage2);
                            scope.showMore();
                            $httpBackend.flush();
                        });

                        it('Should display the second page of comments', inject(function (DataEndpoint) {
                            expect(scope.comments).toEqual(_.union(commentsPage1.value, commentsPage2.value));
                            expect(scope.totalItems).toBe(parseInt(commentsPage2['odata.count'], 10));
                            expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith(['bca-trades', 'portfolio-comments']);
                        }));
                    });
                });
            });
        });
    });
});