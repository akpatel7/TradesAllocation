define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var controller = function ($scope, $rootScope, Analytics, Follow, $window, Notifications) {
        
        function traverseTree(node, callback) {
            if (node === undefined || node === null) {
                return;
            }
            callback(node);

            traverseTree(node.firstChild, callback);
            traverseTree(node.nextSibling, callback);
        }
        
        function getRootNode(node) {
            return node.parentNode ? getRootNode(node.parentNode) : node;
        }
        
        $scope.buildAllocationMenu = function (row) {
            var menu = {
                Buttons: ['Cancel', 'Ok'],
                Texts : { Cancel: 'Cancel', Ok: 'Follow' },
                Items: [
                     { Name: 'FollowCaption', Text: 'FOLLOW: ' + row.Instrument, Caption: 1 },
                     { Name: row.Uri, Text: 'Allocation', Value: row.isFollowed, Left: 1, Bool: 1 },
                     { Name: row.InstrumentUri, Text: 'Instrument', Value: row.isAllocationInstrumentFollowed, Left: 1, Bool: 1 }
                ],
                MinHeight: 200,
                MinWidth: 300,
                OnSave: function (item, data) {
                    // Follow allocation
                    if (data[0].length > 0 && row.isFollowed === 0) {
                        Follow.followAllocation({
                            uri: data[0],
                            label: row.Instrument
                        }).then(function (result) {
                            row.followPerspectiveId = result;
                            row.isFollowed = 1;
                            Analytics.registerClick('DCSext.followAllocation', row.Instrument);
                        });
                    }
                    if (data[0].length === 0 && row.isFollowed === 1) {
                        Follow.unfollowAllocation({
                            perspectiveId: row.followPerspectiveId,
                            label: row.Instrument
                        }).then(function (result) {
                            row.followPerspectiveId = undefined;
                            row.isFollowed = 0;
                            Analytics.registerClick('DCSext.unfollowAllocation', row.Instrument);
                        });
                    }

                    // Follow instrument
                    if (data[1].length > 0 && row.isAllocationInstrumentFollowed === 0) {
                        Follow.followAllocationInstrument({
                            uri: data[1],
                            label: row.Instrument
                        }).then(function (result) {
                            row.followAllocationInstrumentPerspectiveId = result;
                            row.isAllocationInstrumentFollowed = 1;
                            Analytics.registerClick('DCSext.followAllocationInstrument', row.Instrument);
                            $scope.updateInstrumentFollowedState(row, { InstrumentUri: row.InstrumentUri, isAllocationInstrumentFollowed: 1, followAllocationInstrumentPerspectiveId: result });
                        });
                    }
                    if (data[1].length === 0 && row.isAllocationInstrumentFollowed === 1) {
                        Follow.unfollowAllocationInstrument({
                            perspectiveId: row.followAllocationInstrumentPerspectiveId,
                            label: row.Instrument
                        }).then(function (result) {
                            row.followAllocationInstrumentPerspectiveId = undefined;
                            row.isAllocationInstrumentFollowed = 0;
                            Analytics.registerClick('DCSext.unfollowAllocationInstrument', row.Instrument);
                            $scope.updateInstrumentFollowedState(row, { InstrumentUri: row.InstrumentUri, isAllocationInstrumentFollowed: 0, followAllocationInstrumentPerspectiveId: undefined });
                        });
                    }
                },
                SaveType: 4
            };
            return menu;
        };
        
        $scope.buildPortfolioMenu = function (row) {
            var menu = {},
                isPortolioFullyFollowed = 1;
            
            var checkIfPortfolioIsFullyFollowed = function (node) {
                if (node === undefined || node === null) {
                    return;
                }
                if (node.isFollowed === 0) {
                    isPortolioFullyFollowed = 0;
                    return;
                }
                checkIfPortfolioIsFullyFollowed(node.firstChild);
                checkIfPortfolioIsFullyFollowed(node.nextSibling);
            };
            
            checkIfPortfolioIsFullyFollowed(row.firstChild);
            _.extend(menu, {
                IsPortolioFullyFollowed: isPortolioFullyFollowed
            });
            _.extend(menu, {
                Buttons: ['Cancel', 'Ok'],
                Texts: { Cancel: 'Cancel', Ok: 'Follow' },
                Items: [
                     { Name: 'FOLLOW PORTFOLIO', Caption: 1 },
                     { Name: row.Uri, Text: row.Instrument, Value: row.isFollowed, Left: 1, Bool: 1 },
                     { Name: 'all', Text: 'All Child Allocations', Value: isPortolioFullyFollowed, Left: 1, Bool: 1 }
                ],
                MinHeight: 200,
                MinWidth: 300,
                OnSave: function (item, data) {
                    if (data[1].length > 0 && menu.IsPortolioFullyFollowed === 0) {
                        // follow everything
                        traverseTree(row.firstChild, function (node) {
                            if (node.isFollowed === 0 && node.isPortfolio !== 1) {
                                Follow.followAllocation({
                                    uri: node.Uri,
                                    label: node.Instrument,
                                    enableNotification: false
                                }).then(function (result) {
                                    node.followPerspectiveId = result;
                                    node.isFollowed = 1;
                                });
                            }
                        });
                        Notifications.success('All child allocations are now being followed.');
                    } else if (data[1].length === 0 && menu.IsPortolioFullyFollowed === 1) {
                        // unfollow everything
                        traverseTree(row.firstChild, function (node) {
                            if (node.isFollowed === 1 && node.isPortfolio !== 1) {
                                Follow.unfollowAllocation({
                                    perspectiveId: node.followPerspectiveId,
                                    label: node.Instrument,
                                    enableNotification: false
                                }).then(function(result) {
                                    node.followPerspectiveId = undefined;
                                    node.isFollowed = 0;
                                });
                            }
                        });
                        Notifications.success('Child allocations are no longer being followed.');
                    }
                    // handle the porfolio
                    if ((data[0].length > 0) && row.isFollowed === 0) {
                        Follow.followPortfolio({
                            uri: row.Uri,
                            label: row.Instrument
                        }).then(function (result) {
                            row.followPerspectiveId = result;
                            row.isFollowed = 1;
                            Analytics.registerClick('DCSext.followPortfolio', row.Instrument);
                        });
                    }
                    if (data[0].length === 0 && row.isFollowed === 1) {
                        Follow.unfollowPortfolio({
                            perspectiveId: row.followPerspectiveId,
                            label: row.Instrument
                        }).then(function (result) {
                            row.followPerspectiveId = undefined;
                            row.isFollowed = 0;
                            Analytics.registerClick('DCSext.unfollowPortfolio', row.Instrument);
                        });
                    }
                },
                SaveType: 4
            });
            return menu;
        };

        $scope.getFollowedState = function (row) {
            if (row.isPortfolio === 1) {
                var isPortolioFullyFollowed = 1,
                    isPortolioPartiallyFollowed = 0;

                var checkIfPortfolioIsFullyFollowed = function(node) {
                    if (node === undefined || node === null) {
                        return;
                    }
                    if (node.isFollowed === 0) {
                        isPortolioFullyFollowed = 0;
                    } else {
                        isPortolioPartiallyFollowed = 1;
                    }
                    if (isPortolioFullyFollowed === 0 && isPortolioPartiallyFollowed === 1) {
                        return;
                    }
                    checkIfPortfolioIsFullyFollowed(node.firstChild);
                    checkIfPortfolioIsFullyFollowed(node.nextSibling);
                };
                checkIfPortfolioIsFullyFollowed(row.firstChild);
                
                if (isPortolioFullyFollowed === 1 && row.isFollowed === 1) {
                    return 'on';
                }
                if (row.isFollowed === 1 || isPortolioPartiallyFollowed) {
                    return 'half';
                }
                return 'off';
            } else {
                if (row.isFollowed && row.isAllocationInstrumentFollowed) {
                    return 'on';
                }
                if (row.isFollowed || row.isAllocationInstrumentFollowed) {
                    return 'half';
                }
                return 'off';
            }
        };
      
        $scope.toggleFollow = function (row, $event) {
            var menu;
            if (row.isPortfolio === 0) {
                menu = $scope.buildAllocationMenu(row);
            } else {
                menu = $scope.buildPortfolioMenu(row);
            }
            if ($scope.grid.Dialog) {
                $scope.grid.CloseDialog();
            }
            $scope.grid.Dialog = $window.ShowMenu(menu, { Tag: $scope.grid.GetCell(row, 'Actions') });
            $event.stopPropagation();
        };

        $scope.updateInstrumentFollowedState = function (row, perspectiveDetails) {
            var rootNode = getRootNode(row);
            traverseTree(rootNode, function (node) {
                if (node.InstrumentUri === perspectiveDetails.InstrumentUri) {
                    node.isAllocationInstrumentFollowed = perspectiveDetails.isAllocationInstrumentFollowed;
                    node.followAllocationInstrumentPerspectiveId = perspectiveDetails.followAllocationInstrumentPerspectiveId;
                }
            });
        };
    };

    controller.$inject = ['$scope', '$rootScope', 'Analytics', 'Follow', '$window', 'Notifications'];

    return controller;
});