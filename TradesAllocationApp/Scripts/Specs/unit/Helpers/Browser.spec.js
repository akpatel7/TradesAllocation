define(['App/Helpers/Browser'], function(browser) {
	describe("browserHelper", function() {
		var browserNavigator = {};
		var setBrowserToIE8 = function() {
			browserNavigator.userAgent = browser.userAgentForIE8;
			browserNavigator.appName = browser.appNameForIE;

		};
		var setBrowserToChrome = function() {
			browserNavigator.userAgent = browser.userAgentForChrome;
			browserNavigator.appName = browser.appNameForChrome;
		};

		afterEach(function() {
			setBrowserToChrome();
		});
		describe("when calling isIE", function() {
			describe("when the browser is IE", function() {
				beforeEach(function() {
					setBrowserToIE8();
				});
				it('should return true', function() {
					expect(browser.isIE(browserNavigator)).toBe(true);
				});
			});
			describe("when the browser is Chrome", function() {
				it('should return false', function() {
					expect(browser.isIE(browserNavigator)).toBe(false);
				});
			});
		});
		describe("when calling isIE8", function() {
			describe("when the browser is IE8", function() {
				beforeEach(function() {
					setBrowserToIE8();
				});
				it('should return true', function() {
					expect(browser.isIE8(browserNavigator)).toBe(true);
				});
			});
			describe("when the browser is Chrome", function() {
				it('should return false', function() {
					expect(browser.isIE8(browserNavigator)).toBe(false);
				});
			});
		});
	});
});