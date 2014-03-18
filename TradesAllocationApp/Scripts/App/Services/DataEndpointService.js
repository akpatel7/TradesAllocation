define(['angular', 'underscore'], function(angular, _) {
    'use strict';

    var service = function ($resource, $q, config) {
        var endpoints,
            rootResource = $resource(config.clientServicePath + '\\/'), // Escaped trailing slash is a hack for an AngularJS bug where ng-Resource removes trailing slashes
            resourceCache = [],
            regularExpression = new RegExp('^ *https?://[\\w-.]+(.com|.internal)(/euromoney.isis.api|/isis|)', 'gi');
        
        function internaliseApiUrl(url) {
            return url.replace(regularExpression, config.clientServicePath);
        }
        
        function externaliseApiUrl(url) {
            return url.replace(regularExpression, config.isisRootApi);
        }

        function followEndpoint(url, isArray) {
            var deferred = $q.defer();

            var followEndpointRedirect = function(endpointUrl) {
                $resource(endpointUrl, {}, {
                    get: {
                        method: 'GET',
                        isArray: isArray
                    }
                }).get({}, function(data, getResponseHeaders) {
                        var headers = getResponseHeaders();
                        if (headers.location) {
                            followEndpointRedirect(internaliseApiUrl(headers.location));
                        } else {
                            deferred.resolve(data);
                        }
                    });
            };

            followEndpointRedirect(url);

            return deferred.promise;
        }

        return {
            _findLink: function (name, links) {
                var link = _.isArray(links) ? _.find(links, function(item) {
                    return item._rel === name;
                }) : links;
                if (link.hasOwnProperty('_href')) {
                    link._href = internaliseApiUrl(link._href);
                }
                if (link.hasOwnProperty('_href_template')) {
                    link._href_template = internaliseApiUrl(link._href_template);
                }
                return link;
            },
            _retrieveLinkProperty: function(object) {
                for (var property in object) {
                    if (object[property].hasOwnProperty('link')) {
                        return object[property].link;
                    }
                }
                return undefined;
            },
            _followLink: function(endpointName, resolveExpression) {
                var endpointLink,
                    deferred = $q.defer(),
                    endpointPath,
                    key,
                    self = this;

                if (!_.isArray(endpointName)) {
                    endpointPath = [endpointName];
                } else {
                    endpointPath = endpointName;
                }
                key = endpointPath.join('|');

                if (resourceCache[key] !== undefined) {
                    deferred.resolve(resolveExpression(resourceCache[key]));
                } else {
                    var traverse = function (paths, index) {
                        if (paths[index] === undefined) {
                            deferred.resolve(resolveExpression(endpointLink));
                            resourceCache[key] = endpointLink;
                        } else {
                            var onResponse = function(returned, headers) {
                                var location = headers("Location");
                                if (location) {
                                    location = internaliseApiUrl(location);
                                    $resource(location).get(onResponse);
                                } else {
                                    var link = self._retrieveLinkProperty(returned);
                                    endpointLink = self._findLink(paths[index], link);
                                    traverse(paths, index+1);
                                }
                            };

                            $resource(endpointLink._href || resolveExpression(endpointLink)).get(onResponse);
                        }
                    };

                    rootResource.get(function (data) {
                        endpoints = data.application.link;
                        endpointLink = self._findLink(endpointPath[0], endpoints);
                        traverse(endpointPath, 1);
                    });
                }

                return deferred.promise;
            },
            getEndpoint: function (endpointName) {
                return this._followLink(endpointName, function (link) {
                    return link._href;
                });
            },
            getTemplatedEndpoint: function (endpointName, params) {

                if (!_.isArray(params)) {
                    params = _.map(params, function (value, key) {
                        return { key: key, value: value };
                    });
                }

                var resolveUrl = function (hrefTemplate) {
                    var result = hrefTemplate;
                    //
                    // href_template may contain information helpful to the client about the query string, our service is not
                    // too concerned with it, we will append whatever parameters we receive
                    //
                    var startQuery = result.indexOf('{?');
                    if (startQuery > 0) {
                        result = result.substring(0, startQuery);
                    }
                    
                    var query = [];
                    _.each(params, function (item) {
                        if (item.value !== undefined) {
                            // If it is not a query string parameter i.e someuri/{id}
                            if (result.indexOf('{' + item.key + '}') >= 0) {
                                result = result.replace('{' + item.key + '}', encodeURIComponent(item.value));
                            // If it is a query string parameter that allows multiple values
                            } else if (_.isArray(item.value)) {
                                _.each(item.value, function (p, index) {
                                    if (item.complex) {
                                        _.each(p, function (pv, pk) {
                                            query.push(item.key + '%5B' + index + '%5D.' + pk + '=' + encodeURIComponent(pv));
                                        });
                                    }
                                    else {
                                        query.push(item.key + '=' + encodeURIComponent(p));
                                    }
                                });
                            // Otherwise it is a single query string param
                            } else {
                                query.push(item.key + '=' + encodeURIComponent(item.value));
                            }
                        } else {
                            result = result.replace('{' + item.key + '}', '');
                        }                        
                    });
                    
                    if (query.length > 0 && hrefTemplate.indexOf('?') >= 0) {
                        result += '?' + query.join('&');
                    }
                    
                    return result;
                };

                return this._followLink(endpointName, function(link) {
                    return resolveUrl(link._href_template);
                });
            },
            internaliseApiUrl: internaliseApiUrl,
            externaliseApiUrl: externaliseApiUrl,
            followEndpoint: followEndpoint
        };
    };
    service.$inject = ['$resource', '$q', 'config'];
    return service;
});