define(['App/Controllers/Allocations/AllocationHistoryController',
        'underscore',
        'angular',
        'mocks',
        'App/Services/services',
        'App/Controllers/controllers'
], function (AllocationHistoryController, _) {
    describe('AllocationHistoryController', function () {
        var scope, trade, $httpBackend, historyPage1, historyPage2, listener, _TREE_GRID_RESIZE_INFO_ = 'tree-grid:resize-info';

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

            historyPage1 = {
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

            historyPage2 = {
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

        describe('Given a AllocationHistoryController', function () {
            
            beforeEach(inject(function ($q, DataEndpoint, Dates, AllocationsDataService,_$httpBackend_, $rootScope) {
                $httpBackend = _$httpBackend_;
                
                spyOn(DataEndpoint, 'getTemplatedEndpoint').andCallFake(function() {
                    var deferred = $q.defer();
                    deferred.resolve('http://someapi/bca/AllocationHistory');
                    return deferred.promise;
                });
                
                spyOn(AllocationsDataService, 'formatAllocation').andCallFake(function () {
                    return {
                        "Id": 15,
                        "Text": "Some comment for Model Low Risk Portfolio 15",
                        "CreatedOn": "2014-02-22T09:40:44.883",
                        "Portfolio_Id": 1,
                        "Allocation_Id": null,
                        "Service_Id": 5
                    };
                });

                
                scope = $rootScope.$new();
                
                listener = jasmine.createSpy('listener');
                scope.$on(_TREE_GRID_RESIZE_INFO_, listener);
            }));

            describe('When we want to see history related to allocation', function () {
                beforeEach(inject(function ($controller) {
                    $httpBackend.expectGET('http://someapi/bca/AllocationHistory?$filter=AllocationId+eq+1&$inlinecount=allpages&$orderby=LastUpdated+desc&$skip=0&$top=5').respond(historyPage1);

                    scope.item = {
                        id: 1                        
                    };
                    scope.row = {
                        id: 'p-1'  
                    };

                    $controller(AllocationHistoryController, {
                        $scope: scope
                    });

                    $httpBackend.flush();
                }));
                
                describe('And we fetch the first page', function() {                    
                    it('Should display the first page of history', inject(function(DataEndpoint) {
                        expect(scope.history).toEqual(historyPage1.value);
                        expect(scope.totalItems).toBe(parseInt(historyPage1['odata.count'], 10));
                        expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith(['bca-trades', 'allocation-history']);
                    }));

                    it('Should tell the TreeGrid to resize the more info section containing the comments', function() {
                        expect(listener).toHaveBeenCalled();
                    });

                    describe('And we fetch the second page', function() {
                        beforeEach(function() {
                            $httpBackend.expectGET('http://someapi/bca/AllocationHistory?$filter=AllocationId+eq+1&$inlinecount=allpages&$orderby=LastUpdated+desc&$skip=5&$top=15').respond(historyPage2);
                            scope.showMore();
                            $httpBackend.flush();
                        });

                        it('Should display the second page of history', inject(function(DataEndpoint) {
                            expect(scope.history).toEqual(_.union(historyPage1.value, historyPage2.value));
                            expect(scope.totalItems).toBe(parseInt(historyPage2['odata.count'], 10));
                            expect(DataEndpoint.getTemplatedEndpoint).toHaveBeenCalledWith(['bca-trades', 'allocation-history']);
                        }));
                    });
                });
            });
            
        });
    });
});