define(['angular', 'mocks', 'App/Directives/Searchbox'], function () {
    'use strict';

    describe('Searchbox directive', function () {
        var scope,
            element;

        beforeEach(module('App'));
        beforeEach(inject(function ($rootScope, $compile, $templateCache) {
            $templateCache.put("template/typeahead/typeahead-popup.html", "<div></div>");
            scope = $rootScope.$new();
            element = $compile('<div searchbox placeholder="Search more content" type="http://data.emii.com/ontologies/bca/ViewableThing"></div>')(scope);
            scope.$root.$digest();
        }));

        it('should have the placeholder "Search more content"', function () {
            expect(element.find('input').attr('placeholder')).toEqual('Search more content');
        });
     

        describe('When getting suggestions', function () {
            it('should call the suggest api', inject(function (Suggest) {
                spyOn(Suggest, 'suggest').andCallFake(function () {
                    return {
                        then: function () {
                        }
                    };
                });
                
                element.isolateScope().getSuggestedItems('America');
                expect(Suggest.suggest).toHaveBeenCalledWith({
                    q: 'America',
                    type: 'http://data.emii.com/ontologies/bca/ViewableThing'
                });
            }));
        });

        describe('When selecting a viewable suggestion', function () {
            beforeEach(function() {
                var item = {
                    '@id': 'http://data.emii.com/bca/economy/usa'
                };
                element.isolateScope().selectSuggestedItem(item);
            });
            it('should redirect the user to the views page', inject(function ($location) {
              
                expect($location.$$search).toEqual({
                    uri: 'http://data.emii.com/bca/economy/usa'
                });
            }));
        });
    });
});


