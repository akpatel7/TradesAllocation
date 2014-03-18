define(['App/Controllers/Trades/TradeController',
        'underscore',
        'angular',
        'mocks',
        'App/Services/services',
        'App/Controllers/controllers'
], function (TradeController, _) {
    describe('TradeController', function () {
        var scope;

        beforeEach(function () {
            module('App.services');
            module('App.controllers');
        });

        describe('Given a TradeController', function() {

            beforeEach(inject(function($q, _$httpBackend_, $rootScope, $controller) {
                scope = $rootScope.$new();

                $controller(TradeController, { $scope: scope });
            }));

            describe('When we favourite a trade recommendation', function() {
                var trade,
                    perspective,
                    $event = {
                        stopPropagation: function() {
                        }
                    };

                beforeEach(inject(function (PerspectiveBuilder, Perspectives, $q, Notifications) {
                    trade = {
                        'trade_id': 100
                    };
                    perspective = {
                        'trade-perspective': 'perspective body'
                    };
                    spyOn($event, 'stopPropagation');
                    spyOn(PerspectiveBuilder, 'buildTradePerspective').andCallFake(function() {
                        var deferred = $q.defer();
                        deferred.resolve(perspective);
                        return deferred.promise;
                    });
                    spyOn(Perspectives, 'post').andCallFake(function() {
                        var deferred = $q.defer();
                        deferred.resolve('perspective-id');
                        return deferred.promise;
                    });
                    spyOn(Notifications, 'success').andCallThrough();
                  
                    scope.toggleFavourite(trade, $event);
                    scope.$root.$digest();
                }));


                it('should mark the trade as favourited', function() {
                    expect(trade.isFavourited).toBe(true);
                    expect(trade.perspectiveId).toBe('perspective-id');
                });

                it('should post the perspective to the server', inject(function(PerspectiveBuilder, Perspectives) {
                    expect(PerspectiveBuilder.buildTradePerspective).toHaveBeenCalledWith('bookmark', 100);
                    expect(Perspectives.post).toHaveBeenCalledWith(perspective);
                }));

                it('should notify the user that the trade has been favourited successfully', inject(function(Notifications) {
                    expect(Notifications.success).toHaveBeenCalledWith('Trade successfully added to favourites.');
                }));

                it('should prevent event propagation', function() {
                    expect($event.stopPropagation).toHaveBeenCalled();
                });
            });
            
            describe('When we un-favourite a trade recommendation', function () {
                var trade,
                    perspective,
                    $event = {
                        stopPropagation: function () {
                        }
                    };

                beforeEach(inject(function (Perspectives, $q, Notifications) {
                    trade = {
                        'trade_id': 100,
                        isFavourited: true,
                        perspectiveId: 'perspective-id'
                    };
                    perspective = {
                        'trade-perspective': 'perspective body'
                    };
                    spyOn($event, 'stopPropagation');
                    spyOn(Perspectives, 'remove').andCallFake(function () {
                        var deferred = $q.defer();
                        deferred.resolve(true);
                        return deferred.promise;
                    });
                    spyOn(Notifications, 'success').andCallThrough();

                    scope.toggleFavourite(trade, $event);
                    scope.$root.$digest();
                }));

                it('should mark the trade as not favourited', function() {
                    expect(trade.isFavourited).toBe(false);
                    expect(trade.perspectiveId).toBeUndefined();
                });
                it('should delete the perspective', inject(function (Perspectives) {
                    expect(Perspectives.remove).toHaveBeenCalledWith('perspective-id');
                }));
                
                it('should notify the user that the trade has been successfully un favourited', inject(function (Perspectives, Notifications) {
                    expect(Notifications.success).toHaveBeenCalledWith('Trade successfully removed from favourites.');
                }));

                it('should stop event propagation', function () {
                    expect($event.stopPropagation).toHaveBeenCalled();
                });
            });
        });
    });
});