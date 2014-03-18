define(['App/Services/DateService',
        'moment',
        'angular',
        'mocks',        
        'App/Services/services'], function (DateService, moment) {
            describe('DateService', function () {
                beforeEach(function () {
                    module('App');
                });

                describe('Given we have 2 dates 21 days apart', function() {
                    describe('When calculating the difference in weeks', function () {
                        it('Should return 3 weeks', inject(function (Dates) {
                            var start = new Date(2013, 1, 1, 0, 0, 0),
                                end = new Date(2013, 1, 22, 0, 0, 0);
                            expect(Dates.calculateDifferenceInWeeks(start, end)).toBe(3);
                        }));
                    });
                });
                
                describe('Given we have 2 dates 8 days apart', function () {
                    describe('When calculating the difference in weeks', function () {
                        it('Should return 1 week', inject(function (Dates) {
                            var start = new Date(2013, 1, 1, 0, 0, 0),
                                end = new Date(2013, 1, 9, 0, 0, 0);
                            expect(Dates.calculateDifferenceInWeeks(start, end)).toBe(1);
                        }));
                    });
                });
                
                describe('Given we have 2 dates 8 days apart', function () {
                    describe('When calculating the difference in days', function () {
                        it('Should return 8 days', inject(function (Dates) {
                            var start = new Date(2013, 1, 1, 0, 0, 0),
                                end = new Date(2013, 1, 9, 0, 0, 0);
                            expect(Dates.calculateDifferenceInDays(start, end)).toBe(8);
                        }));
                    });
                });
                
                describe('Given we have 2 dates 24 hours apart', function () {
                    describe('When calculating the difference in milliseconds', function () {
                        it('Should return 86400000 milliseconds', inject(function (Dates) {
                            var start = new Date(2013, 1, 1, 0, 0, 0),
                                end = new Date(2013, 1, 2, 0, 0, 0);
                            expect(Dates.calculateDifferenceInMilliseconds(start, end)).toBe(86400000);
                        }));
                    });
                });
               
                describe('Given we have 2 dates, 2 months apart', function () {

                    describe('When calculating the difference in months', function() {
                        it('Should return 2 months', inject(function (Dates) {
                            var start = new Date(2013, 1, 10, 0, 0, 0),
                                end = new Date(2013, 3, 11, 0, 0, 0);
                            expect(Dates.calculateDifferenceInMonths(start, end)).toBe(2);
                        }));
                    });

                    describe('When calculating the difference between 2013-10-31 and 2013-05-05', function () {
                        it('Should return 5 months', inject(function (Dates) {
                            var start = new Date(2013, 5, 5, 0, 0, 0),
                                end = new Date(2013, 10, 31, 0, 0, 0);
                            expect(Dates.calculateDifferenceInMonths(start, end)).toBe(5);
                        }));
                    });
                    
                    describe('When calculating the difference between 2013-07-01 and 2013-06-01', function () {
                        it('Should return 5 months', inject(function (Dates) {
                            var start = new Date(2013, 6, 1, 0, 0, 0),
                                end = new Date(2013, 7, 1, 0, 0, 0);
                            expect(Dates.calculateDifferenceInMonths(start, end)).toBe(1);
                        }));
                    });
                    
                    describe('When calculating the difference between 2013-10-31 and 2013-05-05 using date strings', function () {
                        it('Should return 5 months', inject(function (Dates) {
                            var start = Dates.toDate('2013-05-05'),
                                end = Dates.toDate('2013-10-31');
                            expect(Dates.calculateDifferenceInMonths(start, end)).toBe(5);
                        }));
                    });
                    
                    describe('When converting 2013-05-05 into a date', function () {
                        it('Should return a date', inject(function (Dates) {
                            expect(Dates.toDate('2013-05-05').toString().substring(0, 24)).toBe('Sun May 05 2013 00:00:00');
                        }));
                    });
                    
                    describe('When converting 2013-06-01 into a date', function () {
                        it('Should return a date', inject(function (Dates) {
                            expect(Dates.toDate('2013-06-01').toString().substring(0, 24)).toBe('Sat Jun 01 2013 00:00:00');
                        }));
                    });
                });

                describe('When parsing an XML timespan', function() {
                    it('Should return the correct number of months for the timespan', inject(function(Dates) {
                        var period = 'P6M';
                        var result = Dates.parseTimeSpan(period);
                        expect(result.months).toBe(6);
                    }));
                    it('Should return 0 months for invalid string', inject(function(Dates) {
                        var period = 'shazzwazzle';
                        var result = Dates.parseTimeSpan(period);
                        expect(result.months).toBe(0);
                    }));
                });

                describe('When parsing a lastUpdated filter', function() {
                    it('Should return the correct value for LastWeek', inject(function (Dates) {
                        var result = Dates.parseFilter('LastWeek', moment('2013-07-27'));
                        expect(result).toBe('2013-07-20');
                    }));
                    it('Should return the correct value for LastMonth', inject(function (Dates) {
                        var result = Dates.parseFilter('LastMonth', moment('2013-07-27'));
                        expect(result).toBe('2013-06-27');
                    }));
                    it('Should return the correct value for LastQuarter', inject(function (Dates) {
                        var result = Dates.parseFilter('LastQuarter', moment('2013-07-27'));
                        expect(result).toBe('2013-04-27');
                    }));
                    it('Should return the correct value for LastYear', inject(function (Dates) {
                        var result = Dates.parseFilter('LastYear', moment('2013-07-27'));
                        expect(result).toBe('2012-07-27');
                    }));
                });

                describe('When converting to UTC date', function() {
                    it('should return 1372636800000 for "2013-07-01" ', inject(function (Dates) {
                        var result = Dates.toUTCDate('2013-07-01');
                        expect(result).toBe(1372636800000);
                    }));

                    // might fail because of bug in momentjs (https://github.com/moment/moment/issues/1175) 
                    // temporarly fixed it by patching momentjs with fix (current version 2.3.1) from https://github.com/moment/moment/pull/1187
                    it('should return 1366416000000 for "2013-04-20T00:00:00Z"', inject(function (Dates) {
                        var result = Dates.toUTCDate('2013-04-20T00:00:00');
                        expect(result).toBe(1366416000000);
                    }));
                });
            });
        });