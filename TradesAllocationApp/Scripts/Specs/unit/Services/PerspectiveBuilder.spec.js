define(['underscore',
        'angular',
        'mocks',
        'App/Services/services'], function (_) {

            function promiseOf(stubResult) {
                return {
                    then: function(callback) {
                        return promiseOf(callback(stubResult));
                    }
                };
            }
            
            describe('PerspectiveBuilder', function () {
                describe('Given we have a Perspective Builder', function () {
                    var expectedData,
                        id = 'someid',
                        templatedEndpointUrl = 'http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/sometemplatedurlwithidonend/' + id;

                    angular.module('PerspectivesBulder.spec', []).service('DataEndpoint', ['$q', function ($q) {
                        return {
                            internaliseApiUrl: function(url) {
                                return url;
                            },
                            externaliseApiUrl: function (url) {
                                return url;
                            },
                            getTemplatedEndpoint: function () {
                                return promiseOf(templatedEndpointUrl);
                            }
                        };
                    }]);

                    beforeEach(function () {
                        module('App');
                        module('PerspectivesBulder.spec');
                    });

                    beforeEach(function () {
                        this.addMatchers({
                            toEqualData: function (expected) {
                                return angular.equals(this.actual, expected);
                            }
                        });
                    });
                    
                    describe('When building a Viewable Perspective', function () {                        
                        
                        it('Should return the correctly formatted data', inject(function (PerspectiveBuilder, $rootScope) {
                            expectedData = {
                                'viewable-perspective': {
                                    'link': {
                                        '_rel': 'viewable',
                                        '_href': 'http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/sometemplatedurlwithidonend/' + id
                                    },
                                    'container-type': 'bookmark',
                                    'related-resource-type': 'viewable'
                                }
                            };

                            PerspectiveBuilder.buildViewablePerspective('bookmark', id).then(function (response) {
                                expect(response).toEqualData(expectedData);
                            });

                            $rootScope.$digest();
                        }));
                    });
                    
                    describe('When building a View Perspective', function () {
                        
                        it('Should return the correctly formatted data', inject(function (PerspectiveBuilder, $rootScope) {
                            expectedData = {
                                'view-perspective': {
                                    'link': {
                                        '_rel': 'view',
                                        '_href': 'http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/sometemplatedurlwithidonend/' + id
                                    },
                                    'viewable-uri': 'http://someviewable/id',
                                    'container-type': 'bookmark',
                                    'related-resource-type': 'view'
                                }
                            };

                            PerspectiveBuilder.buildViewPerspective('bookmark', id, 'http://someviewable/id').then(function (response) {
                                expect(response).toEqualData(expectedData);
                            });
                            
                            $rootScope.$digest();
                        }));                        
                    });
                    
                    describe('When building a Trade Perspective', function () {

                        it('Should return the correctly formatted data', inject(function (PerspectiveBuilder, $rootScope) {
                            expectedData = {
                                'trade-perspective': {
                                    'link': {
                                        '_rel': 'trade',
                                        '_href': 'http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/sometemplatedurlwithidonend/' + id
                                    },
                                    'trade-id': id,
                                    'container-type': 'bookmark',
                                    'related-resource-type': 'trade'
                                }
                            };

                            PerspectiveBuilder.buildTradePerspective('bookmark', id).then(function (response) {
                                expect(response).toEqualData(expectedData);
                            });

                            $rootScope.$digest();
                        }));
                    });
                    
                    describe('When building a Tradable thing Perspective', function () {

                        it('Should return the correctly formatted data', inject(function (PerspectiveBuilder, $rootScope) {
                            expectedData = {
                                'tradablething-perspective': {
                                    'link': {
                                        '_rel': 'tradablething',
                                        '_href': 'http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/sometemplatedurlwithidonend/' + id
                                    },
                                    'container-type': 'bookmark',
                                    'related-resource-type': 'tradablething'
                                }
                            };

                            PerspectiveBuilder.buildTradableThingPerspective('bookmark', id).then(function (response) {
                                expect(response).toEqualData(expectedData);
                            });

                            $rootScope.$digest();
                        }));
                    });

                    describe('When building a Portfolio Perspective', function () {

                        it('Should return the correctly formatted data', inject(function (PerspectiveBuilder, $rootScope) {
                            expectedData = {
                                'portfolio-perspective': {
                                    'link': {
                                        '_rel': 'portfolio',
                                        '_href': 'http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/sometemplatedurlwithidonend/' + id
                                    },
                                    'container-type': 'follow',
                                    'related-resource-type': 'portfolio'
                                }
                            };

                            PerspectiveBuilder.buildPortfolioPerspective('follow', id).then(function (response) {
                                expect(response).toEqualData(expectedData);
                            });

                            $rootScope.$digest();
                        }));
                    });


                    describe('When building an Allocation Perspective', function () {

                        it('Should return the correctly formatted data', inject(function (PerspectiveBuilder, $rootScope) {
                            expectedData = {
                                'allocation-perspective': {
                                    'link': {
                                        '_rel': 'allocation',
                                        '_href': 'http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/sometemplatedurlwithidonend/' + id
                                    },
                                    'container-type': 'follow',
                                    'related-resource-type': 'allocation'
                                }
                            };

                            PerspectiveBuilder.buildAllocationPerspective('follow', id).then(function (response) {
                                expect(response).toEqualData(expectedData);
                            });

                            $rootScope.$digest();
                        }));
                    });
                    
                    describe('When building any old perspective', function() {
                        it('Should return the correctly formatted data', inject(function (PerspectiveBuilder) {
                            expectedData = {
                                'blah-perspective': {
                                    'link': {
                                        '_rel': 'blah',
                                        '_href': 'http://isis.delphidev.euromoneydigital.com/Euromoney.Isis.Api/sometemplatedurlwithidonend/' + id
                                    },
                                    'container-type': 'bookmark',
                                    'related-resource-type': 'blah'
                                }
                            };

                            PerspectiveBuilder.buildPerspective('blah', 'bookmark', id, 'http://someviewable/id')
                                .then(function (response) {
                                    expect(response).toEqualData(expectedData);
                            });
                        }));
                    });
                });
            });
        });