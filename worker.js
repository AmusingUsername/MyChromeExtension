chrome.runtime.onInstalled.addListener(buildContextMenu);
chrome.contextMenus.onClicked.addListener((item, tab) =>
	{handleConextClick(item, tab)});

function buildContextMenu(info) {
//Amazon
	chrome.contextMenus.create({
		documentUrlPatterns: ["*://*.amazon.com/*dp/*"],
		title: "Check CamelCamelCamel price history",
		id: "camelcamelcamel"
		}
	);

}

function handleConextClick(item, tab){
	switch(item.menuItemId) {
		case 'camelcamelcamel':
			openCccTab(tab);
			break;
	}
}

function openCccTab(tab){
	if(tab && tab.url){
		dpIndex = tab.url.indexOf("/dp/");
		dpId = tab.url.substring(dpIndex + 4, dpIndex + 14);
		ccc	= "https://camelcamelcamel.com/product/" + dpId;			
		chrome.tabs.create({ url: ccc, index: tab.index + 1});
	}
}