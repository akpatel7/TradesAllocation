define(['angular', 'Masonry/get-size/get-size', 'mocks'], function (angular, getSize) {
    'use strict';

    describe('getSize', function () {
        describe('Given we have a brick not selected', function() {
            var elem;
            beforeEach(inject(function ($compile, $rootScope) {
                var scope = $rootScope.$new();
                elem = $compile('<div class="masonry-brick"></div>')(scope);
            }));

            describe('When getting the size', function() {
                it('should return 252 for the width', function () {
                    var result = getSize(elem);
                    expect(result.width).toBe(252);
                });
                
                it('should return 177 for the height', function () {
                    var result = getSize(elem);
                    expect(result.height).toBe(177);
                });
            });
        });
        
        describe('Given we have a brick selected', function () {
            var elem;
            beforeEach(inject(function ($compile, $rootScope) {
                var scope = $rootScope.$new();
                elem = $compile('<div class="masonry-brick brick-selected"></div>')(scope);
                elem.offsetWidth = 100;
                elem.offsetHeight = 50;
            }));

            describe('When getting the size', function () {
                it('should return offsetWidth for the width', function () {
                    var result = getSize(elem);
                    expect(result.width).toBe(100);
                });

                it('should return offsetHeight for the height', function () {
                    var result = getSize(elem);
                    expect(result.height).toBe(50);
                });
            });
        });
        
        describe('Given we have a brick expanded', function () {
            var elem;
            beforeEach(inject(function ($compile, $rootScope) {
                var scope = $rootScope.$new();
                elem = $compile('<div class="masonry-brick brick-expanded"></div>')(scope);
                elem.offsetWidth = 100;
                elem.offsetHeight = 50;
            }));

            describe('When getting the size', function () {
                it('should return offsetWidth for the width', function () {
                    var result = getSize(elem);
                    expect(result.width).toBe(100);
                });

                it('should return offsetHeight for the height', function () {
                    var result = getSize(elem);
                    expect(result.height).toBe(50);
                });
            });
        });
    });

});


