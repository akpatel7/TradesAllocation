define(['angular', 'underscore', 'App/Helpers/String'], function (angular, _, string) {
    'use strict';
    
    var builder = function (DataEndpoint, $q) {
        var container = function (apiPath, containerType, relatedResourceType, id, viewableId) {
            var params = relatedResourceType === 'trade' ? [{ key: 'id', value: id }] : [{ key: 'uri', value: id }];
            return DataEndpoint.getTemplatedEndpoint(apiPath, params)
                .then(function (result) {
                    var body = {
                        'link': {
                            '_rel': relatedResourceType,
                            '_href': DataEndpoint.externaliseApiUrl(result)
                        },
                        'container-type': containerType,
                        'related-resource-type': relatedResourceType
                    };
                    switch (relatedResourceType) {
                        case 'view':
                            _.extend(body, { 'viewable-uri': viewableId });
                            return { 'view-perspective': body };
                        case 'trade':
                            _.extend(body, { 'trade-id': id });
                            return { 'trade-perspective': body };
                        default:
                            var doc = {};
                            doc[relatedResourceType + '-perspective'] = body;
                            return doc;
                    }
                });
        };
        return {
            buildPerspective: function (resourceType, containerType, id) {
                return container(resourceType, containerType, resourceType, id);
            },
            buildViewPerspective: function(containerType, id, viewableId) {
                return container('view', containerType, 'view', id, viewableId);
            },
            buildViewablePerspective: function(containerType, id) {
                return container('viewable', containerType, 'viewable', id);
            },
            buildTradePerspective: function(containerType, id) {
                return container(['bca-trades', 'trade'], containerType, 'trade', id);
            },
            buildTradableThingPerspective: function(containerType, id) {
                return container(['bca-trades', 'tradable-thing'], containerType, 'tradablething', id);
            },
            buildPortfolioPerspective: function (containerType, id) {
                return container(['bca-trades', 'portfolio'], containerType, 'portfolio', id);
            },
            buildAllocationPerspective: function (containerType, id) {
                return container(['bca-trades', 'allocation'], containerType, 'allocation', id);
            }
        };        
    };

    builder.$inject = ['DataEndpoint', '$q'];
    return builder;
});