define(['App/Controllers/Alerts/AlertNotificationsController',
        'underscore',
        'angular',
        'resource',
        'mocks',
        'App/Controllers/controllers'], function (AlertNotificationsController) {
            describe('Alert Notifications Controller', function () {
                describe('Given we have a alert notifications controller', function () {
                    var controller,
                        scope,
                        getAlertsCalledCount = 0;


                    angular.module('AlertHistoryController.Spec.Config', []).service('redirectService', function () {
                        return {
                            redirectToLoginPage: function () { },
                            forbidden: function () { },
                            unauthorised: function () { },
                            redirectTo: function () {}
                        };
                    })
                        .service('config', function () {
                            return {
                                reportsBaseUrl: 'http://reports.com'
                            };
                        });

                    beforeEach(function () {
                        module('App');
                        module('AlertHistoryController.Spec.Config');
                    });

                    beforeEach(inject(function ($rootScope, $controller, Alerts) {
                        spyOn(Alerts, 'getAlerts').andReturn({
                            then: function (expression) {
                                getAlertsCalledCount++;
                                return expression([
                                    {
                                        'Timestamp': '2013-11-06T13:52:15.45',
                                        'Originator': null,
                                        'Description': 'Commodity & Energy Strategy: China Economy has created a new strategic view. Click here to view.',
                                        'ResourceLink': 'http://data.emii.com/bca/views/create-conflict',
                                        'Id': 30,
                                        'UserId': 'rohit.modi',
                                        'UserReadTimestamp': '2013-11-06T13:53:00.2',
                                        'ProcessedTimestamp': '2013-11-06T13:53:00.2',
                                        'ViewableResourceLink': 'http://dashboard.delphidev.euromoneydigital.com/#/views?uri=http%3a%2f%2fdata.emii.com%2feconomies%2fchn'
                                    },
                                    {
                                        'Timestamp': '2013-11-06T13:52:17.633',
                                        'Originator': null,
                                        'Description': 'Commodity & Energy Strategy: China Economy is creating a conflict. Click here to view.',
                                        'ResourceLink': 'http://data.emii.com/bca/views/create-conflict',
                                        'Id': 31,
                                        'UserId': 'rohit.modi',
                                        'ProcessedTimestamp': '2013-11-06T13:53:00.2',
                                        'UserReadTimestamp': null,
                                        'ViewableResourceLink': 'http://dashboard.delphidev.euromoneydigital.com/#/views?uri=http%3a%2f%2fdata.emii.com%2feconomies%2fchn'
                                    },
                                    {
                                        'Timestamp': '2013-11-06T14:02:15.72',
                                        'Originator': null,
                                        'Description': 'Commodity & Energy Strategy: view on China Economy has recently been updated. Click here to view.',
                                        'ResourceLink': 'http://data.emii.com/bca/views/create-conflict-e1',
                                        'Id': 32,
                                        'UserId': 'rohit.modi',
                                        'ProcessedTimestamp': null,
                                        'ViewableResourceLink': 'http://dashboard.delphidev.euromoneydigital.com/#/views?uri=http%3a%2f%2fdata.emii.com%2feconomies%2fchn'
                                    }
                                ]);
                            }
                        });

                        scope = $rootScope.$new();
                        jasmine.Clock.useMock();
                        controller = $controller(AlertNotificationsController, {
                            $scope: scope
                        });
                        scope.$digest();

                    }));

                    afterEach(function() {
                        getAlertsCalledCount = 0;
                    });
                    
                    describe('', function() {
                        it('should load 11 alerts', inject(function (Alerts) {
                            expect(Alerts.getAlerts).toHaveBeenCalledWith({
                                page: 0,
                                pageSize: 11
                            });
                        }));

                        it('should have 3 notifications', function () {
                            expect(scope.notifications.length).toBe(3);
                        });

                        it('should have 1 unseen notifications', function () {
                            expect(scope.unreadNotificationsCount).toBe(1);
                        });
                        
                        it('should have settings and history links set-up.', function () {
                            expect(scope.alertSettingsUrl).toBe('http://reports.com/#/alerts/settings');
                            expect(scope.alertHistoryUrl).toBe('http://reports.com/#/alerts/history');
                        });

                        it('alerts should be loaded every 5 minutes', function () {
                            expect(getAlertsCalledCount).toEqual(1);
                            jasmine.Clock.tick(299999);
                            expect(getAlertsCalledCount).toEqual(1);
                            jasmine.Clock.tick(1);
                            expect(getAlertsCalledCount).toEqual(2);
                        });
                    });

                    describe('When opening the notification popover', function() {
                        it('should mark all the notifications as read', inject(function(Alerts) {
                            spyOn(Alerts, 'markAllAlertsAsRead').andReturn({
                                then: function(expression) {
                                    return expression({});
                                }
                            });
                            scope.openAlerts();
                            expect(Alerts.markAllAlertsAsRead).toHaveBeenCalled();
                        }));
                    });

                    describe('When opening the notification', function () {
                        describe('And the notification is unread', function() {
                            it('should mark the notification as fully read', inject(function(Alerts) {
                                spyOn(Alerts, 'markAlertsAsFullyRead').andReturn({});
                                scope.openNotification(scope.notifications[1]);
                                expect(Alerts.markAlertsAsFullyRead).toHaveBeenCalledWith([31]);
                                expect(typeof scope.notifications[1].UserReadTimestamp).toBe('object');
                            }));
                        });
                       
                        describe('And the notification is already read', function () {
                            it('should not mark the notification as fully read', inject(function (Alerts) {
                                spyOn(Alerts, 'markAlertsAsFullyRead').andReturn({});
                                scope.openNotification(scope.notifications[0]);
                                expect(Alerts.markAlertsAsFullyRead).not.toHaveBeenCalled();
                            }));
                        });
                        
                        it('should redirect to the resource page', inject(function (redirectService) {
                            spyOn(redirectService, 'redirectTo').andReturn({});
                            scope.openNotification({
                                Id: 1,
                                ViewableResourceLink: 'http://localhost/#views?uri=viewableUri'
                            });
                            expect(redirectService.redirectTo).toHaveBeenCalledWith('http://localhost/#views?uri=viewableUri');
                        }));
                    });

                    describe('When marking all the notifications as read', function() {
                        it('should mark unread notification as read', inject(function (Alerts) {
                            spyOn(Alerts, 'markAllAlertsAsFullyRead').andReturn({
                                then: function(expression) {
                                    return expression(true);
                                }
                            });
                            scope.markAllAsRead();
                            expect(Alerts.markAllAlertsAsFullyRead).toHaveBeenCalled();
                        }));
                    });
                });

            });
        }); 

