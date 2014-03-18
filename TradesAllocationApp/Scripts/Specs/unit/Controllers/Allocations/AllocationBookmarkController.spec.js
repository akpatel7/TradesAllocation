define(['App/Controllers/Allocations/AllocationBookmarkController',
        'underscore',
        'angular',
        'mocks',
        'App/Services/services',
        'App/Controllers/controllers'
], function (AllocationBookmarkController, _) {
    describe('AllocationBookmarkController', function () {
        var scope, 
            bookmarkableLineItem,
            perspectiveId;

            
        angular.module('AllocationBookmarkController.Spec', [])
           .service('Perspectives', ['$q', function ($q) {
               return {
                   post: function () {
                       var deferred = $q.defer();
                       deferred.resolve(perspectiveId);
                       return deferred.promise;
                   },
                   remove: function () {
                       var deferred = $q.defer();
                       deferred.resolve(true);
                       return deferred.promise;
                   }
               };
           }])
           .service('PerspectiveBuilder', ['$q', function ($q) {
               return {
                   buildAllocationPerspective: function () {
                       var deferred = $q.defer();
                       deferred.resolve({
                           resourceType: 'allocation',
                           containerType: 'bookmark',
                           id: bookmarkableLineItem.Uri
                       });
                       return deferred.promise;
                   },
                   buildPortfolioPerspective: function () {
                       var deferred = $q.defer();
                       deferred.resolve({
                           resourceType: 'portfolio',
                           containerType: 'bookmark',
                           id: bookmarkableLineItem.Uri
                       });
                       return deferred.promise;
                   }
               };
           }])
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
            module('AllocationBookmarkController.Spec');
            module('App.services');
        });


        beforeEach(inject(function ($q, _$httpBackend_, $rootScope, $controller, Notifications, PerspectiveBuilder, Perspectives, Analytics) {
            scope = $rootScope.$new();
            spyOn(Notifications, 'success').andCallThrough();
            spyOn(PerspectiveBuilder, 'buildAllocationPerspective').andCallThrough();
            spyOn(PerspectiveBuilder, 'buildPortfolioPerspective').andCallThrough();
            spyOn(Perspectives, 'post').andCallThrough();
            spyOn(Perspectives, 'remove').andCallThrough();
            spyOn(Analytics, 'registerClick').andCallThrough();
            
            $controller(AllocationBookmarkController, {
                $scope: scope,
                $rootScope: $rootScope
            });
        }));

        beforeEach(function () {
            bookmarkableLineItem = {
                Uri: 'http://data.com/allocation/1',
                Instrument: 'Allocation Name'
            };

            perspectiveId = 'perspectiveId-64843548';
        });

        describe('Given a AllocationBookmarkController', function() {

            it('Should initialise actions', inject(function () {
                expect(scope.getFavouritedState).toBeDefined();
                expect(scope.toggleFavourite).toBeDefined();
            }));

            describe('When we have unfavourited item', function () {

                it('favourite icon should be in "off" state.', inject(function () {
                    expect(scope.getFavouritedState(bookmarkableLineItem)).toBe('off');
                }));

                it('should favourite item', inject(function (PerspectiveBuilder, Perspectives, Analytics, Notifications) {
                    scope.toggleFavourite(bookmarkableLineItem);
                    scope.$digest();
                    
                    expect(PerspectiveBuilder.buildAllocationPerspective).toHaveBeenCalledWith('bookmark', bookmarkableLineItem.Uri);
                    expect(Perspectives.post).toHaveBeenCalledWith({
                        resourceType: 'allocation',
                        containerType: 'bookmark',
                        id: bookmarkableLineItem.Uri
                    });
                    
                    expect(bookmarkableLineItem.isFavourited).toBe(true);
                    expect(bookmarkableLineItem.perspectiveId).toBe(perspectiveId);
                    
                    expect(Notifications.success).toHaveBeenCalledWith('"Allocation Name" is now in your favourite list.');
                    expect(Analytics.registerClick).toHaveBeenCalledWith('DCSext.favouriteallocation', bookmarkableLineItem.Uri);
                }));

            });
            
            describe('When we have unfavourited portfolio item', function () {

                beforeEach(function () {
                    bookmarkableLineItem.isPortfolio = true;
                    bookmarkableLineItem.Name = 'Portfolio Name';
                    delete bookmarkableLineItem.Instrument;
                });

                it('favourite icon should be in "off" state.', inject(function () {
                    expect(scope.getFavouritedState(bookmarkableLineItem)).toBe('off');
                }));

                it('should favourite item', inject(function (PerspectiveBuilder, Perspectives, Analytics, Notifications) {
                    scope.toggleFavourite(bookmarkableLineItem);
                    scope.$digest();

                    expect(PerspectiveBuilder.buildPortfolioPerspective).toHaveBeenCalledWith('bookmark', bookmarkableLineItem.Uri);
                    expect(Perspectives.post).toHaveBeenCalledWith({
                        resourceType: 'portfolio',
                        containerType: 'bookmark',
                        id: bookmarkableLineItem.Uri
                    });

                    expect(bookmarkableLineItem.isFavourited).toBe(true);
                    expect(bookmarkableLineItem.perspectiveId).toBe(perspectiveId);

                    expect(Notifications.success).toHaveBeenCalledWith('"Portfolio Name" is now in your favourite list.');
                    expect(Analytics.registerClick).toHaveBeenCalledWith('DCSext.favouriteportfolio', bookmarkableLineItem.Uri);
                }));

            });
            
            describe('When we have favourited item', function () {

                beforeEach(function () {
                    bookmarkableLineItem.isFavourited = true;
                    bookmarkableLineItem.perspectiveId = perspectiveId;
                });

                it('favourite icon should be in "on" state.', inject(function () {
                    expect(scope.getFavouritedState(bookmarkableLineItem)).toBe('on');
                }));

                it('should un-favourite item', inject(function (PerspectiveBuilder, Perspectives, Analytics, Notifications) {
                    scope.toggleFavourite(bookmarkableLineItem);
                    scope.$digest();

                    expect(Perspectives.remove).toHaveBeenCalledWith(perspectiveId);

                    expect(bookmarkableLineItem.isFavourited).toBe(false);
                    expect(bookmarkableLineItem.perspectiveId).not.toBeDefined();

                    expect(Notifications.success).toHaveBeenCalledWith('"Allocation Name" was removed from your favourite list.');
                    expect(Analytics.registerClick).toHaveBeenCalledWith('DCSext.unfavouriteallocation', bookmarkableLineItem.Uri);
                }));
            });
            
            describe('When we have an event object', function () {
                var event;
                beforeEach(function () {
                    event = {
                        stopPropagation: jasmine.createSpy('stopPropagation')
                    };
                    bookmarkableLineItem.isFavourited = true;
                    bookmarkableLineItem.perspectiveId = perspectiveId;
                });

                it('should stop propagation', inject(function () {
                    scope.toggleFavourite(bookmarkableLineItem, event);
                    scope.$digest();

                    expect(event.stopPropagation).toHaveBeenCalledWith();
                }));
            });
        });
    });
});
