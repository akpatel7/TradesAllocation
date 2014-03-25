define(['angular', 'base64'], function () {
    'use strict';

    var authorisationService = function ($httpProvider, $cookies) {
        
        return {
            getCookieValue: function() {
                return $cookies['DB'];
            },
            isAuthorised: function () {
                return this.getCookieValue() !== undefined;
            },
            setAuthorisationHeader: function() {
                $httpProvider.defaults.headers.common['Authorization'] = this.getAuthorisationToken();
            },
            getAuthorisationToken: function (encoded) {
                var token = 'ISIS realm="bcaresearch.com" token="' + this.getCookieValue() + '"';
                if (encoded === undefined || encoded === false) {
                    return token;
                }
                return btoa(token);
            }
        };
    };
    
    authorisationService.$inject = ['$http', '$cookies'];
    return authorisationService;
});