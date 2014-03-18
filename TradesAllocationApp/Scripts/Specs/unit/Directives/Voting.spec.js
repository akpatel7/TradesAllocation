define(['angular',
        'mocks',
        'App/Directives/Voting'], function () {
    'use strict';

    describe('When voting buttons are displayed', function () {
        var scope, element;

        beforeEach(function() {
            module('App');
            module('Voting.Spec');
        });

        function promiseOf(stubResult) {
            return {
                then: function (callback) {
                    return promiseOf(callback(stubResult));
                }
            };
        }

        angular.module('Voting.Spec', [])
            .service('Like', ['$q', function () {
                return {
                    like: function() { return promiseOf(null); }
            };
            }]).factory('Analytics', function () {
                return {
                    registerPageTrack: function () {
                    },
                    registerClick: function () {
                    },
                    logUsage: function () {
                    }
                };
            });
        
        describe('Given the item has no votes', function() {
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope;
                scope.voteValue = "neutral";
                scope.blobId = 'http://emii.data.com/blobid';
                scope.likeCount = 3;
                scope.dislikeCount = 2;
                scope.disabled = false;
                element = $compile('<span voting disabled="disabled" state="voteValue" resource-type="blob" resource-id="blobId" like-count="likeCount" dislike-count="dislikeCount" show-count="true" />')(scope);
                scope.$root.$digest();
            }));

            it('should show the up and down icons', function () {
                expect(element.find(".icon-thumbs-up.icon-off").length).toBe(1);
                expect(element.find(".icon-thumbs-down.icon-off").length).toBe(1);
            });
            
            it('Should have web-trends', function () {
                expect($(element.find("a[click-tracking]")[0]).attr('click-tracking')).toBe('DCSext.selectagree_blob');
                expect($(element.find("a[click-tracking]")[1]).attr('click-tracking')).toBe('DCSext.selectdisagree_blob');
            });

            it('should show the like and dislike counts', function () {
                expect(element.find(".icon-thumbs-up").text()).toBe("3");
                expect(element.find(".icon-thumbs-down").text()).toBe("2");
            });

            describe('When I click the up button', function () {
                beforeEach(inject(function (Like) {
                    spyOn(Like, "like").andCallThrough();
                    element.find(".icon-thumbs-up").trigger('click');
                    scope.$root.$digest();
                }));

                it('should set the new value', function () {
                    expect(scope.voteValue).toBe('like');
                });
                
                it('should highlight the arrow up', function () {
                    expect(element.find(".icon-thumbs-up.icon-on").length).toBe(1);
                });
                
                it('Should have web-trends', function () {
                    expect($(element.find("a[click-tracking]")[0]).attr('click-tracking')).toBe('DCSext.unselectagree_blob');
                    expect($(element.find("a[click-tracking]")[1]).attr('click-tracking')).toBe('DCSext.selectdisagree_blob');
                });
                
                it('should post a like', inject(function (Like) {
                    expect(Like.like).toHaveBeenCalledWith('blob', 'http://emii.data.com/blobid', 'like');
                }));
                
                it('should show the like and dislike counts', function () {
                    expect(element.find(".icon-thumbs-up").text()).toBe("4");
                    expect(element.find(".icon-thumbs-down").text()).toBe("2");
                });
                
                describe('When I click the up button again', function () {
                    beforeEach(function () {
                        element.find(".icon-thumbs-up").trigger('click');
                        scope.$root.$digest();
                    });

                    it('Should set the new value', function () {
                        expect(scope.voteValue).toBe('neutral');
                    });

                    it('Should not highlight the arrow up', function () {
                        expect(element.find(".icon-on").length).toBe(0);
                    });
                    
                    it('Should have web-trends', function () {
                        expect($(element.find("a[click-tracking]")[0]).attr('click-tracking')).toBe('DCSext.selectagree_blob');
                        expect($(element.find("a[click-tracking]")[1]).attr('click-tracking')).toBe('DCSext.selectdisagree_blob');
                    });

                    it('Should post a like "neutral"', inject(function (Like) {
                        expect(Like.like).toHaveBeenCalledWith('blob', 'http://emii.data.com/blobid', 'neutral');
                    }));
                    
                    it('should show the like and dislike counts', function () {
                        expect(element.find(".icon-thumbs-up").text()).toBe("3");
                        expect(element.find(".icon-thumbs-down").text()).toBe("2");
                    });
                });
            });

            describe('When the buttons are disabled', function () {
                beforeEach(function() {
                    scope.disabled = true;
                    scope.$root.$digest();

                });
                
                it('should not have links', function () {
                    expect(element.find('a').length).toBe(0);
                });
                
                it('should not be clickable', function () {
                    element.find(".icon-thumbs-up").trigger('click');
                    expect(scope.voteValue).toBe('neutral');
                });
            });
        });

        describe('Given count is disabled', function() {
            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope;
                scope.voteValue = "neutral";
                scope.blobId = 'http://emii.data.com/blobid';
                scope.likeCount = 3;
                scope.dislikeCount = 2;
                scope.disabled = false;
                element = $compile('<span voting disabled="disabled" state="voteValue" resource-type="blob" resource-id="blobId" like-count="likeCount" dislike-count="dislikeCount" show-count="false" />')(scope);
                scope.$root.$digest();
            }));
            
            it('should not show the like and dislike counts', function () {
                expect(element.find(".icon-thumbs-up").text()).toBe('');
                expect(element.find(".icon-thumbs-down").text()).toBe('');
            });
        });

        it('should not display negative counts', inject(function ($rootScope, $compile) {
            scope = $rootScope;
            element = $compile('<span voting disabled="disabled" state="voteValue" resource-type="blob" resource-id="blobId" like-count="likeCount" dislike-count="dislikeCount" show-count="true" />')(scope);
            scope.$root.$digest();
            expect(element.isolateScope().sum(-1, -1)).toBe(0);
        }));
       
    });
});