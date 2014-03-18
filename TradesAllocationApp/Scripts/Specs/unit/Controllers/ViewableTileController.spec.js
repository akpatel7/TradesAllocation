define(['App/Controllers/AllViews/ViewableTileController',
        'underscore',
        'angular',
        'resource',
        'mocks'
], function (ViewableTileController, _) {
    describe('ViewableTileController', function () {
        describe('Given we have a viewable tile controller', function () {
            var controller,
                scope,
                fakeEvent = {
                    stopPropagation: function () {}
                };
            
            angular.module('ViewableTileController.Spec', [])
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
                module('ViewableTileController.Spec');
                module('App.services');
            });

            beforeEach(inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();

                controller = $controller(ViewableTileController, {
                    $scope: scope
                });
            }));
            
            describe('Given we have a viewable with 2 relative views and 1 absolute view', function () {
                describe('And 2 unique services', function () {
                    beforeEach(function() {
                        scope.viewable = {
                            '@type': 'Economy',
                            '@id': 'http://data.emii.com/economies/fra',
                            'canonicalLabel': 'France Economy',
                            'activeView': {
                                '@set': [
                                    {
                                        '@id': 'http://data.emii.com/view1',
                                        'viewWeighting': {},
                                        'service': {
                                            '@id': 'http://data.emii.com/bca/services/bcah',
                                            'canonicalLabel': 'BCA House'
                                        }
                                    },
                                    {
                                        '@id': 'http://data.emii.com/view2',
                                        'viewWeighting': {},
                                        'service': {
                                            '@id': 'http://data.emii.com/bca/services/bcah',
                                            'canonicalLabel': 'BCA House'
                                        }
                                    },
                                    {
                                        '@id': 'http://data.emii.com/view3',
                                        'service': {
                                            '@id': 'http://data.emii.com/bca/services/eis',
                                            'canonicalLabel': 'EIS'
                                        }
                                    }
                                ]
                            },
                            'typeLabel': 'Economy',
                            'annotationsLoaded': true
                        };
                        scope.$digest();
                    });
                    it('should have 1 absolute view', function () {
                        expect(scope.absoluteViewsCount).toBe(1);
                    });
                    it('should have 2 relative views', function () {
                        expect(scope.relativeViewsCount).toBe(2);
                    });
                    it('should have 2 services', function () {
                        expect(scope.servicesCount).toBe(2);
                    });
                });
            });

            describe('Favouriting', function () {
                describe('Given a viewable thing with a favourited view', function () {
                    beforeEach(function () {
                        scope.viewable = {
                            "@type": "Economy",
                            "@id": "http://data.emii.com/economies/fra",
                            "canonicalLabel": "France Economy",
                            "isFavourited": true,
                            "activeView": {
                                "@set": [
                                    {
                                        "isFavourited": false,
                                        "viewWeighting": {},
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/bcah",
                                            "canonicalLabel": "BCA House"
                                        }
                                    },
                                    {
                                        "isFavourited": false,
                                        "viewWeighting": {},
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/bcah",
                                            "canonicalLabel": "BCA House"
                                        }
                                    },
                                    {
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/eis",
                                            "canonicalLabel": "EIS"
                                        }
                                    },
                                    {
                                        "perspectiveId": "someid",
                                        "isFavourited": true,
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/eis",
                                            "canonicalLabel": "EIS"
                                        }
                                    }
                                ]
                            }
                        };
                        scope.$digest();
                    });

                    it('should have the favourite state "half"', function () {
                        expect(scope.viewable.isFavouritedState).toBe('half');
                    });

                    describe('When favouriting the viewable thing', function () {
                        beforeEach(function () {
                            scope.toggleFavouriteViewable(fakeEvent);
                            scope.$digest();
                        });
                        
                        it('Should favourite all child views', function () {
                            _.each(scope.viewable.activeView['@set'], function (item) {
                                expect(item.isFavourited).toBe(true);
                            });
                        });

                        it('should have the followed state "on"', function () {
                            expect(scope.viewable.isFavouritedState).toBe('on');
                        });
                    });

                    describe('When favouriting a un-favourited view', function () {
                        beforeEach(function () {
                            scope.viewable.activeView['@set'][0].isFavourited = true;
                            scope.viewable.activeView['@set'][0].perspectiveId = 'someId';
                            scope.$digest();
                        });
                        afterEach(function () {
                            scope.viewable.activeView['@set'][0].isFavourited = false;
                            scope.viewable.activeView['@set'][0].perspectiveId = undefined;
                        });

                        it('should have the favourite state "half"', function () {
                            expect(scope.viewable.isFavouritedState).toBe('half');
                        });
                    });

                    describe('When un-favouriting a favourite view', function () {
                        beforeEach(function () {
                            scope.viewable.activeView['@set'][3].isFavourited = false;
                            scope.viewable.activeView['@set'][3].perspectiveId = undefined;
                            scope.$root.$digest();
                        });
                        afterEach(function () {
                            scope.viewable.activeView['@set'][3].isFavourited = true;
                            scope.viewable.activeView['@set'][3].perspectiveId = 'someId';
                        });

                        it('the viewable should not be favourited anymore', function () {
                            expect(scope.viewable.isFavourited).toBe(false);
                        });
                        it('should have the favourite state "off"', function () {
                            expect(scope.viewable.isFavouritedState).toBe('off');
                        });
                    });

                });

                describe('Given a viewable thing with no favourited view', function () {
                    beforeEach(function () {
                        scope.viewable = {
                            "@type": "Economy",
                            "@id": "http://data.emii.com/economies/fra",
                            "canonicalLabel": "France Economy",
                            "isFavourited": false,
                            "activeView": {
                                "@set": [
                                    {
                                        "isFavourited": false,
                                        "viewWeighting": {},
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/bcah",
                                            "canonicalLabel": "BCA House"
                                        }
                                    },
                                    {
                                        "isFavourited": false,
                                        "viewWeighting": {},
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/bcah",
                                            "canonicalLabel": "BCA House"
                                        }
                                    },
                                    {
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/eis",
                                            "canonicalLabel": "EIS"
                                        }
                                    },
                                    {
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/eis",
                                            "canonicalLabel": "EIS"
                                        }
                                    }
                                ]
                            }
                        };
                        scope.$digest();
                    });

                    it('should have the favourite state "off"', function () {
                        expect(scope.viewable.isFavouritedState).toBe('off');
                    });

                    describe('When favouriting the viewable thing', function () {
                        beforeEach(function () {
                            scope.toggleFavouriteViewable(fakeEvent);
                            scope.$digest();
                        });
                        it('Should favourite all child views', function () {
                            expect(scope.viewable.activeView['@set'][0].isFavourited).toBe(true);
                            expect(scope.viewable.activeView['@set'][1].isFavourited).toBe(true);
                            expect(scope.viewable.activeView['@set'][2].isFavourited).toBe(true);
                            expect(scope.viewable.activeView['@set'][3].isFavourited).toBe(true);
                        });

                        it('should have the favourite state "on"', function () {
                            expect(scope.viewable.isFavouritedState).toBe('on');
                        });
                    });
                    
                    describe('When favouriting a view', function () {
                        beforeEach(function () {
                            scope.viewable.activeView['@set'][0].isFavourited = true;
                            scope.viewable.activeView['@set'][0].perspectiveId = 'someId';
                            scope.$digest();
                        });
                        it('viewable should be partially followed', function () {
                            expect(scope.viewable.isFavouritedState).toBe('half');
                        });
                        it('Should follow the view', function () {
                            expect(scope.viewable.activeView['@set'][0].isFavourited).toBe(true);
                        });
                    });

                });

                describe('Given a favourited viewable thing with no favourite view', function () {
                    beforeEach(function () {
                        scope.viewable = {
                            "@type": "Economy",
                            "@id": "http://data.emii.com/economies/fra",
                            "canonicalLabel": "France Economy",
                            "isFavourited": true,
                            "perspectiveId": "someId",
                            "activeView": {
                                "@set": [
                                    {
                                        "isFavourited": true,
                                        "viewWeighting": {},
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/bcah",
                                            "canonicalLabel": "BCA House"
                                        }
                                    },
                                    {
                                        "isFavourited": true,
                                        "viewWeighting": {},
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/bcah",
                                            "canonicalLabel": "BCA House"
                                        }
                                    },
                                    {
                                        "isFavourited": true,
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/eis",
                                            "canonicalLabel": "EIS"
                                        }
                                    },
                                    {
                                        "isFavourited": true,
                                        "service": {
                                            "@id": "http://data.emii.com/bca/services/eis",
                                            "canonicalLabel": "EIS"
                                        }
                                    }
                                ]
                            }
                        };
                        scope.$digest();
                    });

                    it('should have the favourite state "on"', function () {
                        expect(scope.viewable.isFavouritedState).toBe('on');
                    });

                    describe('When un-favouriting the viewable thing', function () {
                        beforeEach(function () {
                            scope.toggleFavouriteViewable(fakeEvent);
                            scope.$digest();
                        });
                        it('Should favourite all child views', function () {
                            expect(scope.viewable.activeView['@set'][0].isFavourited).toBe(false);
                            expect(scope.viewable.activeView['@set'][1].isFavourited).toBe(false);
                            expect(scope.viewable.activeView['@set'][2].isFavourited).toBe(false);
                            expect(scope.viewable.activeView['@set'][3].isFavourited).toBe(false);
                        });

                        it('should have the favourite state "off"', function () {
                            expect(scope.viewable.isFavouritedState).toBe('off');
                        });
                    });

                });

            });

            describe('Following', function () {
                describe('Given a viewable thing with a followed view', function () {
                    beforeEach(function () {
                        scope.viewable = {
                            '@type': 'Economy',
                            '@id': 'http://data.emii.com/economies/fra',
                            'canonicalLabel': 'France Economy',
                            'isFollowed': true,
                            'activeView': {
                                '@set': [
                                    {
                                        '@id': 'http://data.emii.com/view1',
                                        'isFollowed': false,
                                        'viewWeighting': {},
                                        'service': {
                                            '@id': 'http://data.emii.com/bca/services/bcah',
                                            'canonicalLabel': 'BCA House'
                                        }
                                    },
                                    {
                                        '@id': 'http://data.emii.com/view2',
                                        'isFollowed': false,
                                        'viewWeighting': {},
                                        'service': {
                                            '@id': 'http://data.emii.com/bca/services/bcah',
                                            'canonicalLabel': 'BCA House'
                                        }
                                    },
                                    {
                                        '@id': 'http://data.emii.com/view3',
                                        'service': {
                                            '@id': 'http://data.emii.com/bca/services/eis',
                                            'canonicalLabel': 'EIS'
                                        }
                                    },
                                    {
                                        '@id': 'http://data.emii.com/view4',
                                        'followPerspectiveId': 'someid',
                                        'isFollowed': true,
                                        'service': {
                                            '@id': 'http://data.emii.com/bca/services/eis',
                                            'canonicalLabel': 'EIS'
                                        }
                                    }
                                ]                                
                            },
                            'annotationsLoaded': true
                        };
                        scope.$digest();
                    });

                    it('should have the followed state "half"', function () {                       
                        expect(scope.viewable.isFollowedState).toBe('half');
                    });

                    describe('When following the viewable thing', function () {
                        beforeEach(function () {
                            scope.toggleFollowViewable(fakeEvent);
                            scope.$digest();
                        });
                        it('Should follow all child views', function () {
                            _.each(scope.viewable.activeView['@set'], function (item) {
                                expect(item.isFollowed).toBe(true);
                            });
                        });

                        it('should have the followed state "on"', function () {
                            expect(scope.viewable.isFollowedState).toBe('on');
                        });
                    });

                    describe('When following a unfollowed view', function () {
                        beforeEach(function () {
                            scope.viewable.activeView['@set'][0].isFollowed = true;
                            scope.viewable.activeView['@set'][0].followPerspectiveId = 'someId';
                            scope.$digest();
                        });
                        afterEach(function () {
                            scope.viewable.activeView['@set'][0].isFollowed = false;
                            scope.viewable.activeView['@set'][0].followPerspectiveId = undefined;
                        });

                        it('should have the followed state "half"', function () {
                            expect(scope.viewable.isFollowedState).toBe('half');
                        });
                    });

                    describe('When un-following a followed view', function () {
                        beforeEach(function () {
                            scope.viewable.activeView['@set'][3].isFollowed = false;
                            scope.viewable.activeView['@set'][3].followPerspectiveId = undefined;
                            scope.$root.$digest();
                        });
                        afterEach(function () {
                            scope.viewable.activeView['@set'][3].isFollowed = true;
                            scope.viewable.activeView['@set'][3].followPerspectiveId = 'someId';
                        });

                        it('the viewable should not be followed anymore', function () {
                            expect(scope.viewable.isFollowed).toBe(false);
                        });
                        it('should have the followed state "off"', function () {
                            expect(scope.viewable.isFollowedState).toBe('off');
                        });
                    });

                });

                describe('Given a viewable thing with no followed view', function () {
                    beforeEach(function () {
                        scope.viewable = {
                            '@type': 'Economy',
                            '@id': 'http://data.emii.com/economies/fra',
                            'canonicalLabel': 'France Economy',
                            'isFollowed': false,
                            'activeView': {
                                '@set': [
                                    {
                                        '@id': 'http://data.emii.com/view1',
                                        'isFollowed': false,
                                        'viewWeighting': {},
                                        'service': {
                                            '@id': 'http://data.emii.com/bca/services/bcah',
                                            'canonicalLabel': 'BCA House'
                                        }
                                    },
                                    {
                                        '@id': 'http://data.emii.com/view2',
                                        'isFollowed': false,
                                        'viewWeighting': {},
                                        'service': {
                                            '@id': 'http://data.emii.com/bca/services/bcah',
                                            'canonicalLabel': 'BCA House'
                                        }
                                    },
                                    {
                                        '@id': 'http://data.emii.com/view3',
                                        'service': {
                                            '@id': 'http://data.emii.com/bca/services/eis',
                                            'canonicalLabel': 'EIS'
                                        }
                                    },
                                    {
                                        '@id': 'http://data.emii.com/view4',
                                        'service': {
                                            '@id': 'http://data.emii.com/bca/services/eis',
                                            'canonicalLabel': 'EIS'
                                        }
                                    }
                                ]
                            },
                            'annotationsLoaded': true
                        };
                        scope.$digest();
                    });

                    it('should have the followed state "off"', function () {
                        expect(scope.viewable.isFollowedState).toBe('off');
                    });

                    describe('When following the viewable thing', function () {
                        beforeEach(function () {
                            scope.toggleFollowViewable(fakeEvent);
                            scope.$digest();
                        });
                        it('Should follow all child views', function () {
                            expect(scope.viewable.activeView['@set'][0].isFollowed).toBe(true);
                            expect(scope.viewable.activeView['@set'][1].isFollowed).toBe(true);
                            expect(scope.viewable.activeView['@set'][2].isFollowed).toBe(true);
                            expect(scope.viewable.activeView['@set'][3].isFollowed).toBe(true);
                        });

                        it('should have the followed state "on"', function () {
                            expect(scope.viewable.isFollowedState).toBe('on');
                        });
                    });

                    describe('When following a view', function () {
                        beforeEach(function() {
                            scope.viewable.activeView['@set'][0].isFollowed = true;
                            scope.viewable.activeView['@set'][0].followPerspectiveId = 'someId';
                            scope.$digest();
                        });
                        it('viewable should be partially followed', function () {
                            expect(scope.viewable.isFollowedState).toBe('half');
                        });
                        it('Should follow the view', function () {
                            expect(scope.viewable.activeView['@set'][0].isFollowed).toBe(true);
                        });
                    });

                });

                describe('Given a followed viewable thing with no followed view', function () {
                    beforeEach(function () {
                        scope.viewable = {
                            '@type': 'Economy',
                            '@id': 'http://data.emii.com/economies/fra',
                            'canonicalLabel': 'France Economy',
                            'isFollowed': true,
                            'followPerspectiveId': 'someId',
                            'activeView': {
                                '@set': [
                                    {
                                        '@id': 'http://data.emii.com/view1',
                                        'isFollowed': true,
                                        'viewWeighting': {},
                                        'service': {
                                            '@id': 'http://data.emii.com/bca/services/bcah',
                                            'canonicalLabel': 'BCA House'
                                        }
                                    },
                                    {
                                        '@id': 'http://data.emii.com/view2',
                                        'isFollowed': true,
                                        'viewWeighting': {},
                                        'service': {
                                            '@id': 'http://data.emii.com/bca/services/bcah',
                                            'canonicalLabel': 'BCA House'
                                        }
                                    },
                                    {
                                        '@id': 'http://data.emii.com/view3',
                                        'isFollowed': true,
                                        'service': {
                                            '@id': 'http://data.emii.com/bca/services/eis',
                                            'canonicalLabel': 'EIS'
                                        }
                                    },
                                    {
                                        '@id': 'http://data.emii.com/view4',
                                        'isFollowed': true,
                                        'service': {
                                            '@id': 'http://data.emii.com/bca/services/eis',
                                            'canonicalLabel': 'EIS'
                                        }
                                    }
                                ]
                            },
                            'annotationsLoaded': true
                        };
                        scope.$digest();
                    });

                    it('should have the followed state "on"', function () {
                        expect(scope.viewable.isFollowedState).toBe('on');
                    });

                    describe('When un-following the viewable thing', function () {
                        beforeEach(function () {
                            scope.toggleFollowViewable(fakeEvent);
                            scope.$digest();
                        });
                        it('Should follow all child views', function () {
                            expect(scope.viewable.activeView['@set'][0].isFollowed).toBe(false);
                            expect(scope.viewable.activeView['@set'][1].isFollowed).toBe(false);
                            expect(scope.viewable.activeView['@set'][2].isFollowed).toBe(false);
                            expect(scope.viewable.activeView['@set'][3].isFollowed).toBe(false);
                        });

                        it('should have the followed state "off"', function () {
                            expect(scope.viewable.isFollowedState).toBe('off');
                        });
                    });

                });
            });
           
        });
    });
});