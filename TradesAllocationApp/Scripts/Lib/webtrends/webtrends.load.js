// WebTrends SmartSource Data Collector Tag v10.4.11
// Copyright (c) 2013 Webtrends Inc.  All rights reserved.
// Tag Builder Version: 4.1.2.6
// Created: 2013.09.22
window.webtrendsAsyncInit=function(){

    var dcs=new Webtrends.dcs().init({
        dcsid:"dcsggfg0210000ww2dsli2yb2_6r7b",
        domain:"statse.webtrendslive.com",
        timezone:0,
        i18n:true,
        offsite:true,
        download:true,
        downloadtypes:"xls,doc,pdf,txt,csv,zip,docx,xlsx,rar,gzip",
        anchor:true,
        javascript: true,
        onsitedoms:"isis-manual.delphi.euromoney.com",
        fpcdom:".isis-manual.delphi.euromoney.com",
        plugins:{
            //hm:{src:"//s.webtrends.com/js/webtrends.hm.js"}
        }
        }).track();
};
(function(){
    var s=document.createElement("script"); s.async=true; s.src="/scripts/lib/webtrends/webtrends.js";    
    var s2=document.getElementsByTagName("script")[0]; s2.parentNode.insertBefore(s,s2);
}());
