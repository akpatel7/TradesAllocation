define(['underscore',
        'App/Services/NotificationsService',
        'angular',
        'mocks',
        'App/Services/services'], function(_) {
            describe('NotificationsService', function() {
                describe('Given we have a NotificationsService', function() {
                    var scope,
                        timeout;                    

                    beforeEach(function() {
                        module('App.services');
                    });

                    beforeEach(inject(function ($controller, $rootScope, $timeout) {
                        scope = $rootScope.$new();
                        timeout = $timeout;
                    }));

                    describe('When posting a success message', function() {
                        it('Should be added to the collection of messages', inject(function(Notifications) {
                            var message = 'This is a success message';
                            Notifications.success(message);
                            expect(scope.notifications[0].message).toBe(message);
                            expect(scope.notifications[0].type).toBe('success');
                            timeout.flush();
                            expect(scope.notifications[0]).toBeUndefined();
                        }));
                    });
                    
                    describe('When posting an info message', function () {
                        it('Should be added to the collection of messages', inject(function (Notifications) {
                            var message = 'This is a info message';
                            Notifications.info(message);
                            expect(scope.notifications[0].message).toBe(message);
                            expect(scope.notifications[0].type).toBe('info');
                            timeout.flush();
                            expect(scope.notifications[0]).toBeUndefined();
                        }));
                    });
                    
                    describe('When posting an error message', function () {
                        it('Should be added to the collection of messages', inject(function (Notifications) {
                            var message = 'This is a error message';
                            Notifications.error(message);
                            expect(scope.notifications[0].message).toBe(message);
                            expect(scope.notifications[0].type).toBe('error');
                            timeout.flush();
                            expect(scope.notifications[0]).toBeUndefined();
                        }));
                    });
                    
                    describe('When posting a warning message', function () {
                        it('Should be added to the collection of messages', inject(function (Notifications) {
                            var message = 'This is a warning message';
                            Notifications.warning(message);
                            expect(scope.notifications[0].message).toBe(message);
                            expect(scope.notifications[0].type).toBe('warning');
                            timeout.flush();
                            expect(scope.notifications[0]).toBeUndefined();
                        }));
                    });
                    
                    describe('When posting multiple messages', function () {
                        it('Should contain all messages', inject(function (Notifications) {
                            var infoMessage = 'This is a info message';
                            var warningMessage = 'This is a warning message';
                            Notifications.info(infoMessage);
                            Notifications.warning(warningMessage);

                            expect(scope.notifications[0].message).toBe(infoMessage);
                            expect(scope.notifications[0].type).toBe('info');
                            
                            expect(scope.notifications[1].message).toBe(warningMessage);
                            expect(scope.notifications[1].type).toBe('warning');                            

                            timeout.flush();
                            expect(scope.notifications[0]).toBeUndefined();
                        }));
                    });
                });

            });
        });