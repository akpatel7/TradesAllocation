define(['App/Helpers/String'], function(string) {
    describe("string", function() {
        describe('Trim', function() {
            describe('Given we have a string with spaces before', function() {
                it('Spaces should be removed', function() {
                    expect(string.trim('  here is a string')).toBe('here is a string');
                });
            });

            describe('Given we have a string with spaces after', function() {
                it('Spaces should be removed', function() {
                    expect(string.trim('here is a string   ')).toBe('here is a string');
                });
            });

            describe('Given we have a string with spaces before and after', function() {
                it('Spaces should be removed', function() {
                    expect(string.trim('  here is a string   ')).toBe('here is a string');
                });
            });

            describe('Capitalizing', function() {
                describe('Given we have "word"', function() {
                    it('should be capitalized to "Word"', function() {
                        expect(string.capitalize('word')).toBe('Word');
                    });
                });

                describe('Given we have "woRd"', function() {
                    it('should be capitalized to "Word"', function() {
                        expect(string.capitalize('woRd')).toBe('Word');
                    });
                });
            });

            describe('Wrapping', function() {
                describe('Here is some text', function() {
                    it('should add return Here is some t...', function() {
                        expect(string.wrap('Here is some text', 14)).toBe('Here is some t...');
                    });

                    it('should add return Here is some text', function() {
                        expect(string.wrap('Here is some text', 20)).toBe('Here is some text');
                    });
                });

            });
            describe('Stripping illegal html attribute characters', function() {
                describe('Given legal text', function() {
                    it('should return the text unchanged', function() {
                        expect(string.stripIllegalHtmlAttributeCharacters('Here is some text')).toBe('Here is some text');
                    });
                });
                describe('Given text with illegal characters', function() {
                    it('should return the text with the illegal characters removed', function() {
                        expect(string.stripIllegalHtmlAttributeCharacters('Here is< some:£ text~#')).toBe('Here is some text');
                    });
                });

            });
            
            describe('Trimming', function () {
                describe('Trimming / for http://localhost/', function () {
                    it('should return http://localhost', function () {
                        expect(string.trimEnd('http://localhost/', '/')).toBe('http://localhost');
                    });
                });

                describe('Trimming / for http://localhost', function () {
                    it('should return http://localhost', function () {
                        expect(string.trimEnd('http://localhost', '/')).toBe('http://localhost');
                    });
                });
            });
            describe('Padding digits', function() {
                describe('Given an integer', function() {
                    it('should return a string with digits padded appropriately', function() {
                        expect(string.padDigits(5, 1)).toBe('5');
                        expect(string.padDigits(5, 3)).toBe('005');
                    });
                });
            });
        });
    });
});