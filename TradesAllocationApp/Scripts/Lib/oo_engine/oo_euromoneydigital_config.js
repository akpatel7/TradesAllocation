function getMetaContents(mn) {

        var m = document.getElementsByTagName('meta');

        for(var i in m) {

               if(m[i].name == mn) {

                       return m[i].content;

               }

        }

}

 

/* [+] Floating Icon configuration */

var oo_floating = new OOo.Ocode({

        floating: { }

        , customVariables: {

               WTseg1: getMetaContents('WT.seg_1') || ''

        }

        , onPageCard: {

               closeWithOverlay: {}

        }

});

 

/* On Exit Event configuration */

var oo_event = new OOo.Ocode({

        events: {

               onExit: 0

               , disableLinks: /^((.*).euromoneydigital\.com(.*))/i

               , disableFormElements: true

        }

        , cookie: {

                 name: 'oo_event'

               , type: 'domain'

               , expiration: 2419200 // 4 weeks

        }

//        , referrerRewrite: {

//               searchPattern: /:\/\/[^\/]*/

//               , replacePattern: '://exit.euromoneydigital.com'

//        }

        , customVariables: {

               WTseg1: getMetaContents('WT.seg_1') || ''

        }

});

