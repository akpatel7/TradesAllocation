$.widget('bca.topnavigation', {

	options: {
		menu: []

	},
	_create: function () {
		var self = this,
			i,
			j,
			k,
			nav;
		

		nav = $('<ul/>', {'class': 'nav'});
		
		for(i=0; i<self.options.menu.length; i++) {
			var item = $('<li/>'),
				link = $('<a/>', {
					'href': '#',
					'target': self.options.menu[i].openInNewTab ? '_blank' : '_self'
				}),
				menu = $('<ul/>', {'class': 'dropdown-menu'});

			if(self.options.menu[i].url !== undefined) {
				link.attr('href', self.options.menu[i].url)
					.html(self.options.menu[i].label);
				if(self.options.menu[i].trackingAction !== undefined) {
					link.attr('data-tracking-action', self.options.menu[i].trackingAction);
				}
				item.append(link);
			} else {
				item.addClass('dropdown');
				link.addClass('dropdown-toggle')
					.attr('data-toggle', 'dropdown')
					.html(self.options.menu[i].label + '<b class="caret"></b>');

				for(j=0; j<self.options.menu[i].items.length; j++) {
					var menuItemList = self.options.menu[i].items[j].items,
						menuItem = $('<li/>', menuItemList !== undefined ? {'class': 'dropdown-submenu'} : {}),
						menuItemLink = $('<a/>', {
													href: self.options.menu[i].items[j].url,
													'target': self.options.menu[i].items[j].openInNewTab ? '_blank' : '_self',
													'data-tracking-action': self.options.menu[i].items[j].trackingAction
												}).text(self.options.menu[i].items[j].label);

					if (self.options.menu[i].items[j].items !== undefined) {
						var subsubmenu = $('<ul/>', {'class': 'dropdown-menu'});
						
						for(k=0; k<menuItemList.length; k++) {
							var subMenuItem = $('<li/>'),
								subMenuItemLink = $('<a/>', { 
									href: menuItemList[k].url,
									'target': menuItemList[k].openInNewTab ? '_blank' : '_self',
									'data-tracking-action': menuItemList[k].trackingAction
								}).text(menuItemList[k].label);
							subMenuItem.append(subMenuItemLink);
							subsubmenu.append(subMenuItem);
						}
						menuItem.append(subsubmenu);
					}

					menuItem.append(menuItemLink);
					menu.append(menuItem);
					
				}

				item.append(link);
				item.append(menu);
			}
				
			nav.append(item);
		}
		self.element.append($('<div/>', { 'class': '' }).html(nav));
		
	}
});