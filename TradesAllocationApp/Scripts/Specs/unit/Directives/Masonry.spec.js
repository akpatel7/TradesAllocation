define(['angular', 'underscore', 'jquery', 'mocks', 'App/Directives/Masonry'], function (angular, _, $) {
    'use strict';

    describe('masonry', function () {
        var controllerProvider,
            self = this;
        controllerProvider = null;
        beforeEach(module('App'));
        beforeEach(function() {
            spyOn($.fn, 'masonry');
        });
        beforeEach(module(function (_$controllerProvider_) {
            controllerProvider = _$controllerProvider_;
            return null;
        }));
        
        beforeEach(inject(function ($rootScope) {
            self.scope = $rootScope.$new();
            return $.fn.masonry.reset();
        }));
        
        it('should initialize', inject(function ($compile) {
            return angular.element('<masonry></masonry>');
        }));
        
        it('should call masonry on init', inject(function ($compile) {
            var element;
            element = $compile('<div masonry></div>')(self.scope);
            return expect($.fn.masonry).toHaveBeenCalled();
        }));
        
        it('should pass on the item-selector attribute', inject(function ($compile) {
            var call, element;
            element = $compile('<div masonry item-selector=".mybrick"></div>')(self.scope);
            expect($.fn.masonry).toHaveBeenCalled();
            call = $.fn.masonry.mostRecentCall;
            return expect(call.args[0].itemSelector).toBe('.mybrick');
        }));
        
        it('should pass on any options provided via `masonry-options`', inject(function ($compile) {
            var call, element;
            element = $compile('<div masonry masonry-options="{ isOriginLeft: true }"></div>')(self.scope);
            expect($.fn.masonry).toHaveBeenCalled();
            call = $.fn.masonry.mostRecentCall;
            return expect(call.args[0].isOriginLeft).toBeTruthy();
        }));
        
        it('should pass on any options provided via `masonry`', inject(function ($compile) {
            var call, element;
            element = $compile('<div masonry="{ isOriginLeft: true }"></div>')(self.scope);
            expect($.fn.masonry).toHaveBeenCalled();
            call = $.fn.masonry.mostRecentCall;
            return expect(call.args[0].isOriginLeft).toBeTruthy();
        }));
        
        it('should read the transitionDuration from cookie if it exists', inject(function ($compile, $cookies) {
            var call, element;
            $cookies['transitionDuration'] = '0.5s';
            element = $compile('<div masonry></div>')(self.scope);
            expect($.fn.masonry).toHaveBeenCalled();
            call = $.fn.masonry.mostRecentCall;
            return expect(call.args[0].transitionDuration).toBe('0.5s');
        }));
        
        describe('MasonryCtrl', function () {
            beforeEach(inject(function ($controller, $compile) {
                self.element = angular.element('<div></div>');
                return self.ctrl = $controller('MasonryController', {
                    $scope: self.scope,
                    $element: self.element
                });
            }));
            
            it('should not remove after destruction', function () {
                self.ctrl.destroy();
                self.ctrl.removeBrick();
                return expect($.fn.masonry).not.toHaveBeenCalled();
            });
            
            return it('should not add after destruction', function () {
                self.ctrl.destroy();
                self.ctrl.appendBrick();
                return expect($.fn.masonry).not.toHaveBeenCalled();
            });
        });
        
        describe('masonry-brick', function () {
            beforeEach(function () {
                self.appendBrick = jasmine.createSpy('appendBrick');
                self.removeBrick = jasmine.createSpy('removeBrick');
                self.scheduleMasonry = jasmine.createSpy('scheduleMasonry');
                self.scheduleMasonryOnce = jasmine.createSpy('scheduleMasonryOnce');
                
                return controllerProvider.register('MasonryController', function () {
                    this.appendBrick = self.appendBrick;
                    this.removeBrick = self.removeBrick;
                    this.scheduleMasonry = self.scheduleMasonry;
                    this.scheduleMasonryOnce = self.scheduleMasonryOnce;
                    return this;
                });
            });
            
            it('should register an element in the parent controller', inject(function ($compile) {
                var element;
                element = $compile('<div masonry>\n  <div class="masonry-brick"></div>\n</div>')(self.scope);
                return expect(self.appendBrick).toHaveBeenCalled();
            }));
            
            it('should remove elements if the parent controller is destroyed', inject(function ($compile) {
                var element;
                self.scope.bricks = [1, 2, 3];
                element = $compile('<div masonry>\n  <div class="masonry-brick" ng-repeat="brick in bricks"></div>\n</div>')(self.scope);
                self.scope.$digest();
                self.scope.$apply(function () {
                    return self.scope.bricks.splice(0, 1);
                });

                expect(self.appendBrick.callCount).toBe(3);
                return expect(self.removeBrick.callCount).toBe(1);
            }));

            describe('when the brick status changes', function() {
                it('should refresh the layout', inject(function ($compile, $timeout) {
                    var element;
                    self.scope.bricks = [1, 2, 3];
                    element = $compile('<div masonry>\n  <div class="masonry-brick" ng-repeat="brick in bricks"  masonryBrick="selected" ></div>\n</div>')(self.scope);
                    self.scope.$digest();
                    self.scope.$apply(function () {
                        return self.scope.bricks[0].selected = true;
                    });
                    expect(self.scheduleMasonryOnce).toHaveBeenCalled();
                }));
            });
        });
        
    });

});


