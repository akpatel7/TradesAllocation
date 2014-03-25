define(['angular', 'underscore', 'App/app'], function (angular, _, app) {
    'use strict';
    var tile;
    app.run(['$templateCache', function ($templateCache) {
            $templateCache.put('skinny-viewable-tile.html',
                         '<div class="brick">' +
                             '<div class="skinny-tile-header">' +
                                '<h5 class="title">' +
                                    '{{viewable.canonicalLabel}}' +
                                '</h5>' +
                                '<ul class="actions">' +
                                        '<li>' +
                                            '<a class="favourite-action" href="" ng-click="toggleFavouriteViewable($event)">' +
                                                '<i icon-multi-state="viewable.isFavouritedState" ' +
                                                    'data-on-icon="icon-star icon-star-on" data-on-hover-icon="icon-star icon-star-hover" ' +
                                                    'data-on-title="Click to remove item from favourites" ' +
                                                    'data-off-icon="icon-star icon-star-off" data-off-hover-icon="icon-star icon-star-hover"' +
                                                    'data-off-title="Click to add item to favourites" ' +
                                                    'data-half-icon="icon-star-half-empty icon-star-partial" data-half-hover-icon="icon-star icon-star-hover"' +
                                                    'data-half-title="Click to add item to favourites" ' +
                                                    '></i>' +
                                                '</a>' +
                                            '</li>' +
                                            '<li><a class="following-action" href="" ng-click="toggleFollowViewable($event)">' +
                                                '<i icon-multi-state="viewable.isFollowedState" ' +
                                                    'data-on-icon="icon-arrow-right icon-arrow-right-on" data-on-hover-icon="icon-arrow-right icon-arrow-right-hover" ' +
                                                    'data-on-title="Click to stop following market / economy" ' +
                                                    'data-off-icon="icon-arrow-right icon-arrow-right-off" data-off-hover-icon="icon-arrow-right icon-arrow-right-hover"' +
                                                    'data-off-title="Click to start following market / economy" ' +
                                                    'data-half-icon="icon-chevron-right icon-arrow-right-half" data-half-hover-icon="icon-arrow-right icon-arrow-right-hover"' +
                                                    'data-half-title="Click to start following market / economy" ' +
                                                    '></i>' +
                                            '</a>' +
                                        '</li>' +
                                    '</ul>' +
                                  '<ul class="links">' +
                                        '<li><a href="#/views?uri={{viewable[\'@id\']}}" click-tracking="DCSext.browseto" tracking-resource="{{viewable[\'@id\']}}"><i class="icon-list" title="Market" ></i></a></li>' +
                                        '<li><a href="#/research?uri={{viewable[\'@id\']}}" click-tracking="DCSext.browseto" tracking-resource="{{viewable[\'@id\']}}"><i class="icon-desktop" title="Research Page"></i></a></li>' +
                                    '</ul>' +
                                     '<div class="last-update">' +
                                        '<span class="context-label">Last applied: </span>' +
                                        '<span date="viewable.lastUpdated"></span>' +
                                    '</div>' +
                                '</div>' + 
                            '</div>'
            );
        }]);

    tile = function () {
        

        return {
            restrict: 'EA',
            scope: {
                viewable: '='
            },
            templateUrl: 'skinny-viewable-tile.html',
            controller: 'ViewableTileController'
        };

    };
    tile.$inject = [];

    return tile;
});

