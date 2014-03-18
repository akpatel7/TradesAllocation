define(['underscore',
        'App/Services/PositionConvictionValueService',
        'angular',
        'mocks',
        'App/Services/services'], function(_) {
            describe('PositionConvictionValueService', function() {
                var scope = {};
                beforeEach(function () {
                    module('App.services');
                });
                describe('Given we have a Position / Conviction colour service', function() {
                    describe('When we want to set the position and conviction values for the current view', function () {
                        describe('And we have the subscription to see the view', function() {
                            beforeEach(inject(function(PositionConvictionValue) {
                                scope.view = {
                                    "viewHorizon": "P6M",
                                    "horizonEndDate": "2013-12-15",
                                    "viewWeighting": { canonicalLabel: "Neutral" },
                                    "service": {
                                        "@id": "http://data.emii.com/bca/services/bcah",
                                        "canonicalLabel": "BCA House"
                                    },
                                    "@id": "Dominant View ID 2",
                                    "hasPermission": true,
                                    "canonicalLabel": "European Union Equities",
                                    "horizonStartDate": "2013-06-15"
                                };
                                PositionConvictionValue.setPositionAndConvictionValues(scope);
                            }));

                            it('Should set the values correctly', function() {
                                expect(scope.convictionValue).toBe(1);
                                expect(scope.positionValue).toBe(1);
                            });
                        });
                        describe('And we do not have the subscription to see the view', function () {
                            beforeEach(inject(function (PositionConvictionValue) {
                                scope.view = {
                                    "viewHorizon": "P6M",
                                    "horizonEndDate": "2013-12-15",
                                    "viewWeighting": { canonicalLabel: "Neutral" },
                                    "service": {
                                        "@id": "http://data.emii.com/bca/services/bcah",
                                        "canonicalLabel": "BCA House"
                                    },
                                    "@id": "Dominant View ID 2",
                                    "hasPermission": false,
                                    "canonicalLabel": "European Union Equities",
                                    "horizonStartDate": "2013-06-15"
                                };
                                PositionConvictionValue.setPositionAndConvictionValues(scope);
                            }));

                            it('Should set the values correctly', function () {
                                expect(scope.convictionValue).toBe('');
                                expect(scope.positionValue).toBe('');
                            });
                        });
                    });
                });
            });
        });