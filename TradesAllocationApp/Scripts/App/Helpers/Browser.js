define(['angular'], function(angular) {
    'use strict';


    var getInternetExplorerVersion = function(browserNavigator)
    // Returns the version of Internet Explorer or a -1 (indicating the use of another browser).
    //official Microsoft code - http://msdn.microsoft.com/en-us/library/ms537509%28v=vs.85%29.aspx
    {
        if(!browserNavigator){
            browserNavigator = navigator;
        }

        var rv = -1; // Return value assumes failure.
        if (browserNavigator.appName === 'Microsoft Internet Explorer') {
            var ua = browserNavigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            }
        }
        return rv;
    };



    return {
        navigator: navigator,
        isIE: function(browserNavigator) {
            var ieVersion = getInternetExplorerVersion(browserNavigator);
            return ieVersion > -1;
        },
        isIE8: function(browserNavigator) {
            //also returns true for IE7, in case anyone is still using that
            var ieVersion = getInternetExplorerVersion(browserNavigator);
            return (ieVersion > -1 && ieVersion < 9);
        },
        userAgentForIE8: "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Win64; x64; Trident/4.0; .NET CLR 2.0.50727; SLCC2; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)",
        userAgentForChrome: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36",
        appNameForIE: "Microsoft Internet Explorer",
        appNameForChrome: "Netscape"
    };

});