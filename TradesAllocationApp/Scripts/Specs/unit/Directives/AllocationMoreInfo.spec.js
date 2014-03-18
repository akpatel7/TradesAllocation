define(['underscore',
        'angular',
        'mocks',
        'jquery',
        'App/Directives/ViewTile'], function(_) {
            'use strict';

            describe('View Tile directive', function() {
                var scope,
                    element;
                
               

                beforeEach(function () {
                    module('App');
                });


                describe('Given a row', function() {
                    beforeEach(inject(function($rootScope, $compile, $httpBackend) {
                        scope = $rootScope;

                        scope.row = {
                            originalId: 2,
                            Uri: 'http://data.emii.combca/allocations/1',
                            isPortfolio: false
                        };
                        
                        $httpBackend.expectGET('/Templates/Allocations/RelatedReports.html')
                            .respond('');

                        element = $compile('<div allocation-more-info row="row" ></div>')(scope);
                        scope.$digest();
                    }));

                    it('research should be active', function () {                        
                        expect($(element.find('li')[0]).hasClass('active')).toBe(true);
                    });

                    it('should store the row information in the item object', function() {
                        expect(scope.item).toEqual({
                            id: 2,
                            uri: 'http://data.emii.combca/allocations/1',
                            performanceType: 'a',
                            isInformationOpen: true,
                            isPortfolio: false
                        });
                    });
                    describe('When rendering the tile', function() {
                        it('Should render 7 tabs', function() {
                            expect(element.find('.nav-tabs li').length).toBe(7);
                        });                        
                    });

                    describe('When selecting Themes', function() {
                        it('themes should be active', inject(function ($httpBackend) {
                            $httpBackend.expectGET('/Templates/Allocations/RelatedThemes.html')
                                .respond('');
                            $(element.find('li a')[1]).trigger('click');
                            expect($(element.find('li')[1]).hasClass('active')).toBe(true);
                        }));
                    });
                    
                    describe('When selecting Views', function () {
                        it('views should be active', inject(function ($httpBackend) {
                            $httpBackend.expectGET('/Templates/Allocations/RelatedViews.html')
                                .respond('');
                            $(element.find('li a')[2]).trigger('click');
                            expect($(element.find('li')[2]).hasClass('active')).toBe(true);
                        }));
                    });
                    
                    describe('When selecting Comments', function () {
                        it('Comments should be active', inject(function ($httpBackend) {
                            $httpBackend.expectGET('/Templates/Allocations/Comments.html')
                                .respond('');
                            $(element.find('li a')[4]).trigger('click');
                            expect($(element.find('li')[4]).hasClass('active')).toBe(true);
                        }));
                    });
                });

              
            });
        });


