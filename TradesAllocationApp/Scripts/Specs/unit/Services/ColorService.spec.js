define(['underscore',
        'App/Services/ColorService',
        'angular',
        'mocks'], function(_) {
            describe('Color Service', function() {
                describe('Given we have a Color Service', function() {

                    beforeEach(function() {
                        module('App.services');
                    });
              
                    describe('hex2rgb', function() {
                        describe('#FED5BD', function() {
                            it('should return (254, 213, 189', inject(function(Color) {
                                var result = Color.hex2rgb('#FED5BD');
                                expect(result).toEqual({
                                    red: 254,
                                    green: 213,
                                    blue: 189
                                });
                            }));
                        });
                        
                        describe('FED5BD', function () {
                            it('should return (254, 213, 189', inject(function (Color) {
                                var result = Color.hex2rgb('FED5BD');
                                expect(result).toEqual({
                                    red: 254,
                                    green: 213,
                                    blue: 189
                                });
                            }));
                        });
                        
                        describe('FFF', function () {
                            it('should return (255, 255, 255', inject(function (Color) {
                                var result = Color.hex2rgb('FFF');
                                expect(result).toEqual({
                                    red: 255,
                                    green: 255,
                                    blue: 255
                                });
                            }));
                        });
                    });

                  
                });


            });
        });