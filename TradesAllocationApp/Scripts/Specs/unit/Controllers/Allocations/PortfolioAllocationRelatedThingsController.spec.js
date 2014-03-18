define(['App/Controllers/Allocations/PortfolioAllocationRelatedThingsController',
        'angular',
        'resource',
        'mocks',
        'route',
        'App/Controllers/controllers'
], function (PortfolioAllocationRelatedThingsController) {
    describe('PortfolioAllocationRelatedThingsController', function () {
        describe('Given we create the controller', function () {
            var controller,
                scope,
                listener,
                _TREE_GRID_RESIZE_INFO_ = 'tree-grid:resize-info';


            beforeEach(module('App.controllers'));

            beforeEach(inject(function (Portfolio) {
                spyOn(Portfolio, 'getPortfolioRelatedViews').andReturn({
                    then: function (expression) {
                        return expression([
                                            {
                                                "viewOn": {
                                                    "@type": "Economy",
                                                    "@id": "http://data.emii.com/economies/fra",
                                                    "canonicalLabel": "French Economy"
                                                },
                                                "viewHorizon": "P9M",
                                                "economicPosition": {
                                                    "@type": "EconomicPosition",
                                                    "@id": "http://data.emii.com/economic-positions/weaker",
                                                    "canonicalLabel": "Weaker"
                                                },
                                                "@type": "View",
                                                "viewConviction": {
                                                    "@type": "ViewConviction",
                                                    "@id": "http://data.emii.com/view-convictions/medium",
                                                    "canonicalLabel": "Medium"
                                                },
                                                "service": {
                                                    "@type": "Service",
                                                    "description": "Strategic investment ideas for China, Hong Kong and Taiwan along with a big picture overview of the economic and financial outlook for the greater-China region.",
                                                    "@id": "http://data.emii.com/bca/services/cis",
                                                    "canonicalLabel": "China Investment Strategy"
                                                },
                                                "horizonEndDate": "2099-02-28",
                                                "@id": "http://data.emii.com/bca/views/cis-view2",
                                                "viewType": {
                                                    "@type": "ViewType",
                                                    "@id": "http://data.emii.com/view-types/economy",
                                                    "canonicalLabel": "Economy"
                                                },
                                                "canonicalLabel": "CIS France Economy 9 months (2013/06/15) weaker(E)",
                                                "horizonStartDate": "2013-06-15",
                                                "informedByTheme": {
                                                    "@set": [
                                                        {
                                                            "@type": "Theme",
                                                            "service": {
                                                                "@type": "Service",
                                                                "@id": "http://data.emii.com/bca/servicis/cis"
                                                            },
                                                            "@id": "http://data.emii.com/bca/themes/cis-theme1",
                                                            "canonicalLabel": "LIQUIDITY NOW, GROWTH LATER"
                                                        },
                                                        {
                                                            "@type": "Theme",
                                                            "service": {
                                                                "@type": "Service",
                                                                "@id": "http://data.emii.com/bca/servicis/cis"
                                                            },
                                                            "@id": "http://data.emii.com/bca/themes/cis-theme3",
                                                            "canonicalLabel": "SHORT NATURAL GAS (2009-2012), PLAY RANGE IN 2013"
                                                        },
                                                        {
                                                            "@type": "Theme",
                                                            "service": {
                                                                "@type": "Service",
                                                                "@id": "http://data.emii.com/bca/servicis/cis"
                                                            },
                                                            "@id": "http://data.emii.com/bca/themes/cis-theme5",
                                                            "canonicalLabel": "BEARISH GRAINS, ESPECIALLY WHEAT, ONCE WEATHER NORMALIZES"
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                "viewRelativeTo": {
                                                    "@type": "EquityMarket",
                                                    "@id": "http://data.emii.com/equity-markets/jpn",
                                                    "canonicalLabel": "Japanese Equities"
                                                },
                                                "viewOn": {
                                                    "@type": "Economy",
                                                    "@id": "http://data.emii.com/economies/europe",
                                                    "canonicalLabel": "European Economy"
                                                },
                                                "viewHorizon": "P12M",
                                                "economicPosition": {
                                                    "@type": "EconomicPosition",
                                                    "@id": "http://data.emii.com/economic-positions/weaker",
                                                    "canonicalLabel": "Weaker"
                                                },
                                                "@type": "View",
                                                "viewConviction": {
                                                    "@type": "ViewConviction",
                                                    "@id": "http://data.emii.com/view-convictions/high",
                                                    "canonicalLabel": "High"
                                                },
                                                "service": {
                                                    "@type": "Service",
                                                    "description": "Strategic investment ideas for China, Hong Kong and Taiwan along with a big picture overview of the economic and financial outlook for the greater-China region.",
                                                    "@id": "http://data.emii.com/bca/services/cis",
                                                    "canonicalLabel": "China Investment Strategy"
                                                },
                                                "horizonEndDate": "2099-04-30",
                                                "@id": "http://data.emii.com/bca/views/cis-view1",
                                                "viewType": {
                                                    "@type": "ViewType",
                                                    "@id": "http://data.emii.com/view-types/relative",
                                                    "canonicalLabel": "Relative"
                                                },
                                                "canonicalLabel": "CIS Europe 12 months (2013/05/01) weaker(E)",
                                                "horizonStartDate": "2013-05-01",
                                                "informedByTheme": {
                                                    "@set": [
                                                        {
                                                            "@type": "Theme",
                                                            "service": {
                                                                "@type": "Service",
                                                                "@id": "http://data.emii.com/bca/servicis/cis"
                                                            },
                                                            "@id": "http://data.emii.com/bca/themes/cis-theme1",
                                                            "canonicalLabel": "LIQUIDITY NOW, GROWTH LATER"
                                                        },
                                                         {
                                                             "@type": "Theme",
                                                             "service": {
                                                                 "@type": "Service",
                                                                 "@id": "http://data.emii.com/bca/servicis/cis"
                                                             },
                                                             "@id": "http://data.emii.com/bca/themes/cis-theme4",
                                                             "canonicalLabel": "CONSTRUCTIVE BIAS TOWARDS COMMODITIES"
                                                         }
                                                    ]
                                                }
                                            }
                        ]);
                    }
                });

            }));

            describe('Given we open a new portfolio/allocation', function () {
                var item;
                beforeEach(inject(function ($controller, $rootScope) {
                    item = {
                        uri: 'http://data.emii.com/bca/allocation/cis-low-risk-porfolio'
                    };
                    scope = $rootScope.$new();
                    scope.row = {
                        id: 'p-1'
                    };
                    
                    listener = jasmine.createSpy('listener');
                    scope.$on(_TREE_GRID_RESIZE_INFO_, listener);

                    controller = $controller(PortfolioAllocationRelatedThingsController, { $scope: scope });
                    scope.$root.$digest();

                    scope.init(item);

                    scope.$root.$digest();
                }));

                it('should store the porfolio onto the scope', function () {
                    expect(scope.item.uri).toBe('http://data.emii.com/bca/allocation/cis-low-risk-porfolio');
                });

                it('should fetch the related views for the portfolio', inject(function (Portfolio) {
                    expect(Portfolio.getPortfolioRelatedViews).toHaveBeenCalledWith({
                        uri: 'http://data.emii.com/bca/allocation/cis-low-risk-porfolio'
                    });
                }));

                it('should load the related views', function () {
                    expect(item.relatedViews.length).toBe(2);
                });
                
                it('should load the unique related themes', function () {
                    expect(item.relatedThemes.length).toBe(4);
                    expect(item.relatedThemes[0]['@id']).toBe('http://data.emii.com/bca/themes/cis-theme1');
                    expect(item.relatedThemes[1]['@id']).toBe('http://data.emii.com/bca/themes/cis-theme3');
                    expect(item.relatedThemes[2]['@id']).toBe('http://data.emii.com/bca/themes/cis-theme5');
                    expect(item.relatedThemes[3]['@id']).toBe('http://data.emii.com/bca/themes/cis-theme4');
                });
                
                it('Should tell the TreeGrid to resize the more info section containing the related things', function () {
                    expect(listener).toHaveBeenCalled();
                });
            });

            describe('Given we open a porfolio', function () {
                describe('And the related views have already been loaded', function () {
                    var item;
                    beforeEach(inject(function ($controller, $rootScope) {
                        item = {
                            uri: 'http://data.emii.com/bca/allocation/cis-low-risk-porfolio',
                            relatedViews: []
                        };
                        scope = $rootScope.$new();
                        scope.row = {
                            id: 'p-1'
                        };
                        controller = $controller(PortfolioAllocationRelatedThingsController, { $scope: scope });
                        scope.$root.$digest();

                        scope.init(item);

                        scope.$root.$digest();
                    }));

                    it('should not fetch the related views for the portfolio', inject(function (Portfolio) {
                        expect(Portfolio.getPortfolioRelatedViews).not.toHaveBeenCalled();
                    }));
                });
            });

        });
    });
});