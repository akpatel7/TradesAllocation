define(['App/Helpers/Math'], function(math) {
	describe("mathHelper", function() {
		it('has equality operators', function() {
			expect(math.equalityOperators.equalTo).toBe('=');
			expect(math.equalityOperators.greaterThanOrEqualTo).toBe('>=');
			expect(math.equalityOperators.lessThanOrEqualTo).toBe('<=');
		});
		describe('When getOperatorLabel is called', function() {
			it('should return a string', function() {
				expect(math.getOperatorLabel(math.equalityOperators.equalTo)).toBe("Equal to");
				expect(math.getOperatorLabel(math.equalityOperators.lessThanOrEqualTo)).toBe("Less than or equal to");
				expect(math.getOperatorLabel(math.equalityOperators.greaterThanOrEqualTo)).toBe("Greater than or equal to");								
			});
		});
	});
});