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
	chrome.contextMenus.create({
		documentUrlPatterns: ["*://*.linkedin.com/*", "*://*.dice.com/*", "*://*.indeed.com/*"],
		contexts: ["selection"],
		title: "Lookup company on glassdoor",
		id: "glassdoorsearch"
		}
	);

}

function handleConextClick(item, tab){
	switch(item.menuItemId) {
		case 'camelcamelcamel':
			openCccTab(tab);
			break;
		case 'glassdoorsearch':
			searchCompanyGlassdoor(item, tab);
			break;
	}
}

function openCccTab(tab){
	if(tab && tab.url){
		let dpIndex = tab.url.indexOf("/dp/");
		let dpId = tab.url.substring(dpIndex + 4, dpIndex + 14);
		let ccc	= "https://camelcamelcamel.com/product/" + dpId;			
		chrome.tabs.create({ url: ccc, index: tab.index + 1});
	}
}

function searchCompanyGlassdoor(item, tab) {
	if(item){
		let company = item.selectionText;//testing, need to find property with selected text
		let searchUrl	= "https://www.glassdoor.com/Search/results.htm?keyword=" + company;			
		chrome.tabs.create({ url: searchUrl, index: tab.index + 1});
	}
}
