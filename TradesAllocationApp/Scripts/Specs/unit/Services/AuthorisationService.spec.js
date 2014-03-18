define(['angular', 'mocks', 'App/Services/AuthorisationService'], function () {
            describe('AuthorisationService', function() {
                var $httpProvider,
                    $cookiesProvider,
                    authorisationServiceProvider;

                beforeEach(function() {
                    module('App');
                });

                beforeEach(inject(function ($http, $cookies, authorisationService) {
                    authorisationServiceProvider = authorisationService;
                    $httpProvider = $http;
                    $cookiesProvider = $cookies;
                    $httpProvider.defaults.headers.common['Authorization'] = undefined;
                }));

                describe('Given user is authorised', function() {
                    beforeEach(function() {
                        $cookiesProvider['DB'] = 'authorisation token';
                    });
                    it('It should result true for "isAuthorised".', function() {
                        expect(authorisationServiceProvider.isAuthorised()).toBe(true);
                    });
                    it('It should set Authorisation Header.', function () {
                        expect($httpProvider.defaults.headers.common['Authorization']).toBe(undefined);
                        authorisationServiceProvider.setAuthorisationHeader();
                        expect($httpProvider.defaults.headers.common['Authorization']).toBeDefined();
                    });
                });
                
                describe('Given user is un-authorised', function () {
                    it('It should result false for "isAuthorised".', function () {
                        expect(authorisationServiceProvider.isAuthorised()).toBe(false);
                        expect($httpProvider.defaults.headers.common['Authorization']).toBe(undefined);
                    });
                });

                describe('getAuthorisationToken', function() {
                    beforeEach(function () {
                        $cookiesProvider['DB'] = 'authorisation token';
                    });
                    it('Should return "ISIS realm="bcaresearch.com" token="authorisation token"', function () {
                        expect(authorisationServiceProvider.getAuthorisationToken()).toBe('ISIS realm="bcaresearch.com" token="authorisation token"');
                    });
                    
                    it('Should return SVNJUyByZWFsbT0iYmNhcmVzZWFyY2guY29tIiB0b2tlbj0iYXV0aG9yaXNhdGlvbiB0b2tlbiI= for encoded token', function () {
                        expect(authorisationServiceProvider.getAuthorisationToken(true)).toBe('SVNJUyByZWFsbT0iYmNhcmVzZWFyY2guY29tIiB0b2tlbj0iYXV0aG9yaXNhdGlvbiB0b2tlbiI=');
                    });
                });

            });
        });