define(['underscore',
        'angular',
        'mocks',
        'jquery',
        'App/Directives/SkinnyViewableTile'], function(_) {
            'use strict';

            describe('Skinny Viewable Tile directive', function() {
                var scope,
                    element;
                
                angular.module('SkinnyViewableTile.Spec', [])
                     .service('Perspectives', ['$q', function ($q) {
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
                     }])
                    .service('PerspectiveBuilder', ['$q', function ($q) {
                        return {
                            buildViewablePerspective: function () {
                                var deferred = $q.defer();
                                deferred.resolve({});
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
                    module('SkinnyViewableTile.Spec');
                });


                describe('Given a viewable', function() {
                    beforeEach(inject(function($rootScope, $compile) {
                        scope = $rootScope;

                        scope.viewable = {
                            '@id': 'http://data.emii.com/currency-pairs/usd-hkd',
                            canonicalLabel: 'USD/HKD',
                            lastUpdated: '2013-08-17'
                        };
                        element = $compile('<div skinny-viewable-tile viewable="viewable"></div>')(scope);
                       
                    }));

                    describe('When rendering the tile', function() {
                        it('Should render the information in the tile', function() {
                            scope.$digest();
                            expect(element.find('.title').text().trim()).toBe('USD/HKD');
                            expect(element.find('.last-update').text().trim()).toBe('Last applied: 17 Aug 2013');
                        });
                    });
                    
                    describe('Given the viewable is favourited', function () {
                        beforeEach(function() {
                            scope.viewable = {
                                "isFavourited": true,
                                "perspectiveId": "someId"
                            };
                            scope.$digest();
                        });
                        it('Should have the favourite star selected', function () {
                            expect(element.find('.favourite-action i').hasClass('icon-star-on')).toBe(true);
                        });

                        describe('When unfavouriting the viewable', function () {
                            beforeEach(function () {
                                element.find('.favourite-action').trigger('click');
                                scope.$digest();
                            });
                            it('should be unfavourited', function() {
                                expect(element.find('.favourite-action i').hasClass('icon-star-on')).toBe(false);
                                expect(element.find('.favourite-action i').hasClass('icon-star-partial')).toBe(false);
                            });
                        });
                    });

                    describe('Given the viewable is partially favourited', function () {
                        it('Should have the favourite star selected', function () {
                            scope.viewable = {
                                "isFavourited": true
                            };
                            scope.$digest();
                            expect(element.find('.favourite-action > i').hasClass('icon-star-partial')).toBe(true);
                            expect(scope.viewable.isFavouritedState).toBe('half');
                        });
                    });
                });

              
            });
        });


