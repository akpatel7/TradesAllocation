define(['App/Helpers/Date'], function(dateHelper) {
	describe("dateHelper", function() {
		it('has month names', function() {
			expect(dateHelper.monthNames.length).toBe(12);
		});
		describe("getDateString given a date", function() {
			it('returns a string', function() {
				var date = new Date('25 Dec 2012');
				expect(dateHelper.getDateString(date)).toEqual("2012-12-25");
			});
		});
		describe("getDateStringForDisplay given a date", function() {
			it('returns a string', function() {
				var date = new Date('25 Dec 2012');
				expect(dateHelper.getDateStringForDisplay(date)).toEqual("Dec 25, 2012");
			});
		});
		describe("addDays given a date", function() {
			it('returns a date', function() {
				var date = new Date('25 Dec 2013');
				expect(dateHelper.addDays(date,10)).toEqual(new Date('04 Jan 2014'));
				expect(dateHelper.addDays(date,-10)).toEqual(new Date('15 Dec 2013'));				
			});
		});
	});
});