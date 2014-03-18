define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var ResearchThemesController = function ($scope, Themes, Annotations, HouseViewServiceUri, UrlProvider) {

        $scope.themes = [];
        var allThemes = [], allAnnotations = [];

        function mergeThemesAndAnnotations() {
            if (allThemes.length && allAnnotations.length) {
                _.each(allThemes, function (theme) {
                    var annotations = _.filter(allAnnotations, function (a) {
                        return a.hasPermission && (a.references['@id'] === theme['@id'] ||
                                (theme.childTheme && _.some(theme.childTheme['@set'], function (ct) { return a.references['@id'] === ct['@id']; })));
                    });

                    _.sortBy(annotations, function (a) {
                        return a.annotationFor.published + '_' + a['@id'];
                    });

                    annotations.reverse();
                    theme.annotations = annotations;
                });
            }
        }

        $scope.showMore = function() {
            $scope.pagesShown++;

            var themes = allThemes, countToDisplay = $scope.pageSize * $scope.pagesShown;

            if (themes.length) {
                if ($scope.showAuthorisedContentOnly) {
                    themes = _.filter(themes, function(theme) {
                        return theme.hasPermission &&
                        (!theme.childTheme || !theme.childTheme['@set'] || !theme.childTheme['@set'].length ||
                            _.some(theme.childTheme['@set'], function(ct) { return ct.hasPermission; }));
                    });
                }

                themes = _.sortBy(themes, function(t) { return (t.lastApplied || '0000-00-00') + '_' + t['@id']; });
                themes.reverse();

                $scope.themes = _.first(themes, countToDisplay);
                $scope.canShowMore = themes.length > countToDisplay;
            } else {
                $scope.themes = [];
                $scope.canShowMore = false;
            }
        };

        $scope.$watch('viewable', function (viewable) {
            allThemes = [];
            allAnnotations = [];
            $scope.themes = [];
            $scope.canShowMore = false;
            $scope.loaded = false;

            if (!viewable) {
                return;
            }

            if (!viewable.activeView) {
                $scope.loaded = true;
                return;
            }

            var views = viewable.activeView['@set'] ? viewable.activeView['@set'] : [viewable.activeView];

            var themes = _.compact(_.flatten(_.map(views, function(v) {
                return v.informedByTheme ? (v.informedByTheme['@set'] ? v.informedByTheme['@set'] : [v.informedByTheme]) : null;
            })));

            var themeUris = _.uniq(_.pluck(themes, '@id')), outstandingThemeCount = themeUris.length;

            $scope.loaded = themeUris.length === 0;

            _.each(themeUris, function (themeUri) {
                Themes.getThemes({ 'filters': { 'uri': { 'value': themeUri } } }).then(function (data) {
                    if (data && data['@graph']) {
                        var theme = data['@graph'][0];

                        theme.marketsCount = Themes.calculateMarketsCount(theme);

                        var services = [theme.service];

                        if (theme.childTheme && theme.childTheme['@set']) {
                            services = _.union(services, _.map(theme.childTheme['@set'], function (ct) {
                                return ct.service;
                            }));

                            services = _.uniq(_.sortBy(services, '@id'), true, function (s) { return s['@id']; });
                        }
                        services = _.filter(services, function (s) { return s['@id'] !== HouseViewServiceUri; });

                        theme.services = services;
                        theme.url = "/#/themes?uri=" + encodeURIComponent(theme['@id']);

                        allThemes.push(theme);
                        allThemes = _.uniq(allThemes, false, function(t) { return t['@id']; });

                        $scope.pagesShown = 0;
                        $scope.showMore();
                        $scope.loaded = true;
                    }

                    outstandingThemeCount--;

                    if (!outstandingThemeCount) {
                        var parentAndChildThemes = _.union(allThemes, _.compact(_.flatten(_.map(allThemes, function (t) { return t.childTheme ? t.childTheme['@set'] : null; }))));

                        Annotations.getAnnotations({
                            conceptUri: _.uniq(_.pluck(parentAndChildThemes, '@id')),
                            noGrouping: true
                        }).then(function (annotations) {
                            allAnnotations = annotations;
                            _.each(annotations, function (annotation) {
                                var annotationFor = annotation.annotationFor;
                                if (annotationFor) {
                                    annotation.liveReportUrl = UrlProvider.getLiveReportUrl(annotationFor['@id']);
                                    UrlProvider.getReportUrl(annotationFor['@id'])
                                        .then(function (url) {
                                            annotation.reportUrl = url;
                                        });
                                }
                            });
                            mergeThemesAndAnnotations();
                        });
                    }
                });
            });


        });

        $scope.$watch('showAuthorisedContentOnly', function () {
            $scope.pagesShown = 0;
            $scope.showMore();
        });
    };
    ResearchThemesController.$inject = ['$scope', 'Themes', 'Annotations', 'HouseViewServiceUri', 'UrlProvider'];

    return ResearchThemesController;
});