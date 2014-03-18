define(['App/Controllers/AllViews/ViewableController',
        'angular',
        'resource',
        'mocks'
], function (ViewableController) {
    describe('ViewableController', function () {
        describe('Given we have a viewable controller', function () {
            var controller,
                scope,
                perspectiveBuilderArguments;

            beforeEach(function () {
                module('App.controllers');
            });
         
                
            angular.module('ViewableController.Spec', []).service('Perspectives', ['$q', function ($q) {
                return {
                    post: function () {
                        var deferred = $q.defer();
                        deferred.resolve('someid');
                        return deferred.promise;
                    },
                    remove: function () {
                        var deferred = $q.defer();
                        deferred.resolve(true);
                        return deferred.promise;
                    }
                };
            }]).service('PerspectiveBuilder', ['$q', function ($q) {
                return {
                    buildViewPerspective: function () {
                        perspectiveBuilderArguments = arguments;
                        var deferred = $q.defer();
                        deferred.resolve({});
                        return deferred.promise;
                    }
                };
            }]).factory('Analytics', function () {
                return {
                    registerPageTrack: function () {
                    },
                    registerClick: function() {
                        
                    },
                    logUsage: function() {
                        
                    }
                };
            });

            beforeEach(function () {
                module('App');
                module('ViewableController.Spec');
            });
            
         

            describe('Favouriting', function () {
                beforeEach(inject(function ($rootScope, $controller) {
                    scope = $rootScope.$new();
                   
                    controller = $controller(ViewableController, {
                        $scope: scope
                    });
                }));
                
                describe('When favouriting a view', function () {
                    var viewable,
                        notificationService,
                        event = {
                            stopPropagation: function () {
                            }
                        };

                    beforeEach(inject(function (Notifications) {
                        notificationService = Notifications;
                        spyOn(notificationService, 'success');
                        spyOn(event, 'stopPropagation');
                        scope.$root.$digest();
                        viewable = {
                            annotationsLoaded: true,
                            userContextLoaded: true,
                            activeView: {
                                '@set': [{
                                    '@id': '4_4',
                                    viewOrigin: { '@id': '4' },
                                    viewOn: {
                                        '@id': 'http://data.emii.com/economy/us',
                                        canonicalLabel: 'US Economy'
                                    }
                                }, {
                                    '@id': '5_5',
                                    viewOn: {
                                        '@id': 'http://data.emii.com/economy/us',
                                        canonicalLabel: 'US Economy'
                                    }
                                }]

                            }
                        };
                        scope.viewable = viewable;
                    }));

                    it('Should be favourited using origin ID', function () {
                        var view = viewable.activeView['@set'][0];
                        scope.toggleFavouriteView(view, event);
                        scope.$root.$digest();

                        expect(view.perspectiveId).toBe('someid');
                        expect(view.isFavourited).toBe(true);
                        expect(notificationService.success).toHaveBeenCalled();
                        expect(event.stopPropagation).toHaveBeenCalled();
                        expect(perspectiveBuilderArguments[1]).toBe('4');
                    });

                    it('Should be favourited using view ID', function () {
                        var view = viewable.activeView['@set'][1];
                        scope.toggleFavouriteView(view, event);
                        scope.$root.$digest();

                        expect(view.perspectiveId).toBe('someid');
                        expect(view.isFavourited).toBe(true);
                        expect(notificationService.success).toHaveBeenCalled();
                        expect(event.stopPropagation).toHaveBeenCalled();
                        expect(perspectiveBuilderArguments[1]).toBe('5_5');
                    });
                });

                describe('Given we have a favourited view', function () {
                    var viewable;
                    beforeEach(function () {
                        scope.$root.$digest();
                        viewable = {
                            annotationsLoaded: true,
                            userContextLoaded: true,
                            isFavourited: true,
                            activeView: {
                                '@set': [
                                    {
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        },
                                        isFavourited: true,
                                        perspectiveId: 'someId'
                                    },
                                    {
                                        viewOn: {
                                            '@id': 'http://data.emii.com/economy/us',
                                            canonicalLabel: 'US Economy'
                                        }
                                    }
                                ]

                            }
                        };
                        scope.viewable = viewable;
                    });

                    describe('When removing a view from favourites', function () {
                        it('Should no longer be favourited', inject(function (Notifications) {
                            spyOn(Notifications, 'success');
                            scope.toggleFavouriteView(viewable.activeView['@set'][0]);

                            scope.$root.$digest();
                            expect(viewable.activeView['@set'][0].perspectiveId).toBeUndefined();
                            expect(viewable.activeView['@set'][0].isFavourited).toBe(false);
                            expect(Notifications.success).toHaveBeenCalled();
                        }));
                    });
                });
            });
            
            describe('Following', function () {
                beforeEach(inject(function ($rootScope, $controller) {
                    scope = $rootScope.$new();

                    controller = $controller(ViewableController, {
                        $scope: scope
                    });
                }));

                describe('When following a view', function () {
                    var viewable,
                        notificationService,
                        event = {
                            stopPropagation: function () {
                            }
                        };

                    beforeEach(inject(function (Notifications) {
                        notificationService = Notifications;
                        spyOn(notificationService, 'success');
                        spyOn(event, 'stopPropagation');
                        scope.$root.$digest();
                        viewable = {
                            annotationsLoaded: true,
                            userContextLoaded: true,
                            activeView: {
                                '@set': [{
                                    '@id': '4_4',
                                    viewOrigin: { '@id': '4' },
                                    service: {
                                        canonicalLabel: 'BCA House'
                                    }
                                }, {
                                    '@id': '5_5',
                                    service: {
                                        canonicalLabel: 'BCA House'
                                    }
                                }]

                            }
                        };
                        scope.viewable = viewable;
                    }));

                    it('Should be followed using origin ID', function () {
                        var view = viewable.activeView['@set'][0];
                        scope.toggleFollowView(view, event);
                        scope.$root.$digest();

                        expect(view.followPerspectiveId).toBe('someid');
                        expect(view.isFollowed).toBe(true);
                        expect(notificationService.success).toHaveBeenCalled();
                        expect(event.stopPropagation).toHaveBeenCalled();
                        expect(perspectiveBuilderArguments[1]).toBe('4');
                    });

                    it('Should be followed using view ID', function () {
                        var view = viewable.activeView['@set'][1];
                        scope.toggleFollowView(view, event);
                        scope.$root.$digest();

                        expect(view.followPerspectiveId).toBe('someid');
                        expect(view.isFollowed).toBe(true);
                        expect(notificationService.success).toHaveBeenCalled();
                        expect(event.stopPropagation).toHaveBeenCalled();
                        expect(perspectiveBuilderArguments[1]).toBe('5_5');
                    });
                });

                describe('Given we have a followed view', function () {
                    var viewable;
                    beforeEach(function () {
                        scope.$root.$digest();
                        viewable = {
                            annotationsLoaded: true,
                            userContextLoaded: true,
                            isFollowed: true,
                            activeView: {
                                '@set': [
                                    {
                                        isFollowed: true,
                                        followPerspectiveId: 'someId',
                                        service: {
                                            canonicalLabel: 'BCA House'
                                        }
                                    }, {

                                    }]

                            }
                        };
                        scope.viewable = viewable;
                    });

                    describe('When unfollowing a view', function () {
                        it('Should no longer be followed', inject(function (Notifications) {
                            spyOn(Notifications, 'success');
                            scope.toggleFollowView(viewable.activeView['@set'][0]);

                            scope.$root.$digest();
                            expect(viewable.activeView['@set'][0].followPerspectiveId).toBeUndefined();
                            expect(viewable.activeView['@set'][0].isFollowed).toBe(false);
                            expect(Notifications.success).toHaveBeenCalled();
                        }));
                    });
                });
                
                describe('Given we have a followed viewable', function () {
                    var viewable;
                    beforeEach(function () {
                        scope.$root.$digest();
                        viewable = {
                            annotationsLoaded: true,
                            userContextLoaded: true,
                            isFollowed: true,
                            followPerspectiveId: 'someId',
                            activeView: {
                                '@set': [
                                    {
                                        isFollowed: true,
                                        followPerspectiveId: 'someId',
                                        service: {
                                            canonicalLabel: 'BCA House'
                                        }
                                    }, {

                                    }]

                            }
                        };
                        scope.viewable = viewable;
                    });

                    describe('When unfollowing a view', function () {
                        it('Should not do anything', inject(function (Notifications) {
                            spyOn(Notifications, 'warning');
                            scope.toggleFollowView(viewable.activeView['@set'][0]);

                            scope.$root.$digest();
                            expect(viewable.activeView['@set'][0].followPerspectiveId).toBe('someId');
                            expect(viewable.activeView['@set'][0].isFollowed).toBe(true);
                            expect(Notifications.warning).toHaveBeenCalled();
                        }));
                    });
                });
              
            });
            
            describe('When selecting the viewable', function () {
                beforeEach(inject(function ($rootScope, $controller, Annotations, Like, $q) {

                    scope = $rootScope.$new();

                    scope.viewable = {
                        dominantView: {
                            '@id': 'http://data.emii.com/view2'
                        },
                        activeView: {
                            '@set': [
                                        {
                                            '@id': 'http://data.emii.com/view1',
                                            'viewWeighting': {},
                                            'service': {
                                                '@id': 'http://data.emii.com/bca/services/bcah',
                                                'canonicalLabel': 'BCA House'
                                            }
                                        },
                                        {
                                            '@id': 'http://data.emii.com/view2',
                                            'viewWeighting': {},
                                            'service': {
                                                '@id': 'http://data.emii.com/bca/services/bcah',
                                                'canonicalLabel': 'BCA House'
                                            }
                                        }
                            ]
                        }
                    };
                    spyOn(Annotations, 'getAnnotations').andReturn({
                        then: function (expression) {
                            var anns = [];
                            anns['http://data.emii.com/view1'] = [
                                {
                                    key: 'http://data.emii.com/annotation-types/support',
                                    values: [
                                        {
                                            '@id': 'http://data.emii.com/annotation-view1-0'
                                        },
                                        {
                                            '@id': 'http://data.emii.com/annotation-view1-1'
                                        }
                                    ]
                                }
                            ];
                            anns['http://data.emii.com/view2'] = [
                                {
                                    key: 'http://data.emii.com/annotation-types/support',
                                    values: [
                                        {
                                            '@id': 'http://data.emii.com/annotation-view1-0',
                                            annotationFor: {
                                                '@id': 'urn:document:documentId'
                                            }
                                        },
                                        {
                                            '@id': 'http://data.emii.com/annotation-view1-1'
                                        }
                                    ]
                                }];
                            expression(anns);
                        }
                    });
                    spyOn(Like, 'getAggregatedLikeCount').andReturn({
                        then: function (expression) {
                            expression({
                                'view1': 3,
                                'view2': 2
                            });
                        }
                    });
                    spyOn(Like, 'getAggregatedDislikeCount').andReturn({
                        then: function (expression) {
                            expression({
                                'view1': 5,
                                'view2': 4
                            });
                        }
                    });
                    spyOn(scope, "$emit");
                    
                    controller = $controller(ViewableController, {
                        $scope: scope
                    });
                }));

                describe('And annotations nor user context have been loaded', function () {
                    beforeEach(function () {
                        scope.$root.$digest();
                    });
                    it('should load the annotations', inject(function (Like, Annotations) {
                        expect(Annotations.getAnnotations).toHaveBeenCalledWith({
                            conceptUri: ['http://data.emii.com/view1', 'http://data.emii.com/view2'],
                            onlyOneAnnotationPerDocument: true
                        });
                        expect(Like.getAggregatedLikeCount).toHaveBeenCalledWith('view', ['view1', 'view2']);
                        expect(Like.getAggregatedDislikeCount).toHaveBeenCalledWith('view', ['view1', 'view2']);
                    }));
                    
                    it('should get the annotations for views', function () {
                        expect(scope.viewable.activeView['@set'][0].annotations).toBeDefined();
                        expect(scope.viewable.activeView['@set'][1].annotations).toBeDefined();
                    });

                    it('should get the like count for views', function () {
                        expect(scope.viewable.activeView['@set'][0].likeCount).toBe(3);
                        expect(scope.viewable.activeView['@set'][1].likeCount).toBe(2);
                    });

                    it('should get the dislike count for views', function () {
                        expect(scope.viewable.activeView['@set'][0].dislikeCount).toBe(5);
                        expect(scope.viewable.activeView['@set'][1].dislikeCount).toBe(4);
                    });
                    
                });
                
                describe('And annotations have been loaded', function () {
                    beforeEach(function () {
                        scope.viewable.annotationsLoaded = true;
                        scope.$root.$digest();
                    });

                    afterEach(function () {
                        delete scope.viewable.annotationsLoaded;
                    });

                    it('should not load the annotations', inject(function (Annotations) {
                        expect(Annotations.getAnnotations).not.toHaveBeenCalled();
                    }));
                  
                });

                describe('And user context have been loaded', function () {
                    beforeEach(function () {
                        scope.viewable.userContextLoaded = true;
                        scope.$root.$digest();
                    });

                    it('should not load likes', inject(function (Like) {
                        expect(Like.getAggregatedLikeCount).not.toHaveBeenCalled();
                    }));


                    it('should not load dislikes', inject(function (Like) {
                        expect(Like.getAggregatedDislikeCount).not.toHaveBeenCalled();
                    }));
                });
            });

            describe('Ordering views', function () {
                beforeEach(inject(function ($rootScope, $controller) {
                    scope = $rootScope.$new();

                    controller = $controller(ViewableController, {
                        $scope: scope
                    });
                }));
                it('should display HOUSE views first (display order 0), and then sort them by descending date', function() {
                    var result = scope.sortViews({
                        lastUpdatedDate: '2013-10-01',
                        displayOrder: 1
                    });
                    expect(result).toBe('1-31502');
                });
                it('should not fail if display order is not present', function () {
                    var result = scope.sortViews({
                        lastUpdatedDate: '2013-10-01'
                    });

                    expect(result).toBe('0-31502');
                });
            });
        });
    });
});