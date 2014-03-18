define(['underscore',
        'angular',
        'mocks',
        'App/Services/FollowService'], function (_) {
            describe('FollowService', function () {
                describe('Given we have a Follow Service', function () {
                    
                    angular.module('FollowService.Spec', [])
                        .service('Perspectives', ['$q', function ($q) {
                            return {
                                post: function () {
                                    var deferred = $q.defer();
                                    deferred.resolve('someId');
                                    return deferred.promise;
                                },
                                remove: function () {
                                    var deferred = $q.defer();
                                    deferred.resolve(true);
                                    return deferred.promise;
                                }
                            };
                        }]);


                    beforeEach(function () {
                        module('App');
                        module('FollowService.Spec');
                    });


                    beforeEach(function () {
                        this.addMatchers({
                            toEqualData: function (expected) {
                                return angular.equals(this.actual, expected);
                            }
                        });
                    });

                    describe('When following something', function () {
                        var allocationUri = 'http://data.emii.com/bca/allocation/1',
                            perspectiveFactory;
                        beforeEach(inject(function (PerspectiveBuilder, $q) {
                            perspectiveFactory = {
                                build: function() {
                                    var deferred = $q.defer();
                                    deferred.resolve({
                                        resourceType: 'allocation',
                                        containerType: 'follow',
                                        id: 'http://data.emii.com/bca/allocations/1'
                                    });
                                    return deferred.promise;
                                }
                            };
                            spyOn(perspectiveFactory, 'build').andCallThrough();
                            spyOn(PerspectiveBuilder, 'buildAllocationPerspective').andCallThrough();
                        }));
                        it('should build a new thing perspective', inject(function (Follow) {
                            Follow._followSomething(perspectiveFactory.build, {
                                uri: allocationUri,
                                label: 'CASH'
                            }).then(function() {
                                });

                            expect(perspectiveFactory.build).toHaveBeenCalledWith('follow', 'http://data.emii.com/bca/allocation/1');
                        }));
                        
                        it('should build a new thing perspective', inject(function (Follow, Perspectives, $rootScope) {
                            spyOn(Perspectives, 'post').andCallThrough();
                            Follow._followSomething(perspectiveFactory.build, {
                                uri: allocationUri,
                                label: 'CASH'
                            })
                                .then(function () {
                                });
                            
                            $rootScope.$digest();
                            
                            expect(Perspectives.post).toHaveBeenCalledWith({
                                resourceType: 'allocation',
                                containerType: 'follow',
                                id: 'http://data.emii.com/bca/allocations/1'
                            });
                            
                        }));
                        
                        it('should notify the user that the thing is now being followed', inject(function (Follow, Notifications, $rootScope) {
                            spyOn(Notifications, 'success').andCallThrough();
                            Follow._followSomething(perspectiveFactory.build, {
                                uri: allocationUri,
                                label: 'CASH'
                            })
                            .then(function () {
                            });

                            $rootScope.$digest();

                            expect(Notifications.success).toHaveBeenCalledWith('"CASH" is now being followed.');

                        }));

                        describe('And no uri is provided', function() {
                            it('should fail', inject(function (Follow, $rootScope) {
                                var failed = false;
                                
                                Follow._followSomething(perspectiveFactory.build, {
                                    label: 'CASH'
                                }).then(function () {
                                }, function () {
                                    failed = true;
                                });
                                $rootScope.$digest();
                                expect(failed).toBe(true);
                            }));
                        });
                        
                        describe('And disabling notification', function() {
                            it('should not notify the user that the thing is followed', inject(function(Follow, Notifications, $rootScope) {
                                spyOn(Notifications, 'success').andCallThrough();
                                Follow._followSomething(perspectiveFactory.build, {
                                    uri: allocationUri,
                                    label: 'CASH',
                                    enableNotification: false
                                })
                                .then(function () {
                                });

                                $rootScope.$digest();

                                expect(Notifications.success).not.toHaveBeenCalled();
                            }));
                        });
                        
                        describe('And uri has angle brackets', function () {
                            it('should trim angle brackets', inject(function (Follow, $rootScope) {
                                Follow._followSomething(perspectiveFactory.build, {
                                    uri: '<' + allocationUri + '>',
                                    label: 'CASH'
                                });

                                expect(perspectiveFactory.build).toHaveBeenCalledWith('follow', 'http://data.emii.com/bca/allocation/1');
                            }));
                        });
                    });
                    
                    describe('When un-following something', function () {
                        var perspectiveId = 'someId';

                        it('should remove the thing', inject(function (Follow, Perspectives, $rootScope) {
                            spyOn(Perspectives, 'remove').andCallThrough();
                            Follow._unfollowSomething({
                                perspectiveId: perspectiveId,
                                label: 'CASH'
                            }).then(function () {
                                });

                            $rootScope.$digest();

                            expect(Perspectives.remove).toHaveBeenCalledWith(perspectiveId);

                        }));
                        
                        it('should notify the user that the thing is no longer being followed', inject(function (Follow, Notifications, $rootScope) {
                            spyOn(Notifications, 'success').andCallThrough();
                            Follow._unfollowSomething({
                                    perspectiveId: perspectiveId,
                                    label: 'CASH'
                                })
                                .then(function () {
                                });

                            $rootScope.$digest();

                            expect(Notifications.success).toHaveBeenCalledWith('"CASH" is no longer being followed.');

                        }));
                        
                        describe('And no perspective id is provided', function () {
                            it('should fail', inject(function (Follow, $rootScope) {
                                var failed = false;

                                Follow._unfollowSomething({
                                    label: 'CASH'
                                }).then(function () {
                                }, function () {
                                    failed = true;
                                });
                                $rootScope.$digest();
                                expect(failed).toBe(true);
                            }));
                        });
                        
                        describe('And disabling notification', function () {
                            it('should not notify the user that the thing is no longer followed', inject(function (Follow, Notifications, $rootScope) {
                                spyOn(Notifications, 'success').andCallThrough();
                                Follow._unfollowSomething({
                                    perspectiveId: perspectiveId,
                                    label: 'CASH',
                                    enableNotification: false
                                })
                               .then(function () {
                               });

                                $rootScope.$digest();

                                expect(Notifications.success).not.toHaveBeenCalled();
                            }));
                        });

                    });

                    describe('When following an allocation', function() {
                        it('should build an allocation perspective', inject(function (Follow, PerspectiveBuilder) {
                            var options = {
                                uri: 'http://data.emii.com/bca/allocations/1',
                                label: 'Allocation Name'
                            };
                            spyOn(Follow, '_followSomething').andReturn({});
                            Follow.followAllocation(options);
                            expect(Follow._followSomething).toHaveBeenCalledWith(PerspectiveBuilder.buildAllocationPerspective, options);
                        }));
                    });
                    
                    describe('When un-following an allocation', function () {
                        it('should remove the perspective', inject(function (Follow) {
                            var options = {
                                perspectiveId: 'someId',
                                label: 'Allocation Name'
                            };
                            spyOn(Follow, '_unfollowSomething').andReturn({});
                            Follow.unfollowAllocation(options);
                            expect(Follow._unfollowSomething).toHaveBeenCalledWith(options);
                        }));
                    });
                    
                    describe('When following an allocation instrument', function () {
                        it('should build an tradablething perspective', inject(function (Follow, PerspectiveBuilder) {
                            var options = {
                                uri: 'http://data.emii.com/bca/tradablething/1',
                                label: 'Allocation Name'
                            };
                            spyOn(Follow, '_followSomething').andReturn({});
                            Follow.followAllocationInstrument(options);
                            expect(Follow._followSomething).toHaveBeenCalledWith(PerspectiveBuilder.buildTradableThingPerspective, options);
                        }));
                    });

                    describe('When un-following an allocation instrument', function () {
                        it('should remove the perspective', inject(function (Follow) {
                            var options = {
                                perspectiveId: 'someId',
                                label: 'Allocation Name'
                            };
                            spyOn(Follow, '_unfollowSomething').andReturn({});
                            Follow.unfollowAllocationInstrument(options);
                            expect(Follow._unfollowSomething).toHaveBeenCalledWith(options);
                        }));
                    });
                    
                    describe('When following a portfolio', function () {
                        it('should build a portfolio perspective', inject(function (Follow, PerspectiveBuilder) {
                            var options = {
                                uri: 'http://data.emii.com/bca/portfolios/1',
                                label: 'Portfolio Name'
                            };
                            spyOn(Follow, '_followSomething').andReturn({});
                            Follow.followPortfolio(options);
                            expect(Follow._followSomething).toHaveBeenCalledWith(PerspectiveBuilder.buildPortfolioPerspective, options);
                        }));
                    });

                    describe('When un-following a portfolio', function () {
                        it('should remove the perspective', inject(function (Follow) {
                            var options = {
                                perspectiveId: 'someId',
                                label: 'Portfolio Name'
                            };
                            spyOn(Follow, '_unfollowSomething').andReturn({});
                            Follow.unfollowAllocation(options);
                            expect(Follow._unfollowSomething).toHaveBeenCalledWith(options);
                        }));
                    });
                });
            });
        });