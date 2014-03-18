define(['underscore',
    'amplify',
    'App/Services/TradesColumnsService',
    'angular',
    'mocks',
    'App/Services/services'

], function(_, amplify) {
    describe('TradesColumns Service', function() {

        beforeEach(function() {
            module('App.services');
        });
        describe('When calling getColumns', function () {
            it('should return column data', inject(function (TradesColumns) {
                TradesColumns.resetColumns();
                var result = TradesColumns.getColumns();
                expect(result).toBeDefined();
            }));
        });
        describe('When calling saveColumns', function() {
            beforeEach(inject(function(TradesColumns) {
                spyOn(amplify, 'store').andCallFake(function() {});
                TradesColumns.saveColumns(null);
            }));
            it('should call amplify store', function () {
                expect(amplify.store).toHaveBeenCalled();
            });
        });
        describe('When calling getSavedColumns', function() {
            beforeEach(inject(function(TradesColumns) {
                spyOn(amplify, 'store').andCallFake(function() {});
                TradesColumns.getSavedColumns();
            }));
            it('should call amplify store', function () {
                expect(amplify.store).toHaveBeenCalled();
            });
        });
        describe('When resetting columns to the default values', function() {
            it('Should return columns in their default state', inject(function(TradesColumns) {
                expect(TradesColumns.resetColumns()).toEqual(TradesColumns._getDefaultColumns());
            }));
        });
        describe('When initialising column order and visibility', function() {
            var scope;
            beforeEach(inject(function (TradesColumns) {
                scope = {
                    $broadcast: angular.noop
                };
                spyOn(scope, '$broadcast');
                var columns = _.clone(TradesColumns._getDefaultColumns());
                columns['favourites'].ordinal = 1;
                columns['service_code'].ordinal = 0;
                spyOn(amplify, 'store').andReturn(columns);
                
                TradesColumns.initTradesColumns(scope, true, false);
            }));
            it('Should move the columns as required', function() {
                expect(amplify.store).toHaveBeenCalledWith('tradeColumns');
                expect(scope.$broadcast).toHaveBeenCalled();
                expect(scope.$broadcast.callCount).toBe(32);
            });
        });
    });
});