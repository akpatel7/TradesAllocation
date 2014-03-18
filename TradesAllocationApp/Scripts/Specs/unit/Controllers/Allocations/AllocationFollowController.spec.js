define(['App/Controllers/Allocations/AllocationFollowController',
        'underscore',
        'angular',
        'mocks',
        'App/Services/services',
        'App/Controllers/controllers'
], function (AllocationFollowController, _) {
    describe('AllocationFollowController', function () {
        var scope,
            $event = {
                stopPropagation: function () {

                }
            };

        angular.module('AllocationFollowController.Spec', [])
           .factory('Analytics', function () {
               return {
                   registerPageTrack: function () {
                   },
                   registerClick: function () {
                   },
                   logUsage: function () {
                   }
               };
           });

        beforeEach(function () {
            module('App');
            module('AllocationFollowController.Spec');
            module('App.services');
        });

        describe('Given a AllocationFollowController', function () {
            beforeEach(inject(function ($rootScope, $controller, Analytics) {
                scope = $rootScope.$new();
                scope.grid = {
                    GetCell: function () {
                        return {};
                    },
                    CloseDialog: function() {
                        return {};
                    }
                };
                spyOn(Analytics, 'registerClick').andCallThrough();

                $controller(AllocationFollowController, {
                    $scope: scope,
                    $rootScope: $rootScope
                });
            }));

            describe('When toggling follow for an allocation', function () {
                var row,
                    menuBuilt;
                
                beforeEach(inject(function ($window) {
                    spyOn($window, 'ShowMenu').andCallFake(function (menu) {
                        menuBuilt = menu;
                    });
                    row = {
                        Uri: 'http://data.com/allocation/1',
                        Instrument: 'Allocation Name',
                        isPortfolio: 0
                    };
                    scope.toggleFollow(row, $event);
                }));
                
                it('should show the follow menu', inject(function ($window) {
                    expect($window.ShowMenu).toHaveBeenCalled();
                }));

                it('should build a follow allocations menu', function () {
                    expect(menuBuilt.Items[0].Name).toBe('FollowCaption');
                    expect(menuBuilt.Items[0].Text).toBe('FOLLOW: Allocation Name');
                });
            });

            describe('When toggling follow for a portfolio', function () {
                var row,
                    menuBuilt;
                describe('And a menu is already open', function() {
                    beforeEach(inject(function ($window) {
                        spyOn($window, 'ShowMenu').andCallFake(function (menu) {
                            menuBuilt = menu;
                        });
                        spyOn(scope.grid, 'CloseDialog');
                        
                        row = {
                            Uri: 'http://data.com/portfolio/1',
                            Instrument: 'Portfolio Name',
                            isPortfolio: 1
                        };
                        scope.grid.Dialog = {};
                        scope.toggleFollow(row, $event);
                    }));
                    
                    it('should close the menu', function () {
                        expect(scope.grid.CloseDialog).toHaveBeenCalled();
                    });
                    
                    it('should show the follow menu', inject(function ($window) {
                        expect($window.ShowMenu).toHaveBeenCalled();
                    }));

                });

                describe('And no menu is already open', function() {
                    beforeEach(inject(function ($window) {
                        spyOn($window, 'ShowMenu').andCallFake(function (menu) {
                            menuBuilt = menu;
                        });
                        row = {
                            Uri: 'http://data.com/portfolio/1',
                            Instrument: 'Portfolio Name',
                            isPortfolio: 1
                        };
                        scope.toggleFollow(row, $event);
                    }));
                    it('should show the follow menu', inject(function ($window) {
                        expect($window.ShowMenu).toHaveBeenCalled();
                    }));

                    it('should build a follow allocations menu', function () {
                        expect(menuBuilt.Items[0].Name).toBe('FOLLOW PORTFOLIO');
                    });
                });
               
            });
           
            describe('Follow Menu ', function () {
                describe('for allocation', function () {
                    describe('When the allocation is not followed', function () {
                        var row,
                            menu;
                        
                        beforeEach(function () {
                            row = {
                                Uri: 'http://data.com/allocation/1',
                                Instrument: 'Allocation Name',
                                isFollowed: 0,
                                isPortfolio: 0
                            };
                            menu = scope.buildAllocationMenu(row);
                        });
                        
                        it('allocation should not be checked', function () {
                            expect(menu.Items[0].Name).toBe('FollowCaption');
                            expect(menu.Items[0].Text).toBe('FOLLOW: Allocation Name');
                            
                            expect(menu.Items[1]).toEqual({
                                Name: 'http://data.com/allocation/1',
                                Text: 'Allocation',
                                Value: 0,
                                Left: 1,
                                Bool: 1
                            });
                        });

                        describe('When changing the allocation to followed', function () {
                            beforeEach(inject(function (Follow, $rootScope) {
                                spyOn(Follow, 'followAllocation').andReturn({
                                    then: function (expression) {
                                        return expression('perspectiveId');
                                    }
                                });
                                menu.OnSave(undefined, ['http://data.com/allocation/1', '']);
                            }));

                            it('should call the follow service', inject(function (Follow) {
                                expect(Follow.followAllocation).toHaveBeenCalledWith({
                                    uri: 'http://data.com/allocation/1',
                                    label: 'Allocation Name'
                                });
                            }));
                            
                            it('should mark the row as followed', function () {
                                expect(row.followPerspectiveId).toEqual('perspectiveId');
                                expect(row.isFollowed).toBe(1);
                            });

                            it('should send tracking information', inject(function (Analytics) {
                                expect(Analytics.registerClick).toHaveBeenCalledWith('DCSext.followAllocation', 'Allocation Name');
                            }));
                        });

                        describe('When saving without any change', function () {
                            beforeEach(inject(function (Follow) {
                                spyOn(Follow, 'unfollowAllocation');
                                spyOn(Follow, 'followAllocation');
                                menu.OnSave(undefined, ['', '']);
                            }));

                            it('should not call the follow service', inject(function (Follow) {
                                expect(Follow.unfollowAllocation).not.toHaveBeenCalled();
                                expect(Follow.followAllocation).not.toHaveBeenCalled();
                            }));
                        });
                    });

                    describe('When the allocation is followed', function () {
                        var row,
                            menu;
                        
                        beforeEach(function () {
                            row = {
                                Uri: 'http://data.com/allocation/1',
                                Instrument: 'Allocation Name',
                                isFollowed: 1,
                                followPerspectiveId: 'someId'
                            };
                            menu = scope.buildAllocationMenu(row);
                        });
                        
                        it('allocation should be checked', function () {
                            expect(menu.Items[1]).toEqual({
                                Name: 'http://data.com/allocation/1',
                                Text: 'Allocation',
                                Value: 1,
                                Left: 1,
                                Bool: 1
                            });
                        });

                        describe('When changing the allocation to not followed', function () {
                            beforeEach(inject(function (Follow) {
                                spyOn(Follow, 'unfollowAllocation').andReturn({
                                    then: function (expression) {
                                        return expression(true);
                                    }
                                });
                                menu.OnSave(undefined, ['', '']);
                            }));

                            it('should call the follow service', inject(function (Follow) {
                                expect(Follow.unfollowAllocation).toHaveBeenCalledWith({
                                    perspectiveId: 'someId',
                                    label: 'Allocation Name'
                                });
                            }));
                            it('should mark the row as un followed', function () {
                                expect(row.followPerspectiveId).toBeUndefined();
                                expect(row.isFollowed).toBe(0);
                            });
                           
                            it('should send tracking information', inject(function (Analytics) {
                                expect(Analytics.registerClick).toHaveBeenCalledWith('DCSext.unfollowAllocation', 'Allocation Name');
                            }));
                        });

                        describe('When saving without any change', function () {
                            beforeEach(inject(function (Follow) {
                                spyOn(Follow, 'unfollowAllocation');
                                spyOn(Follow, 'followAllocation');
                                menu.OnSave(undefined, ['http://data.com/allocation/1', '']);
                            }));

                            it('should not call the follow service', inject(function (Follow) {
                                expect(Follow.unfollowAllocation).not.toHaveBeenCalled();
                                expect(Follow.followAllocation).not.toHaveBeenCalled();
                            }));
                        });
                    });
                    
                    describe('When the allocation instrument is not followed', function () {
                        var row,
                            menu;

                        beforeEach(function () {
                            row = {
                                Uri: 'http://data.com/allocation/1',
                                InstrumentUri: 'http://data.com/tradablething/1',
                                Instrument: 'Allocation Name',
                                isFollowed: 0,
                                isAllocationInstrumentFollowed: 0,
                                isPortfolio: 0
                            };
                            menu = scope.buildAllocationMenu(row);
                        });

                        it('allocation should not be checked', function () {
                            expect(menu.Items[0].Name).toBe('FollowCaption');
                            expect(menu.Items[0].Text).toBe('FOLLOW: Allocation Name');

                            expect(menu.Items[2]).toEqual({
                                Name: 'http://data.com/tradablething/1',
                                Text: 'Instrument',
                                Value: 0,
                                Left: 1,
                                Bool: 1
                            });
                        });

                        describe('When changing the allocation to followed', function () {
                            beforeEach(inject(function (Follow) {
                                spyOn(scope, 'updateInstrumentFollowedState');

                                spyOn(Follow, 'followAllocationInstrument').andReturn({
                                    then: function (expression) {
                                        return expression('perspectiveId');
                                    }
                                });

                                menu.OnSave(undefined, ['', 'http://data.com/tradablething/1']);
                            }));

                            it('should call the follow service', inject(function (Follow) {
                                expect(Follow.followAllocationInstrument).toHaveBeenCalledWith({
                                    uri: 'http://data.com/tradablething/1',
                                    label: 'Allocation Name'
                                });
                            }));
                            
                            it('should mark the row as followed', function () {
                                expect(row.followAllocationInstrumentPerspectiveId).toEqual('perspectiveId');
                                expect(row.isAllocationInstrumentFollowed).toBe(1);
                            });

                            it('should send tracking information', inject(function (Analytics) {
                                expect(Analytics.registerClick).toHaveBeenCalledWith('DCSext.followAllocationInstrument', 'Allocation Name');
                            }));
                            
                            it('should emit event to parents that follow instrument perspective has changed', inject(function () {
                                expect(scope.updateInstrumentFollowedState).toHaveBeenCalledWith(row, { InstrumentUri: 'http://data.com/tradablething/1', isAllocationInstrumentFollowed: 1, followAllocationInstrumentPerspectiveId: 'perspectiveId' });
                            }));
                        });

                        describe('When saving without any change', function () {
                            beforeEach(inject(function (Follow) {
                                spyOn(Follow, 'unfollowAllocationInstrument');
                                spyOn(Follow, 'followAllocationInstrument');
                                menu.OnSave(undefined, ['', '']);
                            }));

                            it('should not call the follow service', inject(function (Follow) {
                                expect(Follow.unfollowAllocationInstrument).not.toHaveBeenCalled();
                                expect(Follow.followAllocationInstrument).not.toHaveBeenCalled();
                            }));
                        });
                    });

                    describe('When the allocation instrument is followed', function () {
                        var row,
                            menu;

                        beforeEach(function () {
                            row = {
                                Uri: 'http://data.com/allocation/1',
                                InstrumentUri: 'http://data.com/tradablething/1',
                                Instrument: 'Allocation Name',
                                isAllocationInstrumentFollowed: 1,
                                followAllocationInstrumentPerspectiveId: 'someId',
                                isFollowed: 0
                            };
                            menu = scope.buildAllocationMenu(row);
                        });

                        it('allocation should be checked', function () {
                            expect(menu.Items[2]).toEqual({
                                Name: 'http://data.com/tradablething/1',
                                Text: 'Instrument',
                                Value: 1,
                                Left: 1,
                                Bool: 1
                            });
                        });

                        describe('When changing the allocation to not followed', function () {

                            beforeEach(inject(function (Follow) {
                                spyOn(scope, 'updateInstrumentFollowedState');
                                
                                spyOn(Follow, 'unfollowAllocationInstrument').andReturn({
                                    then: function (expression) {
                                        return expression(true);
                                    }
                                });
                                menu.OnSave(undefined, ['', '']);
                            }));

                            it('should call the follow service', inject(function (Follow) {
                                expect(Follow.unfollowAllocationInstrument).toHaveBeenCalledWith({
                                    perspectiveId: 'someId',
                                    label: 'Allocation Name'
                                });
                            }));
                            
                            it('should mark the row as un followed', function () {
                                expect(row.followAllocationInstrumentPerspectiveId).toBeUndefined();
                                expect(row.isAllocationInstrumentFollowed).toBe(0);
                            });

                            it('should send tracking information', inject(function (Analytics) {
                                expect(Analytics.registerClick).toHaveBeenCalledWith('DCSext.unfollowAllocationInstrument', 'Allocation Name');
                            }));
                            
                            it('should emit event to parents that follow instrument perspective has changed', inject(function () {
                                expect(scope.updateInstrumentFollowedState).toHaveBeenCalledWith(row, { InstrumentUri: 'http://data.com/tradablething/1', isAllocationInstrumentFollowed: 0, followAllocationInstrumentPerspectiveId: undefined });
                            }));
                        });

                        describe('When saving without any change', function () {
                            beforeEach(inject(function (Follow) {
                                spyOn(Follow, 'unfollowAllocationInstrument');
                                spyOn(Follow, 'followAllocationInstrument');
                                menu.OnSave(undefined, ['', 'http://data.com/tradablething/1']);
                            }));

                            it('should not call the follow service', inject(function (Follow) {
                                expect(Follow.unfollowAllocationInstrument).not.toHaveBeenCalled();
                                expect(Follow.followAllocationInstrument).not.toHaveBeenCalled();
                            }));
                        });
                    });
                });

                describe('for portfolio', function () {
                    describe('When the portfolio is not followed but some allocations are', function () {
                        var row,
                            menu;
                        beforeEach(function () {
                            row = {
                                Uri: 'http://data.com/portfolio/1',
                                Instrument: 'Portfolio 1',
                                isFollowed: 0,
                                isPortfolio: 1,
                                firstChild: {
                                    Uri: 'http://data.emii.com/bca/allocations/1',
                                    Instrument: 'Allocation 1',
                                    isFollowed: 0,
                                    nextSibling: {
                                        Uri: 'http://data.emii.com/bca/allocations/2',
                                        Instrument: 'Allocation 2',
                                        isFollowed: 1,
                                        firstChild: {
                                            Uri: 'http://data.emii.com/bca/allocations/21',
                                            Instrument: 'Allocation 21',
                                            isFollowed: 0
                                        }
                                    }
                                },
                                nextSibling: {
                                    Uri: 'http://data.com/portfolio/2',
                                    Instrument: 'Portfolio 2',
                                    isFollowed: 0
                                }
                            };
                            menu = scope.buildPortfolioMenu(row);
                        });
                        it('portfolio should not be checked', function () {
                            expect(menu.Items[1]).toEqual({
                                Name: 'http://data.com/portfolio/1',
                                Text: 'Portfolio 1',
                                Value: 0,
                                Left: 1,
                                Bool: 1
                            });
                        });
                       
                        describe('When following the portfolio', function () {
                            beforeEach(inject(function (Follow) {
                                spyOn(Follow, 'followPortfolio').andReturn({
                                    then: function (expression) {
                                        return expression('perspectiveId');
                                    }
                                });
                                menu.OnSave(undefined, ['http://data.com/portfolio/1', '']);
                            }));

                            it('should call the follow service', inject(function (Follow) {
                                expect(Follow.followPortfolio).toHaveBeenCalledWith({
                                    uri: 'http://data.com/portfolio/1',
                                    label: 'Portfolio 1'
                                });
                            }));
                            it('should mark the row as followed', function () {
                                expect(row.followPerspectiveId).toEqual('perspectiveId');
                                expect(row.isFollowed).toBe(1);
                            });
                          
                            it('should send tracking information', inject(function (Analytics) {
                                expect(Analytics.registerClick).toHaveBeenCalledWith('DCSext.followPortfolio', 'Portfolio 1');
                            }));
                        });

                        describe('When following all children allocations only', function () {
                            beforeEach(inject(function (Follow, Notifications) {
                                spyOn(Notifications, 'success');
                                spyOn(Follow, 'followPortfolio');
                                spyOn(Follow, 'followAllocation').andReturn({
                                    then: function (expression) {
                                        return expression('perspectiveId');
                                    }
                                });
                                menu.OnSave(undefined, ['', 'all']);
                            }));

                            it('should not follow the portfolio', inject(function (Follow) {
                                expect(Follow.followPortfolio).not.toHaveBeenCalled();
                            }));
                            it('should follow all the allocations not already followed', inject(function (Follow) {
                                expect(Follow.followAllocation).toHaveBeenCalledWith({
                                    uri: 'http://data.emii.com/bca/allocations/1',
                                    label: 'Allocation 1',
                                    enableNotification: false
                                });

                                expect(Follow.followAllocation).not.toHaveBeenCalledWith({
                                    uri: 'http://data.emii.com/bca/allocations/2',
                                    label: 'Allocation 2',
                                    enableNotification: false
                                });

                                expect(Follow.followAllocation).toHaveBeenCalledWith({
                                    uri: 'http://data.emii.com/bca/allocations/21',
                                    label: 'Allocation 21',
                                    enableNotification: false
                                });

                            }));
                            it('should mark all the allocations as followed', function () {
                                expect(row.firstChild.followPerspectiveId).toEqual('perspectiveId');
                                expect(row.firstChild.isFollowed).toBe(1);
                                expect(row.firstChild.nextSibling.isFollowed).toBe(1);
                                expect(row.firstChild.nextSibling.firstChild.isFollowed).toBe(1);
                                expect(row.firstChild.nextSibling.firstChild.followPerspectiveId).toBe('perspectiveId');
                                expect(row.nextSibling.isFollowed).toBe(0);
                            });

                            it('should notify the user that the children have been followed', inject(function (Notifications) {
                                expect(Notifications.success).toHaveBeenCalledWith('All child allocations are now being followed.');
                            }));
                            
                           
                        });

                        describe('When saving without any change', function () {
                            beforeEach(inject(function (Follow) {
                                spyOn(Follow, 'unfollowPortfolio');
                                spyOn(Follow, 'followPortfolio');
                                menu.OnSave(undefined, ['', '']);
                            }));

                            it('should not call the follow service', inject(function (Follow) {
                                expect(Follow.unfollowPortfolio).not.toHaveBeenCalled();
                                expect(Follow.followPortfolio).not.toHaveBeenCalled();
                            }));
                        });
                    });

                    describe('When the portfolio is not followed but all allocations are', function () {
                        var row,
                            menu;
                        beforeEach(function () {
                            row = {
                                Uri: 'http://data.com/portfolio/1',
                                Instrument: 'Portfolio 1',
                                isFollowed: 0,
                                isPortfolio: 1,
                                firstChild: {
                                    Uri: 'http://data.emii.com/bca/allocations/1',
                                    Instrument: 'Allocation 1',
                                    isFollowed: 1,
                                    followPerspectiveId: 'someId1',
                                    nextSibling: {
                                        Uri: 'http://data.emii.com/bca/allocations/2',
                                        Instrument: 'Allocation 2',
                                        isFollowed: 1,
                                        followPerspectiveId: 'someId2',
                                        firstChild: {
                                            Uri: 'http://data.emii.com/bca/allocations/21',
                                            Instrument: 'Allocation 21',
                                            isFollowed: 1,
                                            followPerspectiveId: 'someId21'
                                        }
                                    }
                                },
                                nextSibling: {
                                    Uri: 'http://data.com/portfolio/2',
                                    Instrument: 'Portfolio 2',
                                    isFollowed: 0
                                }
                            };
                            menu = scope.buildPortfolioMenu(row);
                        });

                        describe('When un-following all children allocations only', function () {
                            beforeEach(inject(function (Follow, Notifications) {
                                spyOn(Notifications, 'success');
                                spyOn(Follow, 'unfollowAllocation').andReturn({
                                    then: function (expression) {
                                        return expression('perspectiveId');
                                    }
                                });
                                menu.OnSave(undefined, ['', '']);
                            }));

                          
                            it('should un-follow all the allocations ', inject(function (Follow) {
                                expect(Follow.unfollowAllocation).toHaveBeenCalledWith({
                                    perspectiveId: 'someId1',
                                    label: 'Allocation 1',
                                    enableNotification: false
                                });

                                expect(Follow.unfollowAllocation).toHaveBeenCalledWith({
                                    perspectiveId: 'someId2',
                                    label: 'Allocation 2',
                                    enableNotification: false
                                });

                                expect(Follow.unfollowAllocation).toHaveBeenCalledWith({
                                    perspectiveId: 'someId21',
                                    label: 'Allocation 21',
                                    enableNotification: false
                                });

                            }));
                        });

                    });
                    describe('When the porfolio is followed', function () {
                        var row,
                            menu;
                        beforeEach(function () {
                            row = {
                                Uri: 'http://data.com/portfolio/1',
                                Instrument: 'Portfolio Name',
                                isFollowed: 1,
                                followPerspectiveId: 'someId'
                            };
                            menu = scope.buildPortfolioMenu(row);
                        });
                        it('portfolio should be checked', function () {
                            expect(menu.Items[1]).toEqual({
                                Name: 'http://data.com/portfolio/1',
                                Text: 'Portfolio Name',
                                Value: 1,
                                Left: 1,
                                Bool: 1
                            });
                        });

                        describe('When changing the portfolio to not followed', function () {
                            beforeEach(inject(function (Follow) {
                                spyOn(Follow, 'unfollowPortfolio').andReturn({
                                    then: function (expression) {
                                        return expression(true);
                                    }
                                });
                                menu.OnSave(undefined, ['', '']);
                            }));

                            it('should call the follow service', inject(function (Follow) {
                                expect(Follow.unfollowPortfolio).toHaveBeenCalledWith({
                                    perspectiveId: 'someId',
                                    label: 'Portfolio Name'
                                });
                            }));
                            it('should mark the row as un followed', function () {
                                expect(row.followPerspectiveId).toBeUndefined();
                                expect(row.isFollowed).toBe(0);
                            });

                            it('should send tracking information', inject(function (Analytics) {
                                expect(Analytics.registerClick).toHaveBeenCalledWith('DCSext.unfollowPortfolio', 'Portfolio Name');
                            }));
                        });

                        describe('When saving without any change', function () {
                            beforeEach(inject(function (Follow) {
                                spyOn(Follow, 'unfollowPortfolio');
                                spyOn(Follow, 'followPortfolio');
                                menu.OnSave(undefined, ['http://data.com/portfolio/1', '']);
                            }));

                            it('should not call the follow service', inject(function (Follow) {
                                expect(Follow.unfollowPortfolio).not.toHaveBeenCalled();
                                expect(Follow.followPortfolio).not.toHaveBeenCalled();
                            }));
                        });
                    });
                    
                    describe('When the porfolio and all its children are followed', function () {
                        var row,
                            menu;
                        beforeEach(function () {
                            row = {
                                Uri: 'http://data.com/portfolio/1',
                                Instrument: 'Portfolio Name',
                                isFollowed: 1,
                                followPerspectiveId: 'someId'
                            };
                            menu = scope.buildPortfolioMenu(row);
                        });

                        describe('When changing the portfolio to not followed', function () {
                            beforeEach(inject(function (Follow) {
                                spyOn(Follow, 'unfollowPortfolio').andReturn({
                                    then: function (expression) {
                                        return expression(true);
                                    }
                                });
                                menu.OnSave(undefined, ['', 'all']);
                            }));

                            it('should call the follow service', inject(function (Follow) {
                                expect(Follow.unfollowPortfolio).toHaveBeenCalledWith({
                                    perspectiveId: 'someId',
                                    label: 'Portfolio Name'
                                });
                            }));
                            it('should mark the row as un followed', function () {
                                expect(row.followPerspectiveId).toBeUndefined();
                                expect(row.isFollowed).toBe(0);
                            });

                        });
                    });

                    
                    describe('When all allocations are followed', function () {
                        var row,
                            menu;
                        beforeEach(function () {
                            row = {
                                Uri: 'http://data.com/portfolio/1',
                                Instrument: 'Low Risk Portfolio',
                                isFollowed: 1,
                                followPerspectiveId: 'someId',
                                firstChild: {
                                    Uri: 'http://data.emii.com/bca/allocations/1',
                                    Instrument: 'Allocation 1',
                                    isFollowed: 1,
                                    followPerspectiveId: 'someId1',
                                    nextSibling: {
                                        Uri: 'http://data.emii.com/bca/allocations/2',
                                        Instrument: 'Allocation 2',
                                        isFollowed: 1,
                                        followPerspectiveId: 'someId2',
                                        firstChild: {
                                            Uri: 'http://data.emii.com/bca/allocations/21',
                                            Instrument: 'Allocation 21',
                                            isFollowed: 1,
                                            followPerspectiveId: 'someId21'
                                        }
                                    }
                                },
                                isPortfolio: 1,
                                nextSibling: {
                                    Uri: 'http://data.com/portfolio/2',
                                    Instrument: 'Portfolio 2',
                                    isFollowed: 0
                                }
                            };
                            menu = scope.buildPortfolioMenu(row);
                        });
                        it('all children allocations should be checked', function () {
                            expect(menu.Items[2]).toEqual({
                                Name: 'all',
                                Text: 'All Child Allocations',
                                Value: 1,
                                Left: 1,
                                Bool: 1
                            });
                        });

                        describe('When changing the children allocation to not followed', function () {
                            beforeEach(inject(function (Follow, Notifications) {
                                spyOn(Notifications, 'success');
                                spyOn(Follow, 'unfollowAllocation').andReturn({
                                    then: function (expression) {
                                        return expression(true);
                                    }
                                });
                                menu.OnSave(undefined, ['', '']);
                            }));
                         
                            it('should call the follow service', inject(function (Follow) {
                                expect(Follow.unfollowAllocation).toHaveBeenCalledWith({
                                    perspectiveId: 'someId1',
                                    label: 'Allocation 1',
                                    enableNotification: false
                                });
                                expect(Follow.unfollowAllocation).toHaveBeenCalledWith({
                                    perspectiveId: 'someId2',
                                    label: 'Allocation 2',
                                    enableNotification: false
                                });
                                expect(Follow.unfollowAllocation).toHaveBeenCalledWith({
                                    perspectiveId: 'someId21',
                                    label: 'Allocation 21',
                                    enableNotification: false
                                });
                            }));

                            it('should mark the rows as un followed', function () {
                                expect(row.firstChild.followPerspectiveId).toBeUndefined();
                                expect(row.firstChild.isFollowed).toBe(0);
                                expect(row.firstChild.nextSibling.followPerspectiveId).toBeUndefined();
                                expect(row.firstChild.nextSibling.isFollowed).toBe(0);
                                expect(row.firstChild.nextSibling.firstChild.followPerspectiveId).toBeUndefined();
                                expect(row.firstChild.nextSibling.firstChild.isFollowed).toBe(0);
                                expect(row.nextSibling.isFollowed).toBe(0);
                            });
                            
                            it('should notify the user that the children have been followed', inject(function (Notifications) {
                                expect(Notifications.success).toHaveBeenCalledWith('Child allocations are no longer being followed.');
                            }));

                        });
                    });

                    describe('When the porfolio and some children are followed', function () {
                        var row,
                            menu;
                        beforeEach(function () {
                            row = {
                                Uri: 'http://data.com/portfolio/1',
                                Instrument: 'Low Risk Portfolio',
                                isFollowed: 1,
                                followPerspectiveId: 'someId',
                                firstChild: {
                                    Uri: 'http://data.emii.com/bca/allocations/1',
                                    Instrument: 'Allocation 1',
                                    isFollowed: 0,
                                    nextSibling: {
                                        Uri: 'http://data.emii.com/bca/allocations/2',
                                        Instrument: 'Allocation 2',
                                        isFollowed: 1,
                                        followPerspectiveId: 'someId2',
                                        firstChild: {
                                            Uri: 'http://data.emii.com/bca/allocations/21',
                                            Instrument: 'Allocation 21',
                                            isFollowed: 0
                                        }
                                    }
                                },
                                isPortfolio: 1,
                                nextSibling: {
                                    Uri: 'http://data.com/portfolio/2',
                                    Instrument: 'Portfolio 2',
                                    isFollowed: 0
                                }
                            };
                            menu = scope.buildPortfolioMenu(row);
                        });
                        it('portfolio and its children should not be checked', function () {
                            expect(menu.Items[2]).toEqual({
                                Name: 'all',
                                Text: 'All Child Allocations',
                                Value: 0,
                                Left: 1,
                                Bool: 1
                            });
                        });
                     
                        describe('When changing the children allocation to followed', function () {
                            beforeEach(inject(function (Follow) {
                                spyOn(Follow, 'followAllocation').andReturn({
                                    then: function (expression) {
                                        return expression('perspectiveId');
                                    }
                                });
                                menu.OnSave(undefined, ['', 'all']);
                            }));

                            it('should call the follow service', inject(function (Follow) {
                                expect(Follow.followAllocation).toHaveBeenCalledWith({
                                    uri: 'http://data.emii.com/bca/allocations/1',
                                    label: 'Allocation 1',
                                    enableNotification: false
                                });

                                expect(Follow.followAllocation).toHaveBeenCalledWith({
                                    uri: 'http://data.emii.com/bca/allocations/21',
                                    label: 'Allocation 21',
                                    enableNotification: false
                                });
                            }));

                            it('should mark all the allocations as followed', function () {
                                expect(row.firstChild.followPerspectiveId).toEqual('perspectiveId');
                                expect(row.firstChild.isFollowed).toBe(1);
                                expect(row.firstChild.nextSibling.isFollowed).toBe(1);
                                expect(row.firstChild.nextSibling.firstChild.isFollowed).toBe(1);
                                expect(row.firstChild.nextSibling.firstChild.followPerspectiveId).toBe('perspectiveId');
                                expect(row.nextSibling.isFollowed).toBe(0);
                            });

                        });
                    });
                });
            });

            describe('Followed State', function () {
                describe('When the portfolio is followed', function () {
                    describe('And at least one allocation is not followed', function () {
                        it('should return "half"', function () {
                            var result = scope.getFollowedState({
                                isFollowed: 1,
                                firstChild: {
                                    isFollowed: 1,
                                    nextSibling: {
                                        isFollowed: 1,
                                        nextSibling: {
                                            isFollowed: 0
                                        }
                                    }
                                },
                                isPortfolio: 1
                            });
                            expect(result).toBe('half');
                        });
                    });

                    describe('And all the allocations are followed', function () {
                        it('should return "on"', function () {
                            var result = scope.getFollowedState({
                                isFollowed: 1,
                                isPortfolio: 1,
                                firstChild: {
                                    isFollowed: 1,
                                    nextSibling: {
                                        isFollowed: 1,
                                        nextSibling: {
                                            isFollowed: 1
                                        }
                                    }
                                }
                            });
                            expect(result).toBe('on');
                        });
                    });
                });

                describe('When the portfolio is not followed', function () {
                    describe('And some allocations are followed', function () {
                        it('should return "half"', function () {
                            var result = scope.getFollowedState({
                                isFollowed: 0,
                                isPortfolio: 1,
                                firstChild: {
                                    isFollowed: 0,
                                    nextSibling: {
                                        isFollowed: 1,
                                        nextSibling: {
                                            isFollowed: 1
                                        }
                                    }
                                }
                            });
                            expect(result).toBe('half');
                        });
                    });
                    describe('And no allocation is followed', function () {
                        it('should return "off"', function () {
                            var result = scope.getFollowedState({
                                isFollowed: 0,
                                isPortfolio: 1
                            });
                            expect(result).toBe('off');
                        });
                    });
                });

                describe('When the allocation is followed', function () {
                    it('should return "half"', function () {
                        var result = scope.getFollowedState({
                            isFollowed: 1,
                            isPortfolio: 0
                        });
                        expect(result).toBe('half');
                    });
                });

                describe('When the allocation is not followed', function () {
                    it('should return "off"', function () {
                        var result = scope.getFollowedState({
                            isFollowed: 0,
                            isPortfolio: 0
                        });
                        expect(result).toBe('off');
                    });
                });
            });

            describe('When updateing Instrument Followed State', function () {
                var instrument1,
                    instrument2,
                    instrument3,
                    instrument11;

                beforeEach(function () {
                    instrument1 = {
                        InstrumentUri: 'http://data.com/instrument/1'
                    };
                    instrument2 = {
                        InstrumentUri: 'http://data.com/instrument/2'
                    };
                    instrument3 = {
                        InstrumentUri: 'http://data.com/instrument/3'
                    };
                    instrument11 = {
                        InstrumentUri: 'http://data.com/instrument/1'
                    };
                });
                
                it('should mark allocation row instrument followed', inject(function ($window) {
                    scope.updateInstrumentFollowedState(instrument1, { InstrumentUri: 'http://data.com/instrument/1', isAllocationInstrumentFollowed: 1, followAllocationInstrumentPerspectiveId: 'perspectiveId' });
                    
                    expect(instrument1.isAllocationInstrumentFollowed).toBe(1);
                    expect(instrument1.followAllocationInstrumentPerspectiveId).toBe('perspectiveId');

                    expect(instrument11.isAllocationInstrumentFollowed).toBeUndefined();
                    expect(instrument2.isAllocationInstrumentFollowed).toBeUndefined();
                    expect(instrument3.isAllocationInstrumentFollowed).toBeUndefined();
                }));
                
                it('should mark first child instruments followed', inject(function ($window) {
                    instrument1.firstChild = instrument11;
                    scope.updateInstrumentFollowedState(instrument1, { InstrumentUri: 'http://data.com/instrument/1', isAllocationInstrumentFollowed: 1, followAllocationInstrumentPerspectiveId: 'perspectiveId' });

                    expect(instrument1.isAllocationInstrumentFollowed).toBe(1);
                    expect(instrument1.followAllocationInstrumentPerspectiveId).toBe('perspectiveId');
                    expect(instrument11.isAllocationInstrumentFollowed).toBe(1);
                    expect(instrument11.followAllocationInstrumentPerspectiveId).toBe('perspectiveId');

                    expect(instrument2.isAllocationInstrumentFollowed).toBeUndefined();
                    expect(instrument3.isAllocationInstrumentFollowed).toBeUndefined();
                }));
                
                it('should mark deeper child instruments followed', inject(function ($window) {
                    instrument1.firstChild = instrument2;
                    instrument2.firstChild = instrument3;
                    instrument3.nextSibling = instrument11;
                    scope.updateInstrumentFollowedState(instrument1, { InstrumentUri: 'http://data.com/instrument/1', isAllocationInstrumentFollowed: 1, followAllocationInstrumentPerspectiveId: 'perspectiveId' });

                    expect(instrument1.isAllocationInstrumentFollowed).toBe(1);
                    expect(instrument1.followAllocationInstrumentPerspectiveId).toBe('perspectiveId');
                    expect(instrument11.isAllocationInstrumentFollowed).toBe(1);
                    expect(instrument11.followAllocationInstrumentPerspectiveId).toBe('perspectiveId');

                    expect(instrument2.isAllocationInstrumentFollowed).toBeUndefined();
                    expect(instrument3.isAllocationInstrumentFollowed).toBeUndefined();
                }));
                
                it('should mark parent instruments followed', inject(function ($window) {
                    instrument1.firstChild = instrument2;
                    instrument2.firstChild = instrument3;
                    instrument3.nextSibling = instrument11;
                    instrument11.parentNode = instrument1;
                    scope.updateInstrumentFollowedState(instrument11, { InstrumentUri: 'http://data.com/instrument/1', isAllocationInstrumentFollowed: 1, followAllocationInstrumentPerspectiveId: 'perspectiveId' });

                    expect(instrument1.isAllocationInstrumentFollowed).toBe(1);
                    expect(instrument1.followAllocationInstrumentPerspectiveId).toBe('perspectiveId');
                    expect(instrument11.isAllocationInstrumentFollowed).toBe(1);
                    expect(instrument11.followAllocationInstrumentPerspectiveId).toBe('perspectiveId');

                    expect(instrument2.isAllocationInstrumentFollowed).toBeUndefined();
                    expect(instrument3.isAllocationInstrumentFollowed).toBeUndefined();
                }));
            });
        });
    });
});
