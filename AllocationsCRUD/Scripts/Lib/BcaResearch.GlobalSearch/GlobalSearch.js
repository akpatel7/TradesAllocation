define(['jquery', 'underscore', 'typeahead', 'base64'], function ($, _) {
    var appConfig = window.config;
    var aliases = {
        "service": "ServiceFacet",
        "Published Date": "PublishedDateFacet",
        "product": "ReportTypeFacet",
        "content_type": "ContentTypeFacet",
        "locations_annotation": "LocationFacet",
        "dynamic_annotation": "DynamicFacet",
        "asset_class": "AssetClassFacet",
        "author": "AuthorFacet"
    };
    
    var facetValues = [];
    
    $('#globalSearchForm').submit(submit);
    $('#globalSearchForm .icon-play,#globalSearchForm .icon-search').click(submit);
    
    function submit() {
        var facets = [];
        _.each(facetValues, function (val) {
            if (val !== '') {
                var index = val.indexOf(':');
                var key = aliases[val.substring(0, index)];
                var value = val.substring(index + 1);
                facets.push({ key: key, value: value });
            }
        });
        var groupedFacets = _.groupBy(facets, 'key');
        var query = '';
        _.each(_.keys(groupedFacets), function (key) {
            var values = _.map(groupedFacets[key], function (val) { return encodeFacet(val.value); });
            query += '&' + key + '=' + values.join();
        });
        var q = $(".search").val();
        if (q === '') {
            q = '*';
        }

        location.href = appConfig.reportsBaseUrl + "search/#/?q=" + encodeURIComponent(q) + query;
        return false;
    }
    function formatList(autoSuggest, item) {
        if (autoSuggest.value.indexOf('(Chart)') > -1) {
            autoSuggest.value = autoSuggest.value.replace('(Chart)', '<span class="suggestlink">(Chart)</span>');
        }
        if (autoSuggest.value.indexOf('(Report)') > -1) {
            autoSuggest.value = autoSuggest.value.replace('(Report)', '<span class="suggestlink">(Report)</span>');
        }
        return item.html(autoSuggest.value);
    }

    function encodeFacet(facetLabel) {
        return encodeURIComponent(facetLabel.replace(/\s/g, '_'));
    }

    function selectionChanged(changedLozenges) {
        facetValues = changedLozenges;
    }

    function map(data) {
        var res = [];
        $(data.response.docs).each(function (i, doc) {
            res.push({ id: doc.id, value: doc.facet, doc: doc });
        });
        return res;
    }

    function select(data) {
        var doc = data.attributes.doc;
        if (doc) {
            if (doc.id.indexOf('http://content.emii.com/documents') > -1) {
                window.location.href = appConfig.reportsBaseUrl + doc.id.replace('http://content.emii.com/documents', '#/reports');
            } else if (doc.id.indexOf('http://content.emii.com/charts') > -1) {
                window.location.href = appConfig.banBaseUrl + doc.id.replace('http://content.emii.com/charts', '/charts');
            }
        }
    }

    function readCookie(name) {
        var nameEq = escape(name) + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEq) == 0) return unescape(c.substring(nameEq.length, c.length));
        }
        return null;
    }
    
    $(".search").autoSuggest('/isis/globalsuggest',
		{
		    extraParams: '&auth=' + btoa('ISIS realm="bcaresearch.com" token="' + readCookie('DB') + '"') + '&consumerid=gbgnwk1g310y',
		    retrieveComplete: map,
		    startText: 'Search...',
		    keyDelay: 150,
		    resultClick: select,
		    selectionChanged: selectionChanged,
		    formatList: formatList,
		    selectedValuesProp: 'id'
		});
});
